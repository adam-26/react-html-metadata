// @flow
import ExecutionEnvironment from 'exenv';
import invariant from 'invariant';
import ScriptTag from 'react-script-tag';
import {
    reducePropsToState,
    mapStateToComponents,
    deepEqual
} from 'react-cap/lib/CapUtils';

const IS_DEV = process.env.NODE_ENV !== 'production';

export default class Metadata {
    _metadataList: Array<Object>;
    _isHydratingClient: boolean;

    // Expose for testing
    static canUseDOM = ExecutionEnvironment.canUseDOM;

    /**
     * Create a new metadata instance.
     *
     * @param md [Object] optionally, assign initial metadata
     * @returns {Metadata}
     * @public
     */
    static createNew(md?: Object) {
        return new Metadata(false, false, typeof md !== 'undefined' ? [md] : []);
    }

    /**
     * Create a new metadata instance for hydrating the client render.
     * @param state
     * @returns {Metadata}
     * @public
     */
    static createForHydration(state?: Array<Object>) {
        return new Metadata(true, false, state);
    }

    /**
     * Create a new metadata instance to load metadata before the react render lifecycle for SSR with streams.
     * @param state
     * @returns {Metadata}
     * @public
     */
    static createForServerStreamRender(state?: Array<Object>) {
        return new Metadata(false, true, state);
    }

    /**
     * Creates a new Metadata instance.
     *
     * @param isHydrating
     * @param isServerStreamRender
     * @param state
     * @private
     */
    constructor(isHydrating: boolean, isServerStreamRender: boolean, state?: Array<Object> = []) {
        if (typeof state !== 'undefined') {
            invariant(Array.isArray(state), 'Metadata expects the optional state parameter to be an array.');
        }

        this._isHydratingClient = isHydrating;
        this._isServerStreamRender = isServerStreamRender;
        this._metadataList = state.slice();
        this._hydrationMark = -1;
        this._onChangeSubscribers = [];
    }

    /**
     * Returns the internal metadata state.
     *
     * This can be used to pass server rendered metadata to the client render.
     *
     * @returns {Array.<Object>} internal metadata state.
     * @public
     */
    getState() {
        return this._metadataList.slice();
    }

    markHydrated(): void {
        if (this._metadataList.length > 0 && this._hydrationMark === -1) {
            this._hydrationMark = this._metadataList.length;
        }
    }

    isMounted() {
        if (this.isHydratingClient()) {
            // prevents re-loading data on initial client render when data was rendered on server
            this._isHydratingClient = false;

            if (this._hydrationMark > 0) {
                // Delete any hydrated metadata entries after the initial render is complete
                this._metadataList.splice(0, this._hydrationMark);
            }

            // update the metadata - this should resolve to the initial server render
            this._hydrationMark = -1;
            this.updateMetadata();
        }
    }

    appendMetadata(metadata) {
        if (metadata === null) {
            return;
        }

        this._metadataList.push(metadata);
    }

    getHelmetState() {
        return reducePropsToState(this.getState());
    }

    getComponents() {
        return mapStateToComponents({
            ...this.getHelmetState(),
            typeComponents: {
                script: {
                    component: ScriptTag,
                    props: {
                        isHydrating: this._isHydratingClient
                    }
                }
            }
        });
    }

    updateMetadata() {
        const self = this;
        self._onChangeSubscribers.forEach(subscriber => subscriber(self));
    }

    /**
     * Updates the current metadata state
     *
     * @param previousMetadata will be removed if different from the new metadata
     * @param newMetadata will be appended if its non null
     * @returns {*} the applied metadata instance
     */
    update(previousMetadata, newMetadata) {
        if (this.isServerRender()) {
            // don't update on initial client render or on the server render.
            return null;
        }

        if (deepEqual(previousMetadata, newMetadata)) {
            // Nothing to update
            return previousMetadata;
        }

        // Support persisting metadata, so its NEVER removed
        if (newMetadata && newMetadata.persist === true) {
            for (let i = 0, len = this._metadataList.length; i < len; i++) {
                const item = this._metadataList[i];
                if (item.persist !== true) {
                    continue;
                }

                if (deepEqual(item, newMetadata)) {
                    // Metadata already exists
                    return previousMetadata;
                }
            }
        }

        if (this.isHydratingClient()) {
            // append the metadata - will be applied once initial render is complete
            this.appendMetadata(newMetadata);
            return newMetadata;
        }

        // Remove the previous metadata
        if (previousMetadata !== null) {
            const index = this._metadataList.indexOf(previousMetadata);
            if (index !== -1) {
                // Prevent persisted metadata from being removed
                if (this._metadataList[index].persist !== true) {
                    this._metadataList.splice(index, 1);
                }
            }
            else if (IS_DEV) {
                // eslint-disable-next-line no-console
                console.warn(`Failed to remove HTML metadata item at index ${index}.`);
            }
        }

        // Update the metadata in the HTML document
        this.appendMetadata(newMetadata);
        this.updateMetadata();
        return newMetadata;
    }

    /**
     * Subscribe to be notified when metadata changes. Be sure to unsubscribe to prevent memory leaks.
     *
     * @param callback
     * @returns {unsubscribe}
     */
    onChange(callback): () => void {
        const self = this;
        self._onChangeSubscribers.push(callback);

        return function unsubscribe() {
            const idx = self._onChangeSubscribers.indexOf(callback);
            if (idx > -1) {
                self._onChangeSubscribers.splice(idx, 1);
            }
        };
    }

    isHydratingClient(): boolean {
        return this._isHydratingClient === true;
    }

    isServerRender(): boolean {
        return Metadata.canUseDOM !== true;
    }

    isServerStreamRender(): boolean {
        return this._isServerStreamRender && this.isServerRender();
    }
}

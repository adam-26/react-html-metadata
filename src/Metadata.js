// @flow
import ExecutionEnvironment from 'exenv';
import invariant from 'invariant';
import {
    reducePropsToState,
    handleClientStateChange,
    mapStateToComponents
} from 'react-cap/lib/CapUtils';

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
        return new Metadata(false, typeof md !== 'undefined' ? [md] : []);
    }

    /**
     * Create a new metadata instance for hydrating the client render.
     * @param state
     * @returns {Metadata}
     * @public
     */
    static createForHydration(state?: Array<Object>) {
        return new Metadata(true, state);
    }

    /**
     * Creates a new Metadata instance.
     *
     * @param isHydrating
     * @param state
     * @private
     */
    constructor(isHydrating: boolean, state?: Array<Object> = []) {
        if (typeof state !== 'undefined') {
            invariant(Array.isArray(state), 'Metadata expects the optional state parameter to be an array.');
        }

        this._isHydratingClient = isHydrating;
        this._metadataList = state.slice();
        // this._baseMetadataIdx = 0;
        this._hydrationMark = -1;
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
                this._metadataList.splice(this._hydrationMark, this._metadataList.length - this._hydrationMark);
            }

            // update the metadata - this should resolve to the initial server render
            this._hydrationMark = -1;
            this.updateMetadata();
        }
    }

    appendMetadata(metadata) {
        this._metadataList.push(metadata);
    }

    getHelmetState() {
        return reducePropsToState(this.getState());
    }

    getComponents() {
        return mapStateToComponents(this.getHelmetState());
    }

    updateMetadata() {
        handleClientStateChange(this.getHelmetState());
    }

    update(previousMetadata, newMetadata) {
        if (this.isServerRender()) {
            // don't update on initial client render or on the server render.
            return;
        }

        if (this.isHydratingClient()) {
            // append the metadata - will be applied once initial render is complete
            this.appendMetadata(newMetadata);
            return;
        }

        // Remove the previous metadata
        const index = this._metadataList.indexOf(previousMetadata);
        if (index !== -1) {
            this._metadataList.splice(index, 1);
        }

        //  *******************************************
        // TODO  Add support to DIFF the previous/new
        //   metadata, to determine exactly what
        //   needs to be removed. This should retain
        //   any metadata NOT set using html-metadata
        // *******************************************

        // Update the metadata in the HTML document
        this.appendMetadata(newMetadata);
        this.updateMetadata();
    }

    isHydratingClient(): boolean {
        return this._isHydratingClient === true;
    }

    isServerRender(): boolean {
        return Metadata.canUseDOM !== true;
    }
}

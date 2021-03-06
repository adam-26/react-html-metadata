import Metadata from '../Metadata';

describe('Metadata', () => {
    describe('constructor', () => {
        test('assigns parameters', () => {
            const state = [];
            const md = new Metadata(true, false, state);

            expect(md.isHydratingClient()).toBe(true);
            expect(md.getState()).toHaveLength(state.length);
        });

        test('throws if state is not an array', () => {
           expect(() => new Metadata(true, false, {})).toThrow();
        });

        test('createForServerStreamRender', () => {
            Metadata.canUseDOM = false;
            const md = Metadata.createForServerStreamRender();

            expect(md.getState()).toHaveLength(0);
            expect(md.isServerStreamRender()).toBe(true);

            Metadata.canUseDOM = true;
            expect(md.isServerStreamRender()).toBe(false);
        });
    });

    describe('getState', () => {
        test('returns internal state', () => {
            const stateEntry = { title: 'hello' };
            const state = [stateEntry];
            const md = new Metadata(true, false, state);

            expect(md.getState()[0]).toEqual(stateEntry);
        });
    });

    describe('markHydrated', () => {
        test('does not set flag when state is empty', () => {
            const md = new Metadata(true, false, []);
            md.markHydrated();

            expect(md._hydrationMark).toBe(-1);
        });

        test('sets flag zero when no metadata appended after ctor', () => {
            const md = new Metadata(true, false, [{ title: 'hello' }]);
            md.markHydrated();

            expect(md._hydrationMark).toBe(1);
        });

        test('does not set flag when flag previously set', () => {
            const md = new Metadata(true, false, [{ title: 'hello' }]);
            md.appendMetadata({ title: 'world' });
            md.markHydrated();

            expect(md._hydrationMark).toBe(2);

            md.appendMetadata({ title: 'world' });
            md.markHydrated();
            expect(md._hydrationMark).toBe(2); // verify not changed
        });
    });

    describe('isMounted', () => {
        test('does not update metadata when not hydrating the client', () => {
            const md = new Metadata(false, false, []);
            md.updateMetadata = jest.fn();

            md.isMounted();

            expect(md.updateMetadata.mock.calls).toHaveLength(0);
        });

        test('does not remove appended metadata when none has been appended', () => {
            const md = new Metadata(true, false, []);
            md.updateMetadata = jest.fn();

            expect(md._hydrationMark).toBe(-1);
            md.isMounted();

            expect(md._hydrationMark).toBe(-1);
            expect(md.updateMetadata.mock.calls).toHaveLength(1);
        });

        test('removes hydrated metadata after hydrating client', () => {
            const initialState = { title: 'hello' };
            const md = new Metadata(true, false, [initialState]);
            md.updateMetadata = jest.fn();

            md.markHydrated(); // flag as hydrating
            expect(md._hydrationMark).toBe(1);

            md.appendMetadata({ title: 'world' }); // append additional md - will be removed after mount
            md.isMounted(); // flag as mounted

            expect(md._hydrationMark).toBe(-1); // reset
            expect(md.getState()).toHaveLength(1);
            expect(md.getState()[0].title).toBe('world');
            expect(md.updateMetadata.mock.calls).toHaveLength(1);
        });
    });

    describe('update', () => {
        test('does nothing on server render', () => {
            Metadata.canUseDOM = false;
            const md = new Metadata(false, false, []);

            expect(md.getState()).toHaveLength(0);
            md.update({}, {});

            Metadata.canUseDOM = true;
            expect(md.getState()).toHaveLength(0);
        });

        test('appends metadata on client hydration', () => {
            const md = new Metadata(true, false, []);
            const newMd = { title: 'hello' };
            md.update({}, newMd);

            expect(md.getState()[0]).toEqual(newMd);
        });

        test('removes previous metadata on client render', () => {
            const oldMd = { title: 'hello' };
            const newMd = { title: 'world' };
            const md = new Metadata(false, false, [oldMd]);
            md.updateMetadata = jest.fn();

            md.update(oldMd, newMd);

            expect(md.getState()[0]).toEqual(newMd);
            expect(md.updateMetadata.mock.calls).toHaveLength(1);
        });
    });

    describe('onChange', () => {
        test('subscribers are notified of change events', () => {
            const md = new Metadata(false, false, []);
            const mockCb = jest.fn();
            const unsubscribe = md.onChange(mockCb);

            md.updateMetadata();
            expect(mockCb.mock.calls).toHaveLength(1);

            unsubscribe();
            expect(md._onChangeSubscribers).toHaveLength(0);
        });
    });
});

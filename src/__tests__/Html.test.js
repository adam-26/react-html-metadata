import React from 'react';
// import { render } from './enzyme';
import { renderToStaticMarkup } from 'react-dom/server';
import Html from '../Html';
import Metadata from '../Metadata';

describe('Html', () => {
    describe('constructor', () => {
        test('assigns new metadata', () => {
            const html = new Html({});
            expect(html.state.metadata instanceof Metadata).toBe(true);
        });

        test('accepts new metadata', () => {
            const md = Metadata.createNew();
            md.markHydrated = jest.fn();

            const html = new Html({ metadata: md });

            expect(html.state.metadata).toEqual(md);
            expect(md.markHydrated.mock.calls).toHaveLength(0);
        });

        test('accepts hydrated metadata', () => {
            const md = Metadata.createForHydration();
            md.markHydrated = jest.fn();

            const html = new Html({ metadata: md });

            expect(html.state.metadata).toEqual(md);
            expect(md.markHydrated.mock.calls).toHaveLength(1);
        });
    });

    describe('componentDidMount', () => {
        test('invokes state.isMounted()', () => {
            const md = Metadata.createNew();
            md.isMounted = jest.fn();
            const html = new Html({ metadata: md });

            html.componentDidMount();

            expect(md.isMounted.mock.calls).toHaveLength(1);
        });
    });

    describe('render', () => {
        test('returns html chrome', () => {
            const html = renderToStaticMarkup(<Html>content</Html>);
            expect(html).toBe('<html><head><title></title></head><body>content</body></html>');
        });

        test('returns html with metadata', () => {
            const md = Metadata.createNew({
               htmlAttributes: { lang: 'en' },
               bodyAttributes: { class: 'root' },
               title: 'Hello'
            });
            const html = renderToStaticMarkup(<Html metadata={md}>content</Html>);
            expect(html).toBe('<html lang="en"><head><title>Hello</title></head><body class="root">content</body></html>');
        });
    });
});

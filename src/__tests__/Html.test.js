import React from 'react';
import PropTypes from 'prop-types';
import { mount } from './enzyme';
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

        test('lastChild renders after body has rendered', () => {
            const SerializedData = ({ windowKey, data }) =>
                <script
                    type="text/javascript"
                    dangerouslySetInnerHTML={{ __html: `window.${windowKey}=${JSON.stringify(data)}` }} />;

            SerializedData.propTypes = {
                windowKey: PropTypes.string,
                data: PropTypes.object
            };

            class Content extends React.Component {

                static propTypes = {
                    data: PropTypes.object
                };

                constructor(props, context) {
                    super(props, context);
                }

                componentWillMount() {
                    // modify data - to verify the 'lastChild' renders the modified value
                    this.props.data.hello = 'world';
                }

                render() {
                    return <div>content</div>;
                }
            }

            // start with empty data
            // - the <Content> component should assign a value BEFORE the data is serialized
            const requestData = {};
            const wrapper = mount(
                <Html lastChild={<SerializedData windowKey="__appState" data={requestData} />}>
                    <Content data={requestData} />
                </Html>
            );

            expect(wrapper.html()).toBe('<html><head><title></title></head><body><div>content</div><script type="text/javascript">window.__appState={"hello":"world"}</script></body></html>');
        });
    });
});

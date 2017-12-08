import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import Html from '../Html';
import Metadata from '../Metadata';
import withMetadata from '../withMetadata';

class TestComponent extends React.Component {
    static propTypes = {
        metadata: PropTypes.object
    };

    render() {
        return this.props.metadata.getState()[0].title;
    }
}

describe('withMetadata', () => {
    test('assigns metadata prop to Component', () => {
        const MdComponent = withMetadata()(TestComponent);
        const md = Metadata.createNew({
            title: 'Hello'
        });

        const html = renderToStaticMarkup(<Html metadata={md}><MdComponent /></Html>);
        expect(html).toBe('<html><head><title>Hello</title></head><body>Hello</body></html>');
    });
});

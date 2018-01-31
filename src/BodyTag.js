// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

function getBodyAttrs(props) {
    if (props.bodyAttributes) {
        return props.bodyAttributes;
    }

    if (props.metadata) {
// eslint-disable-next-line no-console
        console.warn('BodyTag expects a "bodyAttributes" property, not "metadata". This will be deprecated in a future version.');
        return props.metadata.bodyAttributes;
    }
}

export default class BodyTag extends Component {
    static propTypes = {
        bodyAttributes: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired
    };

    render() {
        const bodyAttributes = getBodyAttrs(this.props);
        return <body {...bodyAttributes}>{this.props.children}</body>;
    }
}

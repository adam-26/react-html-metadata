// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BodyTag extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired
    };

    render() {
        const { children, metadata: { bodyAttributes } } = this.props;
        return <body {...bodyAttributes}>{children}</body>;
    }
}

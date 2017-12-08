// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HtmlTag extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired
    };

    render() {
        const { children, metadata: { htmlAttributes } } = this.props;
        return <html {...htmlAttributes}>{children}</html>;
    }
}

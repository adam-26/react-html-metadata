// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

function getHtmlAttrs(props) {
    if (props.htmlAttributes) {
        return props.htmlAttributes;
    }

    if (props.metadata) {
// eslint-disable-next-line no-console
        console.warn('HtmlTag expects a "htmlAttributes" property, not "metadata". This will be deprecated in a future version.');
        return props.metadata.htmlAttributes;
    }
}

export default class HtmlTag extends Component {
    static propTypes = {
        htmlAttributes: PropTypes.object,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired
    };

    static defaultProps = {
        htmlAttributes: {}
    };

    render() {
        const htmlAttributes = getHtmlAttrs(this.props);
        return <html {...htmlAttributes}>{this.props.children}</html>;
    }
}

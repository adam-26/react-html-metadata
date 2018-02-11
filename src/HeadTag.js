// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HeadTag extends Component {
    static propTypes = {
        metadata: PropTypes.object
    };

    static defaultProps = {
        metadata: {}
    };

    render() {
        const {
            metadata: { title, base, meta, link, style, script, noscript }
        } = this.props;

        return (
            <head>
                {meta}
                {title}
                {base}
                {style}
                {link}
                {noscript}
                {script}
            </head>
        );
    }
}

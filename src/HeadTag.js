// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HeadTag extends Component {
    static propTypes = {
        metadata: PropTypes.object
    };

    render() {
        const {
            metadata: { title, base, meta, link, style, script, noscript }
        } = this.props;

        return (
            <head>
                {title}
                {base}
                {meta}
                {link}
                {style}
                {noscript}
                {script}
            </head>
        );
    }
}

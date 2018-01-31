// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { deepEqual } from 'react-cap/lib/CapUtils';

export default class HeadTag extends Component {
    static propTypes = {
        metadata: PropTypes.object
    };

    static defaultProps = {
        metadata: {}
    };

    shouldComponentUpdate(nextProps) {
        return !deepEqual(this.props.metadata, nextProps.metadata);
    }

    render() {
        const {
            metadata: { title, base, meta, link, style, script, noscript }
        } = this.props;

        return (
            <head>
                {meta}
                {title}
                {base}
                {link}
                {style}
                {noscript}
                {script}
            </head>
        );
    }
}

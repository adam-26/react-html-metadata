// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import Metadata from './Metadata';
import HtmlTag from './HtmlTag';
import HeadTag from './HeadTag';
import BodyTag from './BodyTag';

export const METADATA_CONTEXT_KEY = 'htmlMetadata';

export default class Html extends Component {

    static propTypes = {
        metadata: PropTypes.object,
        render: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired
    };

    static defaultProps = {
        /**
         * Custom render method allows caching of the <head> data.
         * @param metadata
         * @param props
         */
        render: (metadata, props) => {
            const { children } = props;
            return (
                <HtmlTag metadata={metadata}>
                    <HeadTag metadata={metadata} />
                    <BodyTag metadata={metadata}>
                        {children}
                    </BodyTag>
                </HtmlTag>
            );
        }
    };

    static childContextTypes = {
        [METADATA_CONTEXT_KEY]: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
        const { metadata } = props;
        if (typeof metadata !== 'undefined') {
            invariant(metadata instanceof Metadata, 'Html expects prop \'metadata\' to be an instance of \'Metadata\'.');
            metadata.markHydrated();
        }

        this.state = { metadata: metadata || Metadata.createNew() };
    }

    getChildContext() {
        return {
            [METADATA_CONTEXT_KEY]: this.state.metadata
        };
    }

    componentDidMount() {
        this.state.metadata.isMounted();
    }

    render() {
        const { metadata } = this.state;
        const { render, ...renderProps } = this.props;
        return render(metadata.getComponents(), renderProps);
    }
}

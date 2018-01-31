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
        lastChild: PropTypes.node,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired
    };

    static defaultProps = {
        lastChild: null,

        /**
         * Custom render method allows caching of the <head> data.
         * @param metadata
         * @param props
         */
        render: (metadata, props) => {
            const { lastChild, children } = props;
            const { htmlAttributes, bodyAttributes, ...headMetadata } = metadata;
            return (
                <HtmlTag htmlAttributes={htmlAttributes}>
                    <HeadTag metadata={headMetadata} />
                    <BodyTag bodyAttributes={bodyAttributes}>
                        {children}
                        {lastChild}
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
        if (typeof metadata !== 'undefined' && metadata.isHydratingClient()) {
            invariant(metadata instanceof Metadata, 'Html expects prop \'metadata\' to be an instance of \'Metadata\'.');
            metadata.markHydrated();
        }

        const self = this;
        const mdInstance = metadata || Metadata.createNew();
        const unsubscribe = mdInstance.onChange(function notify() {
            self.setState({ metadata: mdInstance });
        });

        self.state = {
            metadata: mdInstance,
            unsubscribe: unsubscribe
        };
    }

    getChildContext() {
        return {
            [METADATA_CONTEXT_KEY]: this.state.metadata
        };
    }

    componentDidMount() {
        this.state.metadata.isMounted();
    }

    componentWillUnmount() {
        this.state.unsubscribe();
    }

    render() {
        const { metadata } = this.state;
        const { render, ...renderProps } = this.props;
        return render(metadata.getComponents(), renderProps);
    }
}

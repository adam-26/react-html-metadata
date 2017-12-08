// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Used to embed app scripts in ALL renders (including the client-side rendering markup)
 */
export default class AppScripts extends Component {

    static propTypes = {
        hydrateClient: PropTypes.bool,
        assets: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ])
    };

    static defaultProps = {
        hydrateClient: false,
        children: null
    };

    render() {
        const { assets, hydrateClient, children } = this.props;
        return (
            <React.Fragment>
                <noscript
                    dangerouslySetInnerHTML={{
                        __html: `<b>Enable JavaScript to run this app.</b>`,
                    }}
                />
                {children}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `__AppState = ${JSON.stringify({ assets, hydrateClient })};`,
                    }}
                />
                <script src={assets['main.js']} />
            </React.Fragment>
        );
    }
}
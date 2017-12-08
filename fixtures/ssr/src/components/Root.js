import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMetadata } from 'react-html-metadata';
import { renderRoutes } from 'react-router-config';
import AppScripts from './AppScripts';
import PageLinks from './PageLinks';
import NavLinks from './NavigationLinks';

import './Root.css';

class Root extends Component {

    static propTypes = {
        route: PropTypes.object.isRequired,
        assets: PropTypes.object.isRequired
    };

    static getMetadata(match, { assets }) {
        return {
            htmlAttributes: {lang: 'en', amp: undefined},
            bodyAttributes: {class: 'root'},
            titleTemplate: "MySite.com - %s",
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            link: [
                { rel: 'shortcut icon', href: 'favicon.ico' },
                { rel: 'stylesheet', href: assets['main.css'] }
            ]
        };
    }

    render() {
        const { route: { routes }, assets } = this.props;
        return (
            <AppScripts assets={assets} hydrateClient={true}>
                <PageLinks />
                {renderRoutes(routes || null)}
                <NavLinks />
            </AppScripts>
        );
    }
}

// Maps routeDispatcher action parameters to component prop values
// - this is used for SSR and client metadata-hydration to enable correct props to be passed to 'getMetadata()'
// - the map function MUST map params to the SAME prop values the component will receive during a normal render
const mapParamsToProps = ({ assets }) => ({ assets });

// Use 'withMetadata' to enable SSR with metadata
export default withMetadata(mapParamsToProps)(Root);

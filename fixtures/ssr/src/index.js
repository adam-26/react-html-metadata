import React from 'react';
import {hydrate, render} from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Html, { hydrateMetadata } from 'react-html-metadata';
import { UniversalRouteDispatcher, ClientRouteDispatcher } from './routeDispatcher';
import routes from './routes';

// Extract the state from the server render
const { assets, hydrateClient, /* metadata (if hydrating metadata not possible */ } = window.__AppState;

// TODO - can this be used on client to achieve identical render? w/react-router, YES (Default recommend to including the metadata state in the render to achieve identical render on client)
// Alternatively; if the metadata state is embedded for rendering (ie: react-router not being used):
// const metadata = Metadata.createForHydration(metadata);

function getClientApp(RouteDispatcher, metadata) {
    return (
        <Html metadata={metadata}>
            <BrowserRouter>
                {/* Pass 'assets' to the 'Root' component */}
                {RouteDispatcher}
            </BrowserRouter>
        </Html>
    );
}

if (hydrateClient) {
    const metadata = hydrateMetadata(window.location.pathname, routes, { assets });
    hydrate(
        getClientApp(<UniversalRouteDispatcher assets={assets} />, metadata),
        document);
}
else {
    // NOTE: The 'ClientRouteDispatcher' MUST be used when performing a client render
    render(
        getClientApp(<ClientRouteDispatcher assets={assets} />),
        document);
}

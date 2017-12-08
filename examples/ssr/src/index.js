import React from 'react';
import {hydrate, render} from 'react-dom';
import { Metadata } from 'react-html-metadata';
import App from './components/App';
import getMetadata from './defaultMetadata';

// Extract the state from the server render
const { assets, metadata } = window.__AppState;

function getClientApp(assets, metadata) {
    return (
        <App assets={assets} metadata={metadata} />
    );
}

if (metadata && metadata.length > 0) {
    hydrate(getClientApp(assets, Metadata.createForHydration(metadata)), document);
}
else {
    const metadata = Metadata.createNew();
    metadata.appendMetadata(getMetadata(assets));

    render(getClientApp(assets, metadata), document);
}

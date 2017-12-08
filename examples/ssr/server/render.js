import React from 'react';
import { renderToNodeStream, renderToString, renderToStaticMarkup } from 'react-dom/server';
import AppScripts from '../src/components/AppScripts';
import { Metadata } from 'react-html-metadata';
import App from '../src/components/App';
import getMetadata from '../src/defaultMetadata';

let assets;
if (process.env.NODE_ENV === 'development') {
    // Use the bundle from create-react-app's server in development mode.
    assets = {
        'main.js': '/static/js/bundle.js',
        'main.css': '',
    };
} else {
    assets = require('../build/asset-manifest.json');
}

function serverRender() {
    const metadata = Metadata.createNew();
    metadata.appendMetadata(getMetadata(assets));

    return (<App assets={assets} metadata={metadata} />);
}

let clientHtml;
function clientRender(req, res) {
    // return markup for client-side render
    if (typeof clientHtml === 'undefined') {
        clientHtml = renderToStaticMarkup(
            <html>
                <head>
                    <title>App Name</title>
                </head>
                <body>
                    <AppScripts assets={assets} />
                </body>
            </html>);
    }

    res.send('<!DOCTYPE html>' + clientHtml);
}

function renderOnClient(req) {
    return typeof req.query.client !== 'undefined';
}

export function toString(req, res) {
    if (renderOnClient(req)) {
        return clientRender(req, res);
    }

    const html = renderToString(serverRender());
    res.send('<!DOCTYPE html>' + html);
}

export function stream(req, res) {
    if (renderOnClient(req)) {
        return clientRender(req, res);
    }

    const stream = renderToNodeStream(serverRender());
    res.write("<!DOCTYPE html>");
    stream.pipe(res, { end: false });
    stream.on('end', () => {
        // this can be removed if { end: true }
        res.end();
    });
}

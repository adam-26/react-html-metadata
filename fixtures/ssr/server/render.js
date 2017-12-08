import React from 'react';
import { renderToNodeStream, renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Html, { Metadata } from 'react-html-metadata/lib';
import { UniversalRouteDispatcher, dispatchOnServer } from '../src/routeDispatcher';
import AppScripts from '../src/components/AppScripts';
import LoadingPlaceholder from '../src/components/LoadingIndicator';

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

function serverRender(req, callback) {

    const metadata = Metadata.createNew();
    const dispatchActionParams = {
        assets: assets,
        htmlMetadata: metadata
    };

    // TODO: Remove from example:
    // const dispatchServerOpts = {
    //     dispatchActions: (location, dispatchActionParams) => {
    //         // TODO: return actions to invoke - this allows cache to be utilized
    //         // ie: don't dispatch metadata actions if the metadata was loaded from cache
    //     }
    // };
    //
    // // TODO: Customize the HTML renderer to support cache
    // const serverHtmlRender = (metadata, props) => {
    //     const { children } = props;
    //     return (
    //         <HtmlTag metadata={metadata}>
    //             {/* The <Head> can be cached, the HTML & Body tags render as normal */}
    //             <HeadTag metadata={metadata} />
    //             <BodyTag metadata={metadata}>
    //                 {children}
    //             </BodyTag>
    //         </HtmlTag>
    //     );
    // };

    // Dispatch actions on the server, before rendering the application.
    dispatchOnServer(req.path, dispatchActionParams /*, dispatchServerOpts */).then(() => {

        // Compose the app using the factory RouteDispatcher
        const ctx = {};
        const serverApp = (
            <Html metadata={metadata} /* render={serverHtmlRender} */>
                <StaticRouter location={req.url} context={ctx}>
                    {/* Pass 'assets' to the 'Root' component */}
                    <UniversalRouteDispatcher assets={assets} />
                </StaticRouter>
            </Html>
        );

        callback(undefined, { ctx, serverApp });
    });
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
                    <LoadingPlaceholder />
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

    serverRender(req, (err, { /* ctx, */ serverApp }) => {
        if (err) {
            throw err;
        }

        const html = renderToString(serverApp);
        res.send('<!DOCTYPE html>' + html);
    });
}

export function stream(req, res) {
    if (renderOnClient(req)) {
        return clientRender(req, res);
    }

    serverRender(req, (err, { /* ctx, */ serverApp }) => {
        if (err) {
            throw err;
        }

        const stream = renderToNodeStream(serverApp);
        res.write("<!DOCTYPE html>");
        stream.pipe(res, { end: false });
        stream.on('end', () => {
            // this can be removed if { end: true }
            res.end();
        });
    });
}

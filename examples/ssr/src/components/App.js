// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Html from 'react-html-metadata';
import AppScripts from './AppScripts';

import './App.css';

const App = ({ assets, metadata }) => (
    <Html metadata={metadata}>
        <h1>Metadata Demo</h1>
        <p>Open the browser dev tools to inspect the metadata</p>
        <h3>Try different render techniques:</h3>
        <h4><a href="/">server render - string</a></h4>
        <h4><a href="/?stream">server render - stream</a></h4>
        <h4><a href="/?client">client render - as string from server</a></h4>
        <h4><a href="/?stream&client">client render - as stream from server</a></h4>
        <AppScripts assets={assets} metadata={metadata} />
    </Html>
);

App.propTypes = {
    assets: PropTypes.object,
    metadata: PropTypes.object
};

export default App;

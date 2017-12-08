// @flow
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLinks = () => (
    <div>
        <h3>
            Click to navigate between pages
        </h3>
        <p>Watch the metadata change in the browser devTools</p>
        <h4><Link to="/">Homepage</Link></h4>
        <h4><Link to="/about">About</Link></h4>
    </div>
);

export default NavigationLinks;

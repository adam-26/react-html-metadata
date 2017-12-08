// @flow
import React from 'react';

const PageLinks = () => (
    <table width="100%">
        <tbody>
        <tr>
            <td><b>Render to String</b></td>
            <td><a href="/">Homepage - server string</a></td>
            <td><a href="/?client">Homepage - client string</a></td>
            <td><a href="/about">About - server string</a></td>
            <td><a href="/about?client">About - client string</a></td>
        </tr>
        <tr>
            <td><b>Render to Stream</b></td>
            <td><a href="/?stream">Homepage - server stream</a></td>
            <td><a href="/?stream&client">Homepage - client stream</a></td>
            <td><a href="/about?stream">About - server stream</a></td>
            <td><a href="/about?stream&client">About - client stream</a></td>
        </tr>
        </tbody>
    </table>
);

export default PageLinks;

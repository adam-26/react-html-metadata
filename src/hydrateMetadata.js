// @flow
import { matchRoutes } from 'react-router-config';
import { Metadata, metadataDispatcherActionName } from 'react-html-metadata';

// TODO: Refactor to util method: can ONLY be used w/react-router (react-router-metadata package)
// TODO: Similar refactor required for 'withMetadata'
// TODO  *** This package MUST be able to run without depending on react-router

// NOTE: This is synchronous.
function hydrateMetadata(pathname, routes, data?: Object = {}, option?: { staticMethodName?: string, routeComponentPropNames?: Array<string> } = {}) {
    const {
        staticMethodName,
        routeComponentPropNames
    } = Object.assign({
        staticMethodName: metadataDispatcherActionName,
        routeComponentPropNames: ['component', 'components']
    }, option);

    const metadata = Metadata.createForHydration();
    const branch = matchRoutes(routes, pathname);
    const actionParams = { ...data, htmlMetadata: metadata };

    branch.forEach(({ route, match }) => {
        for (let i = 0, len = routeComponentPropNames.length; i < len; i++) {
            const componentPropName = routeComponentPropNames[i];
            const routeComponent = route[componentPropName];
            if (typeof routeComponent !== 'undefined') {
                if (typeof routeComponent[staticMethodName] === 'function') {
                    // todo; routeComponentKey value? in last arg? if this is not possible, may need to remove from dispatcher?
                    routeComponent[staticMethodName](match, actionParams, {route});
                }

                break;
            }
        }
    });

    return metadata;
}

export default hydrateMetadata;

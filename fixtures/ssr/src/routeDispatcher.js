// @flow
import { metadataDispatcherActionName } from 'react-html-metadata';
import { createRouteDispatchers } from 'react-router-dispatcher';
import routes from './routes';
import LoadingIndicator from './components/LoadingIndicator';

const loadDataActionName = 'loadData';

// Define the 'actions' to be dispatched before rendering (for this app)
const dispatcherOptions = {
    dispatchActions: [[loadDataActionName], [metadataDispatcherActionName]],
    loadingIndicator: LoadingIndicator
};

/*
Use the createRouteDispatcher factory, it returns a component and method for server-side rendering

Using the factory is an easy way to configure the dispatcher for both client and server renders
ensuring consistent configuration in both environments.
 */
const {
    ClientRouteDispatcher,
    UniversalRouteDispatcher,
    dispatchOnServer
} = createRouteDispatchers(routes, dispatcherOptions);

export {
    ClientRouteDispatcher,
    UniversalRouteDispatcher,
    dispatchOnServer,
    loadDataActionName
};

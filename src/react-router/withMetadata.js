// @flow
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import Metadata from './Metadata';

// EXPORT for use with react-router-dispatcher
export const metadataDispatcherActionName = 'preloadMetadata';

// TODO: *** Update so that this is NOT dependent on react-router (usage of metadata - then create a react-router-metadata pkg)

// TODO: Get react-router-dispatcher builder, then import it to this fixture, and prototype the async streaming metadata

// TODO *** In this package, 'withMetadata()' should ONLY provide access to the metadata context - nothing more.

const withMetadata = (
    mapParamsToProps?: (params: Object, routeParams: Object) => Object = (params) => params,
    options?: { staticMethodName?: string, paramName?: string } = { staticMethodName: 'getMetadata', paramName: 'htmlMetadata' }
    ) => {
    return (Component) => {
        const componentName = getDisplayName(Component);
        const getMetadata = Component[options.staticMethodName];
        invariant(typeof getMetadata === 'function', `Component ${componentName} requires a static function named '${options.staticMethodName}' to support withMetadata().`);

        class MetadataHOC extends Component {
            static propTypes = {
                // react-router props
                match: PropTypes.object,
                location: PropTypes.object,
                history: PropTypes.object
            };

            static contextTypes = {
                htmlMetadata: PropTypes.object
            };

            static preloadMetadata(match, dispatchActionParams, routeParams) {
                const { [options.paramName]: htmlMetadata, ...params } = dispatchActionParams;
                if (typeof htmlMetadata === 'undefined') {
                    // No htmlMetadata instance, no metadata will be pre-loaded.
                    // - this can be used to prevent pre-loading on client renders
                    // TODO: This is an easy way to prevent client pre-rendering,
                    // TODO  BUT - does it make it near impossible to debug when metadata is not pre-loading?
                    return;
                }

                // Verify valid metadata type
                invariant(htmlMetadata instanceof Metadata, `dispatchActionParams requires prop ${options.paramName} to be an instance of Metadata.`);

                const props = mapParamsToProps(params, routeParams);

                // TODO: May need to include ALL route props in 1st param, as 'routeProps'??
                //  - as, must be able to support other routers. How would this impact SSR?
                htmlMetadata.appendMetadata(getMetadata(match, props));
            }

            constructor(props, context) {
                super(props, context);
                this.state = {
                    currentMetadata: {}
                };
            }

            setMetadata(nextMetadata = null) {
                this.context.htmlMetadata.update(this.state.currentMetadata, nextMetadata || {});
                if (nextMetadata !== null) {
                    this.setState({ currentMetadata: nextMetadata });
                }
            }

            componentWillReceiveProps(nextProps) {
                const { match, ...props } = nextProps;
                this.setMetadata(getMetadata(match, props));
            }

            componentWillMount() {
                const { match, ...props } = this.props;
                this.setMetadata(getMetadata(match, props));
            }

            componentWillUnmount() {
                this.setMetadata();
            }

            render() {
                return <Component {...this.props} />;
            }
        }

        MetadataHOC.displayName = `withMetadata(${componentName})`;

        return withRouter(hoistNonReactStatic(MetadataHOC, Component));
    };
};

export default withMetadata;

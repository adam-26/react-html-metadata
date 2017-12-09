// @flow
import React from 'react';
import invariant from 'invariant';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import PropTypes from 'prop-types';
import { METADATA_CONTEXT_KEY } from './Html';

export const METADATA_ACTION_PARAM_NAME = 'metadata';

function withMetadata(metadataPropName?: string = METADATA_ACTION_PARAM_NAME) {
    invariant(typeof metadataPropName === 'string', 'withMetadata() expects the metadataPropName to be a string. You may be incorrectly invoking withMetadata, correct invocation is \'withMetadata()(Component)\'.');

    return (Component) => {
        class MetadataHOC extends Component {
            static contextTypes = {
                [METADATA_CONTEXT_KEY]: PropTypes.object
            };

            render() {
                const { htmlMetadata } = this.context;
                const props = { ...this.props, [metadataPropName]: htmlMetadata };
                return <Component { ...props } />;
            }
        }

        MetadataHOC.displayName = `withMetadata(${getDisplayName(Component)})`;

        return hoistNonReactStatic(MetadataHOC, Component);
    };
}

export default withMetadata;

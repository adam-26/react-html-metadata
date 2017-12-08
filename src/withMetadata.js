// @flow
import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import PropTypes from 'prop-types';
import { METADATA_CONTEXT_KEY } from './Html';

function withMetadata(metadataPropName?: string = 'metadata') {
    return (Component) => {
        class MetadataHOC extends Component {
            static contextTypes = {
                [METADATA_CONTEXT_KEY]: PropTypes.object
            };

            render() {
                const { htmlMetadata } = this.context;
                const props = { [metadataPropName]: htmlMetadata };
                return <Component { ...props } />;
            }
        }

        MetadataHOC.displayName = `withMetadata(${getDisplayName(Component)})`;

        return hoistNonReactStatic(MetadataHOC, Component);
    };
}

export default withMetadata;

import Html from './Html';
import HtmlTag from './HtmlTag';
import HeadTag from './HeadTag';
import BodyTag from './BodyTag';
import Metadata from './Metadata';
import withMetadata, { metadataDispatcherActionName } from './withMetadata';
import hydrateMetadata from './hydrateMetadata';

export {
    HtmlTag,
    HeadTag,
    BodyTag,
    Metadata,
    withMetadata,
    hydrateMetadata,
    metadataDispatcherActionName
};

export default Html;

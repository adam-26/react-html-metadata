# react-html-metadata

[![npm](https://img.shields.io/npm/v/react-html-metadata.svg)](https://www.npmjs.com/package/react-html-metadata)
[![npm](https://img.shields.io/npm/dm/react-html-metadata.svg)](https://www.npmjs.com/package/react-html-metadata)
[![CircleCI branch](https://img.shields.io/circleci/project/github/adam-26/react-html-metadata/master.svg)](https://circleci.com/gh/adam-26/react-html-metadata/tree/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/e159e926827685bcbd1a/maintainability)](https://codeclimate.com/github/adam-26/react-html-metadata/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e159e926827685bcbd1a/test_coverage)](https://codeclimate.com/github/adam-26/react-html-metadata/test_coverage)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

### Introduction
This package provides a simple HTML template that supports metadata.

In isolation, this package is rather boring. However, this package provides the basis for implementing components that support SSR stream interface with HTML metadata.

You can see [one example of using **react-router v4 with streams and metadata** here](https://github.com/adam-26/react-router-metadata).

Internally, this package uses a slightly modified version of the excellent [react-helmet](https://github.com/nfl/react-helmet)
to apply metadata. The modified version is [react-cap](https://github.com/adam-26/react-cap), and it differs in that
it **does not use _data-react-helmet_ attributes**, instead it utilizes the _React lifecycle_ to render metadata.

This provides 2 benefits over [react-helmet](https://github.com/nfl/react-helmet):
 1. No `data-react-helmet` attributes
 2. It displays correctly in **react dev-tools**.

#### Future Enhancements
 * [Add support for SSR](https://github.com/adam-26/react-html-metadata/issues/18)

### Install
```sh
// npm
npm install --save react-html-metadata

// yarn
yarn add react-html-metadata
```

### Usage

```js
// Complete list of exports
import Html, {
  Metadata,
  withMetadata,
  HtmlTag,
  HeadTag,
  BodyTag,
  METADATA_PROP_NAME
} from 'react-html-metadata';

const metadata = Metadata.createNew({
  title: 'Html Metadata Demo',
  htmlAttributes: { lang: 'en' },
  bodyAttributes: { className: 'root' },
  meta: [
    { charset: 'utf-8' }
  ],
  link: [
    { rel: 'stylesheet', href: '/static/css/app.css' }
  ]
});

class DemoApp extends React.Component {

  render() {
    <Html metadata={metadata} lastChild="This is rendered after the content">
      This is the HTML body content
    </Html>
  }
}
```

For a **more detailed example**, look at the [example project, you can clone and run it](https://github.com/adam-26/react-html-metadata/tree/master/examples/ssr)

### Accessing the Metadata context

```js
import { withMetadata } from 'react-html-metadata';

class DemoMd extends React.Component {

  static propTypes = {
    metadata: PropTypes.object
  };

  render() {
    // ...
  }
}

export default withMetadata()(DemoMd)

```

**IMPORTANT**: Any component accessing the metadata context **must** be a child component of the `<Html>` component.

### API

#### `Html` component props:

##### `metadata`
Optional, must be an instance of `Metadata`

##### `lastChild`
Optional, a React node, anything that can be rendered
This can be used to **serialize data** before _closing_ the `</body>` tag, you could:
  * serialize application state
  * serialize a redux store

##### `render`
Optional, a function `(metadata, props) => {}` for custom rendering

##### `children`
Optional, content rendered **inside** of the `<body>` tag.

#### `Metadata`:

##### `Metadata.createNew(/* optional - metadata object */)`
A factory function that creates a new metadata instance, optionally accepting metadata configuration.

##### `Metadata.createForHydration(metadataState)`
A factory function that creates a new metadata instance for client hydration, expects the server generated metadata state.

##### `Metadata.createForServerStreamRender(metadataState)`
A factory function that creates a new metadata instance for SSR stream rendering, optionally accepting metadata state.

##### Metadata properties
_These are all from [react-helmet](https://github.com/nfl/react-helmet)_

  * bodyAttributes: `Object`
  * htmlAttributes: `Object`
  * titleAttributes: `Object`

  * title: `string`
  * titleTemplate: `string`

  * base: `Array<Object>`
  * link: `Array<Object>`
  * meta: `Array<Object>`
  * noscript: `Array<Object>`
  * script: `Array<Object>`
  * style: `Array<Object>`

  * persist: `boolean`:
    * True to persist the metadata, once added it will never be removed.


#### `withMetadata(metadataPropName?: string)`:

A **HOC** for accessing `Metadata` on the context.
Accepts an optional param that defines the prop name the metadata will be assigned to.

_See above for an example_


### Utilities

The following components can be used to customize rendering of the component. View the source for details.

#### `HtmlTag`
#### `HeadTag`
#### `BodyTag`


### Example

There is an example project at `/examples/ssr`.

If you are modifying this package and want changes to apply when running the included example, after making
changes you'll need to run the following command:

```sh
npm run localDeploy
```

### Contribute
For questions or issues, please [open an issue](https://github.com/adam-26/react-html-metadata/issues), and you're welcome to submit a PR for bug fixes and feature requests.

Before submitting a PR, ensure you run `npm test` to verify that your coe adheres to the configured lint rules and passes all tests. Be sure to include unit tests for any code changes or additions.

## License
MIT

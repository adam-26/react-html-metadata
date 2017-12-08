# react-html-metadata

[![npm](https://img.shields.io/npm/v/react-html-metadata.svg)](https://www.npmjs.com/package/react-html-metadata)
[![npm](https://img.shields.io/npm/dm/react-html-metadata.svg)](https://www.npmjs.com/package/react-html-metadata)
[![CircleCI branch](https://img.shields.io/circleci/project/github/adam-26/react-html-metadata/master.svg)](https://circleci.com/gh/adam-26/react-html-metadata/tree/master)
[![Code Climate](https://img.shields.io/codeclimate/coverage/github/adam-26/react-html-metadata.svg)](https://codeclimate.com/github/adam-26/react-html-metadata)
[![Code Climate](https://img.shields.io/codeclimate/github/adam-26/react-html-metadata.svg)](https://codeclimate.com/github/adam-26/react-html-metadata)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

### Introduction
This package provides a simple HTML template that supports metadata.

In isolation, this package is rather boring. However, this package provides the basis for implementing components that support SSR stream interface with HTML metadata.

You can see [one example of using **react-router v4 with streams and metadata** here](https://github.com/adam-26/react-router-metadata).

### Install
```sh
// npm
npm install --save react-html-metadata

// yarn
yarn add react-html-metadata
```

Internally, this package uses a slightly modified version of the excellent [react-helmet](https://github.com/nfl/react-helmet)
to apply metadata. The modified version is [react-cap](https://github.com/adam-26/react-cap), and it differs in that
it **does not use _data-react-helmet_ attributes**, instead it requires you to apply a `data-ignore-metadata` attribute
if you include any metadata in the render that does not use [react-cap](https://github.com/adam-26/react-cap).

### Usage

```js
// Complete list of exports
import Html, { Metadata, withMetadata, HtmlTag, HeadTag, BodyTag } from 'react-html-metadata';

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
    <Html metadata={metadata}>
      This is the HTML body content
    </Html>
  }
}
```

For a **more detailed example**, look at the [example project, you can clone and run it](https://github.com/adam-26/react-html-metadata/master/examples/ssr)

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

##### `render`
Optional, a function `(metadata, props) => {}` for custom rendering

##### `children`
Optional, content rendered **inside** of the `<body>` tag.

#### `Metadata`:

##### `Metadata.createNew(/* optional - metadata object */)`
A factory function that creates a new metadata instance, optionally accepting metadata configuration.

##### `Metadata.createForHydration(metadataState)`
A factory function that creates a new metadata instance for client hydration, expects the server generated metadata state.

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

# SSR Fixtures

TODO: proof required - caching <head> markup using this approach, Done. Remove before publishing example.
TODO: react-html-metadata, refactor to remove all refs to react-router* - update docs, add tests
TODO: Add tests for THIS pkg
TODO: react-router-dispatcher, remove BETA tag from 'standard-version'
TODO: Convert to project approach that allows for layouts and handles children correctly - it should be its OWN PKG
      -> Publish it as its own package??? Its NOT necessary right now.
TODO: react-cap, post comment to issue(s) discussing removing the data-react-helmet attrs.
===
TODO: create-react-app, apply 'data-ignore-metadata' attr to <style> tags from babel plugin(s)/loader(s)
TODO  -> will need to use 'npm run eject' to achieve this, therefore BRANCH first.




A set of test cases for quickly identifying issues with server-side rendering.

## Setup

To reference a local build of React, first run `npm run build` at the root
of the React project. Then:

```
cd fixtures/ssr
yarn
yarn start
```

The `start` command runs a webpack dev server and a server-side rendering server in development mode with hot reloading.

**Note: whenever you make changes to React and rebuild it, you need to re-run `yarn` in this folder:**

```
yarn
```

If you want to try the production mode instead run:

```
yarn start:prod
```

This will pre-build all static resources and then start a server-side rendering HTTP server that hosts the React app and service the static resources (without hot reloading).

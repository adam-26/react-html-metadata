# SSR HTML metadata example

TODO: create-react-app, apply 'data-ignore-metadata' attr to <style> tags from babel plugin(s)/loader(s)
TODO  -> will need to use 'npm run eject' to achieve this, therefore BRANCH first.

An example using SSR Html metadata.

## Setup

**First run `npm run build` at the _root_**
of this project. Then:

```
cd examples/ssr
npm install
npm run start
```

The `start` command runs a webpack dev server and a server-side rendering server in development mode with hot reloading.

**Note: whenever you make changes to react-html-metadata, you need to rebuild it - in the **root** directory:**

```
npm run build
```

If you want to try the production mode instead run:

```
npm run start:prod
```

This will pre-build all static resources and then start a server-side rendering HTTP server that hosts the React app and service the static resources (without hot reloading).

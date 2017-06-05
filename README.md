# Mirador Desktop
A desktop wrapper for Mirador and its environment, allowing the use of local images, and import/export of workspaces.

![Mirador Desktop Demo](demo.gif)

## Download
Some binaries are available to [download](https://stanford.box.com/v/mirador-desktop).

## Development

First get into the `app` folder and run `npm install`. Then several commands will be available:

- `npm run app`, executes the app in local development mode. It needs first `npm run build`.
- `npm run lint`, runs the linter with the airbnb style guide
- `npm run build`, builds Mirador from the git submodule added to the repo (unfortunately, `npm install mirador` doesn't work as expected), and add the mirador build to the app assets
- `npm run mirador:build`, builds mirador only
- `npm run package`, packages the app for MacOS (x64), Windows (ia32, x64), and Linux (ia32, x64, armv7l). Note that depending on your OS, you might not be able to package for all target distros. There also are individual package commands:
  - `npm run package:mac`
  - `npm run package:win`
  - `npm run package:linux`
- `npm run dist`, runs the linter, builds mirador, links the assets, and package for all distros.

## Distribution

Apps are not signed yet, therefore you might need to enable execution from unsafe sources to run it.

Main features:

- Source Map support
- Incremental Build
- Unit tests
- Browser Hot Reload

## PLEASE NOTE THIS PROJECT HAS BEEN DEVELOPED FOR LANDSCAPE VIEW FOR AN IPAD AND ABOVE.

Main dependencies:

- **Application Server**: [Node](https://nodejs.org/en/)
- **Compiler**: [TypeScript](https://github.com/Microsoft/TypeScript)
- **Bundler**: [Webpack](https://github.com/webpack/webpack)
- **Unit Test Runner**: [Mocha](https://github.com/mochajs/mocha)
- **Pixi.js**: [Pixi.js](http://www.pixijs.com/)

## Installation

Node, TypeScript and TSLint should be installed globally.

    $> git clone https://github.com/yahiko00/PixiProject.git <new folder>
    $> cd <new folder>
    $> git init
    $> yarn install

## Build

Commands should be run under a **bash** shell.

The following command builds and run the project in development mode with Hot Reload.

    $> yarn serve

The following command builds the project in production mode.

    $> yarn build

For more predefined commands, see `package.json`.

## Creating Assets

Texture atlases have been generated using [TexturePacker](https://www.codeandweb.com/texturepacker).

Sounds are generated using [Audiosprite](https://www.npmjs.com/package/audiosprite) via the command `audiosprite --output audiosprite \*.mp3 -f howler`

## Licence

MIT

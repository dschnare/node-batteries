# Node Batteries

This repo contains several modules I find myself needing in just about every
Nodejs project I've encountered. The idea of `node-batteries` is to provide a
repo that will include these common modules in one place.

## What is a battery?

For a module to be a 'battery' it must

1. have no external dependencies outside the battery module
2. be easily copiable from source as-is into any project

All batteries are modules directly under the `lib/` folder, except the
`index.js` module.

*NOTE: You may be able to copy the submodules inside each battery and/or remove
the submodules you don't need. Typically a battery module ony has one or more
submodules that depend on the other submodules (otherwise each submodule would
likely be a battery of its own -- i.e. in the lib root).*

## Requiring this package

This package, although not intended to be installed as a dependency directly,
can be required as a module itself, wherein all batteries are exposed as the
module's API.

    npm install dschnare/node-batteries --save

Example:

    const batteries = require('node-batteries')

    batteries.fs.mkdir('my/long/path/of/dirs')
      .then(() => {
        console.log('Directory tree created!')
      })
      .catch(error => console.error(error))

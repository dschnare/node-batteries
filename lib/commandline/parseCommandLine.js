const readOptions = require('./readOptions')
const readPositionalArgs = require('./readPositionalArgs')

/*
Where cli is a hash like:

{
  jsVarName: [ '--flag', '-f', '-F' ]
  ... etc.
}
*/
module.exports = function parseCommandLine (cli, args) {
  const supportedOptionNames = Object.keys(cli).map(key => cli[key]).reduce((a, b) => a.concat(b), [])
  const options = readOptions(args)
  const unsupportedOptionNames = Object.keys(options).filter(key => {
    return !supportedOptionNames.includes(key)
  })

  if (unsupportedOptionNames.length) {
    throw new Error('Unsupported options found : ' + unsupportedOptionNames.join(', '))
  }

  return Object.keys(cli).reduce((opts, key) => {
    opts[key] = cli[key].reduce((value, name) => value || options[name], null)
    return opts
  }, { args: readPositionalArgs(args) })
}

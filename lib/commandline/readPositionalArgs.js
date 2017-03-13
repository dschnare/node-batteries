module.exports = function readPositionalArgs (args, separator = '--') {
  let positionalArgs = []

  let k = args.findIndex(arg => arg.startsWith('-') && arg !== separator)
  if (k >= 0) positionalArgs = positionalArgs.concat(args.slice(0, k))

  k = args.findIndex(arg => arg === separator)
  if (k >= 0) positionalArgs = positionalArgs.concat(args.slice(k + 1))

  return positionalArgs
}

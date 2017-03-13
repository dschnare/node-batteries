module.exports = function readOptions (args) {
  let a = 0
  const options = {}

  while (a < args.length) {
    let arg = args[a]

    if (arg.startsWith('-')) {
      let [ name, value ] = arg.split('=')
      if (!value && args[a + 1] && !args[a + 1].startsWith('-')) {
        value = args[a += 1]
      } else {
        value = true
      }
      options[name] = value
    }
  }

  return options
}

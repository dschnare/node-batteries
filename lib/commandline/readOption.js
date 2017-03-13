module.exports = function readOption (name, args) {
  const names = [].concat(name)
  return names.reduce((value, name) => {
    const k = args.findIndex(arg => arg === name || arg.startsWith(name + '='))
    return value || k >= 0
      ? args[k].split('=')[1] ||
        (args[k + 1] && !args[k + 1].startsWith('-') && args[k + 1]) ||
        true
      : ''
  }, '')
}

module.exports = function debounce (fn, { timeout = 150, immediate = false } = {}) {
  let timeoutId = -1
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = -1
      if (!immediate) {
        fn(...args)
      }
    })
    if (immediate && timeoutId < 0) {
      fn(...args)
    }
  }
}

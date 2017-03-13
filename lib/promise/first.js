module.exports = function first (tasks) {
  tasks = tasks.slice()

  let p = Promise.reject(new Error())

  while (tasks.length) {
    const task = tasks.shift()
    p = p.catch(() => task())
  }

  return p
}

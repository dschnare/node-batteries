module.exports = function sequence (tasks) {
  tasks = tasks.slice()
  let p = Promise.resolve([])

  while (tasks.length) {
    const task = tasks.shift()
    p = p.then(results => {
      return Promise.resolve(task()).then(result => results.concat(result))
    })
  }

  return p
}

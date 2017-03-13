const sequence = require('./sequence')

module.exports = function all (tasks, batchSize = Infinity) {
  tasks = tasks.slice()
  const batches = []

  while (tasks.length) {
    batches.push(tasks.splice(0, batchSize))
  }

  return sequence(
    batches.map(
      batch => function () {
        return Promise.all(
          batch.map(task => new Promise((resolve, reject) => {
            resolve(task())
          }))
        )
      }
    )
  ).then(results => {
    return results.reduce((a, b) => a.concat(b), [])
  })
}

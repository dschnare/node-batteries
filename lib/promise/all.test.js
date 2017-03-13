const assert = require('assert')
const all = require('./all')

describe('promiseUtil#all', function () {
  it('should resolve when given no tasks', function (done) {
    all([]).then(results => {
      assert.strictEqual(results.length, 0, 'Results is not empty')
      done()
    }).catch(done)
  })

  it('should resolve with all task results', function (done) {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3)
    ]
    all(tasks).then(results => {
      assert.strictEqual(results.length, 3, 'Results is wrong length')
      assert.strictEqual(results.join(','), '1,2,3')
      done()
    }).catch(done)
  })

  it('should accept non-promise return values', function (done) {
    const tasks = [
      () => 1,
      () => 2,
      () => 3
    ]
    all(tasks).then(results => {
      assert.strictEqual(results.length, 3, 'Results is wrong length')
      assert.strictEqual(results.join(','), '1,2,3')
      done()
    }).catch(done)
  })

  it('should call each task in parallel', function (done) {
    const callLater = (callback, time = 0) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          callback()
          resolve()
        }, time)
      })
    }
    let taskRunningCount = 0
    const createTask = (expectedTasksRunning) => {
      taskRunningCount += 1
      assert.strictEqual(taskRunningCount, expectedTasksRunning, 'Expected tasks are not running')
      return () => null
    }
    const tasks = [
      () => callLater((createTask(1)), 200),
      () => callLater((createTask(2)), 200),
      () => callLater((createTask(3)), 200)
    ]
    const t = new Date().getTime()
    callLater(() => assert.strictEqual(taskRunningCount, 3))
    all(tasks).then(() => {
      const duration = new Date().getTime() - t
      assert.ok(duration >= 200, 'all took less than 200 milliseconds')
      done()
    }).catch(done)
  })

  it('should batch tasks', function (done) {
    const callLater = (callback, time = 0) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          callback()
          resolve()
        }, time)
      })
    }
    let taskRunningCount = 0
    const createTask = (expectedTasksRunning, isLast = false) => {
      taskRunningCount += 1
      assert.strictEqual(taskRunningCount, expectedTasksRunning, 'Expected tasks are not running')
      return () => isLast ? taskRunningCount = 0 : null
    }
    const tasks = [
      () => callLater((createTask(1)), 200),
      () => callLater((createTask(2, true)), 200),
      () => callLater((createTask(1)), 200),
      () => callLater((createTask(2, true)), 200),
      () => callLater((createTask(1, true)), 200),
      () => callLater((createTask(2)), 200)
    ]
    const t = new Date().getTime()
    all(tasks, 2).then(() => {
      const duration = new Date().getTime() - t
      assert.ok(duration >= 600, 'all took less than 600 milliseconds')
      done()
    }).catch(done)
  })

  it('should reject when a task throws', function (done) {
    all([
      () => { throw new Error('ERROR') }
    ]).then(() => done(new Error('all resolved'))).catch(() => done())
  })

  it('should reject when a task rejects', function (done) {
    all([
      () => Promise.reject(new Error('ERROR'))
    ]).then(() => done(new Error('all resolved'))).catch(() => done())
  })
})

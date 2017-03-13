const assert = require('assert')
const sequence = require('./sequence')

describe('promiseUtil#sequence', function () {
  it('should resolve when given no tasks', function (done) {
    sequence([]).then(results => {
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
    sequence(tasks).then(results => {
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
    sequence(tasks).then(results => {
      assert.strictEqual(results.length, 3, 'Results is wrong length')
      assert.strictEqual(results.join(','), '1,2,3')
      done()
    }).catch(done)
  })

  it('should call each task sequntially', function (done) {
    const callLater = (callback, time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          callback()
          resolve()
        }, time)
      })
    }
    let isTaskRunning = false
    const assertion = () => {
      assert.ok(!isTaskRunning, 'Task is not running')
      isTaskRunning = true
      return () => (isTaskRunning = false)
    }
    const tasks = [
      () => callLater((assertion()), 100),
      () => callLater((assertion()), 100),
      () => callLater((assertion()), 100)
    ]
    const t = new Date().getTime()
    sequence(tasks).then(() => {
      const duration = new Date().getTime() - t
      assert.ok(duration >= 300, 'Sequence took less than 300 milliseconds')
      done()
    }).catch(done)
  })

  it('should reject when a task throws', function (done) {
    sequence([
      () => { throw new Error('ERROR') }
    ]).then(() => done(new Error('Sequence resolved'))).catch(() => done())
  })

  it('should reject when a task rejects', function (done) {
    sequence([
      () => Promise.reject(new Error('ERROR'))
    ]).then(() => done(new Error('Sequence resolved'))).catch(() => done())
  })
})

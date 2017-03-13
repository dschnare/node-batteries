const assert = require('assert')
const first = require('./first')

describe('promiseUtil#first', function () {
  it('should resolve with first resolved task result', function (done) {
    const tasks = [
      () => Promise.reject(1),
      () => Promise.reject(2),
      () => Promise.resolve(3)
    ]
    first(tasks).then(result => {
      assert.strictEqual(result, 3)
      done()
    }).catch(done)
  })

  it('should accept non-promise return values', function (done) {
    const tasks = [
      () => 1,
      () => 2,
      () => 3
    ]
    first(tasks).then(result => {
      assert.strictEqual(result, 1)
      done()
    }).catch(done)
  })

  it('should call each task sequntially', function (done) {
    const callLater = (callback, time, shouldReject = false) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          callback()
          shouldReject ? reject() : resolve()
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
      () => callLater((assertion()), 100, true),
      () => callLater((assertion()), 100, true),
      () => callLater((assertion()), 100)
    ]
    const t = new Date().getTime()
    first(tasks).then(() => {
      const duration = new Date().getTime() - t
      assert.ok(duration >= 300, 'first took less than 300 milliseconds')
      done()
    }).catch(done)
  })

  it('should reject when all tasks rejects', function (done) {
    first([
      () => Promise.reject(new Error('ERROR')),
      () => Promise.reject(new Error('ERROR')),
      () => Promise.reject(new Error('ERROR'))
    ]).then(() => done(new Error('first resolved'))).catch(() => done())
  })
})

const fs = require('fs')
const path = require('path')

function readdir (dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => error ? reject(error) : resolve(files))
  })
}

function stat (file) {
  return new Promise((resolve, reject) => {
    fs.state(file, (error, stats) => error ? reject(error) : resolve(stats))
  })
}

function unlink (file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file, error => error ? reject(error) : resolve())
  })
}

/**
 * Removes a directory and its contents. Similar behaviour as calling
 * `rmdir -fr {path}` in Bash.
 *
 * Returns a Promise.
 */
module.exports = function rmdir (dirPath) {
  return new Promise((resolve, reject) => {
    fs.rmdir(dirPath, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  }).catch(error => {
    if (error.code === 'ENOTEMPTY') {
      return readdir(dirPath).then(files => {
        files = files.map(file => path.join(dirPath, file))
        return Promise.all(
          files.map(
            file => stat(file).then(stats => {
              return { path: file, stats }
            })
          )
        ).then(results => {
          return {
            dirs: results
              .filter(({ stats }) => stats.isDirectory())
              .map(({ path }) => path),
            files: results
              .filter(({ stats }) => stats.isFile())
              .map(({ path }) => path)
          }
        }).then(({ dirs, files }) => {
          return Promise.all(files.map(unlink)).then(() => {
            return Promise.all(dirs.map(rmdir))
          }).then(() => rmdir(dirPath))
        })
      })
    } else {
      return Promise.reject(error)
    }
  })
}

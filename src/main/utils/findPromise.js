import find from 'find'


export default {
  file(pattern, root) {
    return new Promise((resolve, reject) => {
      if (root) {
        find
          .file(pattern, root, files => {
            resolve(files)
          })
          .error(err => {
            if (err) {
              reject(err)
            }
          })
      } else {
        find
          .file(pattern, files => {
            resolve(files)
          })
          .error(err => {
            if (err) {
              reject(err)
            }
          })
      }
    })
  },
  dir(pattern, root) {
    return new Promise((resolve, reject) => {
      if (root) {
        find
          .dir(pattern, root, dirs => {
            resolve(dirs)
          })
          .error(err => {
            if (err) {
              reject(err)
            }
          })
      } else {
        find
          .dir(pattern, dirs => {
            resolve(dirs)
          })
          .error(err => {
            if (err) {
              reject(err)
            }
          })
      }
    })
  }
}

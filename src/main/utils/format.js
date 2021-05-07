import fs from 'fs'
import path from 'path'

export function getUniquePath(file) {
  let count = 1
  const baseFolder = path.dirname(file)
  const basename = path.basename(file, path.extname(file))
  while (fs.existsSync(file)) {
    file = path.join(
      baseFolder,
      basename + ' (' + count + ')',
      path.extname(file)
    )
    count++
  }
  return file
}

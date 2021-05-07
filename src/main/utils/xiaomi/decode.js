import fs from 'fs'

export function decodeBackupFile(backupPath, destPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(backupPath)
    const writeStream = fs.createWriteStream(destPath)
    let isFirst = true
    readStream.on('data', (chunk) => {
      if (isFirst) {
        isFirst = false
        for (let i = 0; i < 9; i++) {
          const index = chunk.indexOf(10)
          if (i === 8) {
            const alg = chunk.subarray(0, index).toString('utf8')
            if (alg === 'AES-256') {
              // TODO
            }
          }
          chunk = chunk.subarray(index + 1)
        }
      }
      writeStream.write(chunk)
    })

    readStream.on('error', reject)

    readStream.on('end', () => {
      writeStream.end()
      writeStream.close()
    })

    writeStream.on('close', () => {
      resolve()
    })
  })
}

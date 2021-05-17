import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { app } from 'electron'

export async function computeFileName(file) {
  const ext = path.extname(file)
  const baseFilePath = file.replace(ext, '')
  let filePath
  let index = 0

  while (true) {
    if (index === 0) {
      filePath = baseFilePath + ext
    } else {
      filePath = baseFilePath + `(${index})` + ext
    }
    index++
    try {
      await fs.promises.access(filePath, fs.constants.F_OK)
    } catch (error) {
      break
    }
  }
  return filePath
}

export function formatTime(time, str) {
  if (!time) {
    return ''
  }
  if (str) {
    return moment(time).format(str)
  } else {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }
}

export function getExecPath() {
  const exePath = getUsableInstance(app, 'app').getPath('exe')
  let execPath
  if (process.env.NODE_ENV === 'development') {
    execPath = exePath.substr(0, exePath.indexOf('node_modules'))
  } else {
    execPath = path.dirname(exePath)
  }
  return execPath
}

function getUsableInstance(arg, argName) {
  return process.type === 'renderer' ? remote[argName] : arg
}

export function transfer(transfer, destPath) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(destPath)
    let count = 0
    stream.on('finish', () => {
      count++
      if (count === 2) {
        resolve(null)
      }
    })
    stream.on('error', reject)
    transfer.on('end', () => {
      count++
      if (count === 2) {
        resolve(null)
      }
    })
    transfer.on('error', reject)
    transfer.pipe(stream)
  })
}

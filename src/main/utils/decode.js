import Adb from './adb'
import mkdirp from 'mkdirp'
import fs from 'fs'
import path from 'path'
import tar from 'tar'
import { decodeBackupFile } from './xiaomi/decode'
import { extract as extractStorage } from '../utils/storage'

export async function decodeBackupXiaomi(serial, destPath) {
  let isExistDestPath = false
  try {
    await fs.promises.access(destPath)
    isExistDestPath = true
  } catch (error) {
    isExistDestPath = false
  }
  if (isExistDestPath) {
    return destPath
  }
  const adb = Adb.getInstance()
  const orgRootPath = '/sdcard/MIUI/backup/AllBackup'
  const backupFolders = await adb.readdir(serial, orgRootPath)
  if (backupFolders.length === 0) {
    return
  }
  const length = backupFolders.length
  const folder =
    orgRootPath +
    '/' +
    backupFolders.sort((a, b) => a.mtime - b.mtime)[length - 1].name // 解析最新的一次备份的备份文件
  await mkdirp(destPath)
  await copyFolder(adb, serial, folder, destPath)
  const files = await fs.promises.readdir(destPath)
  // const files = await find.file(/.*\.bak$/, destPath)
  for (const file of files) {
    if (path.extname(file) === '.bak') {
      const filePath = path.join(destPath, file)
      const basename = path.basename(file, path.extname(file))
      const destTarPath = `${destPath}/${basename}.tar`
      await decodeBackupFile(filePath, destTarPath)
      await tar.extract({
        cwd: destPath,
        file: destTarPath
      })
    }
  }
  return destPath
}

const appPackageMap = {
  weChat: '微信(com.tencent.mm).bak',
  qq: 'QQ(com.tencent.mobileqq).bak'
}

async function copyFolder(adb, serial, orgFolder, destPath) {
  const backupFiles = await adb.readdir(serial, orgFolder)
  const sync = await adb.syncService(serial)
  const packages = []
  for (const app of extractStorage.apps) {
    packages.push(appPackageMap[app])
  }
  for (const backupFile of backupFiles) {
    if (packages.indexOf(backupFile.name) > -1) {
      const backupFilePath = `${orgFolder}/${backupFile.name}`
      const transfer = sync.pull(backupFilePath)
      const destFilePath = path.join(destPath, backupFile.name)
      await copyFile(transfer, destFilePath)
    }
  }
  sync.end()
}

function copyFile(transfer, destPath) {
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

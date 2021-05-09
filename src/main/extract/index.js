import { save as saveExtract } from '../db/extract'
import WeChatXiaomi from './weChat/xiaomi'
import { formatTime } from '../utils/format'
import { extract as extractStorage } from './storage'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import Adb from '../utils/adb'
import { getUniquePath } from '../utils/format'
import { sendStart } from '../events/evenReply'

const deviceMap = {
  Xiaomi: new WeChatXiaomi()
}
const client = Adb.getInstance()
const extract = {
  extractData: async (params) => {
    const extractInfo = {
      deviceModel: params.device.manufacturer + ' ' + params.device.model,
      createTime: new Date().getTime()
    }
    extractInfo['name'] =
      extractInfo.deviceModel +
      ' ' +
      formatTime(extractInfo.createTime, 'YYYY-MM-DD')
    const extractId = saveExtract(extractInfo).lastInsertRowid
    extractStorage.id = extractId
    extractStorage.name = extractInfo.name
    extractStorage.deviceModel = extractInfo.deviceModel
    extractStorage.createTime = extractInfo.createTime

    sendStart('开始提取...', 0)
    const folder = path.join(app.getPath('documents'), 'Electron')
    if (!fs.existsSync(folder)) {
      await mkdirp(folder)
    }
    const extractFolder = getUniquePath(path.join(folder, extractInfo.name))
    await mkdirp(extractFolder)

    // const deviceId = params.device.serial
    // const backupPath = '/storage/emulated/0/MIUI/backup/AllBackup'
    // client.readdir(deviceId, backupPath).then(function(files) {
    //   for (const file of files) {
    //     const backupFilePath = `${backupPath}/${file.name}/微信(com.tencent.mm).bak`
    //     console.log(backupFilePath)
    //     client.pull(deviceId, backupFilePath).then(function(transfer) {
    //       return new Promise(function(resolve, reject) {
    var fn = 'E:/backup/微信(com.tencent.mm).bak'
    //         transfer.on('progress', function(stats) {
    //           console.log(
    //             '[%s] Pulled %d bytes so far',
    //             deviceId,
    //             stats.bytesTransferred
    //           )
    //         })
    //         transfer.on('end', function() {
    //           console.log('[%s] Pull complete', deviceId)
    //           resolve(deviceId)
    //         })
    //         transfer.on('error', reject)
    //         transfer.pipe(fs.createWriteStream(fn))
    //       })
    //     })
    //   }
    // })
    deviceMap[params.device.manufacturer].execExtract(fn)
  }
}

export default extract

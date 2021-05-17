import { ipcMain } from 'electron'
import Extract from '../extract/index'
import { save as saveExtract } from '../db/extract'
import { extract as extractStorage } from '../utils/storage'
import { formatTime, computeFileName } from '../utils/format'
import path from 'path'

const extract = (mainWindow) => {
  ipcMain.on('extract:data', async (event, params) => {
    const name =
      params.device.manufacturer +
      ' ' +
      params.device.model +
      ' ' +
      formatTime(new Date(), 'YYYY-MM-DD')
    const extractPath = await computeFileName(
      path.join('F:/extract-test', name)
    )
    const extractInfo = {
      name: name,
      createTime: new Date().getTime(),
      apps: JSON.stringify(params.apps),
      path: extractPath
    }
    const extractId = saveExtract(extractInfo).lastInsertRowid
    extractStorage.id = extractId
    extractStorage.apps = params.apps
    extractStorage.path = extractInfo.path
    extractStorage.manufacturer = params.device.manufacturer
    extractStorage.serial = params.device.serial
    extractStorage.meid = params.device.meid
    if (params.device.imei1 && params.device.imei2) {
      extractStorage.imei = [params.device.imei1, params.device.imei2]
    } else {
      extractStorage.imei = params.device.imei
    }
    console.log(extractStorage)
    Extract.extractData()
  })
}
export default extract

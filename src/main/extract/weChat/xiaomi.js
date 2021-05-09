import Database from 'better-sqlite3'
import WeChatBase from './base'
import path from 'path'
import tar from 'tar'
import fs from 'fs'
import md5 from 'md5'
import mkdirp from 'mkdirp'
import { sleep } from '../../utils/sleep'
import { getUniquePath } from '../../utils/format'
import { sendProcess, sendEnd } from '../../events/evenReply'
import { decodeBackupFile } from '../../utils/xiaomi/decode'

export default class WeChatXiaomi extends WeChatBase {
  async execExtract(file) {
    sendProcess('解压中...', 50)
    // await sleep(2000)
    const baseFolder = path.dirname(file)
    const basename = path.basename(file, path.extname(file))
    const destFolder = getUniquePath(path.join(baseFolder, 'weChat'))
    await mkdirp(destFolder)
    const destTarPath = path.join(destFolder, `${basename}.tar`)
    await decodeBackupFile(file, destTarPath)
    await tar.extract({
      cwd: destFolder,
      file: destTarPath
    })
    this._storagePath = destFolder
    sendProcess('解析中...', 75)
    // await sleep(2000)
    const data = await fs.promises.readFile(
      path.join(
        this._storagePath,
        '/apps/com.tencent.mm/sp/auth_info_key_prefs.xml'
      )
    )
    const uin = await this.computeUin(data)
    const folderName = md5(`mm${uin}`)
    const enDbFile = path.join(
      this._storagePath,
      `/apps/com.tencent.mm/r/MicroMsg/${folderName}/EnMicroMsg.db`
    )
    let realKey = ''
    try {
      realKey = await this.computePassword(enDbFile, uin)
    } catch (error) {
      console.warn(error)
      console.log('error')
      return
    }
    console.log(realKey)
    this._enDB = new Database(enDbFile)
    this._enDB.pragma(`key = "${realKey}"`)
    this._filePath = path.join(
      this._storagePath,
      `/apps/com.tencent.mm/r/MicroMsg/${folderName}`
    )
    await super.execExtract()
    this._enDB.close()
    sendEnd('success', '已完成', 100)
  }
}

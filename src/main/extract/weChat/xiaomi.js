import Database from 'better-sqlite3'
import WeChatBase from './base'
import path from 'path'
import fs from 'fs'
import md5 from 'md5'
import { decodeBackupXiaomi } from '../../utils/decode'
import { extract as extractStorage } from '../../utils/storage'

import { sendProcess, sendEnd } from '../../events/evenReply'

export default class WeChatXiaomi extends WeChatBase {
  async execExtract() {
    sendProcess('解压中...', 50)
    // const storagePath = await decodeBackupXiaomi(
    //   extractStorage.serial,
    //   path.join(extractStorage.path, '.temp')
    // )
    const storagePath = path.join(
      'F:/extract-test/Xiaomi MI 6 2021-05-14',
      '.temp'
    )
    sendProcess('解析中...', 75)
    const data = await fs.promises.readFile(
      path.join(storagePath, 'apps/com.tencent.mm/sp/app_brand_global_sp.xml')
    )

    let noKeyCount = 0

    const uins = await this.computeUins(data)
    for (const uin of uins) {
      const folderName = md5(`mm${uin}`)
      const enDbFile = path.join(
        storagePath,
        `apps/com.tencent.mm/r/MicroMsg/${folderName}/EnMicroMsg.db`
      )
      const snsDbFile = path.join(
        storagePath,
        `apps/com.tencent.mm/r/MicroMsg/${folderName}/SnsMicroMsg.db`
      )

      let realKey = ''

      try {
        realKey = await this.computePassword(enDbFile, uin)
      } catch (error) {
        console.log('no key.', error)
        noKeyCount++
        continue
      }

      console.log(`key is ${realKey}`)

      const enDataBase = new Database(enDbFile)
      enDataBase.pragma(`key = "${realKey}"`)
      this._enDB = enDataBase
      this._snsDB = new Database(snsDbFile)
      this._filePath = path.join(
        storagePath,
        `apps/com.tencent.mm/r/MicroMsg/${folderName}`
      )
      await super.execExtract()
      this._enDB.close()
      this._snsDB.close()
    }

    if (uins.length === noKeyCount) {
      sendEnd('fail', '未获取到账号密钥', 90)
    }

    sendEnd('success', '已完成', 100)
  }
}

import QqBase from './base'
import { extract as extractStorage } from '../../utils/storage'
import { decodeBackupXiaomi } from '../../utils/decode'
import { sendProcess, sendEnd } from '../../events/evenReply'
import path from 'path'
import findPromise from '../../utils/findPromise'
import fs from 'fs'
import Database from 'better-sqlite3'
import md5 from 'md5'

export default class QqXiaomi extends QqBase {
  async execExtract() {
    sendProcess('解压中...', 50)
    //  this._storagePath = await decodeBackupXiaomi(
    //   extractStorage.serial,
    //   path.join(extractStorage.path, '.temp')
    // )
    this._storagePath = path.join(
      'F:/extract-test/Xiaomi MI 6 2021-05-17(2)',
      '.temp'
    )
    sendProcess('解析中...', 75)

    const keyPath = path.join(
      this._storagePath,
      'apps/com.tencent.mobileqq/f/kc'
    )

    const key = await fs.promises.readFile(keyPath)
    this._keyArray = new Uint8Array(key)

    const files = await findPromise.file(
      /\\(\d)+\.db$/,
      `${this._storagePath}/apps/com.tencent.mobileqq/db`
    )
    for (const file of files) {
      const uin = path.basename(file, '.db')
      console.log(uin)
      try {
        await fs.promises.access(file)
      } catch (error) {
        console.error(TAG, error)
        continue
      }
      this._db = new Database(file)
      this._uin = uin
      await super.execExtract()
      this._db.close()
    }

    sendEnd('success', '已完成', 100)
  }

  async getUserAvatar(uin) {
    const fileName = md5(
      md5(md5(uin).toUpperCase() + uin).toUpperCase() + uin
    ).toUpperCase()
    let prefix = this._storagePath + '/apps/com.tencent.mobileqq/ef/Tencent'
    const isExist = fs.existsSync(prefix)
    if (!isExist) {
      prefix = this._storagePath + '/apps/com.tencent.mobileqq/ef/tencent'
    }
    const sourcePath = prefix + '/MobileQQ/head/_hd/' + fileName + '.jpg_'
    const destPath = path.join(
      extractStorage.path,
      'qq',
      'head',
      fileName + '.jpg'
    )
    try {
      await mkdirp(path.dirname(destPath))
      await cpFile(sourcePath, destPath)
    } catch (error) {
      return null
    }
    return destPath
  }

  async getTroopAvatar(uin) {
    uin = uin.replace('troop_', '')
    const fileName = md5(
      md5(md5(uin).toUpperCase() + uin).toUpperCase() + uin
    ).toUpperCase()
    let prefix = this._storagePath + '/apps/com.tencent.mobileqq/ef/Tencent'
    const isExist = fs.existsSync(prefix)
    if (!isExist) {
      prefix = this._storagePath + '/apps/com.tencent.mobileqq/ef/tencent'
    }
    const sourcePath = prefix + '/MobileQQ/head/_hd/troop_' + fileName + '.jpg_'
    const sourcePath2 =
      prefix + '/MobileQQ/head/_hd/new_troop_b_' + fileName + '.jpg_'
    const destPath = path.join(
      extractStorage.path,
      'qq',
      'head',
      'troop_' + fileName + '.jpg'
    )
    await mkdirp(path.dirname(destPath))
    try {
      await cpFile(sourcePath, destPath)
    } catch (error) {
      try {
        await cpFile(sourcePath2, destPath)
      } catch (error) {
        return null
      }
    }

    return destPath
  }
}

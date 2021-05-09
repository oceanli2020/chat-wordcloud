import Database from 'better-sqlite3'
import { app } from 'electron'
import mkdirp from 'mkdirp'
import fs from 'fs'
import path from 'path'
export default class DB {
  static instance

  static getInstance() {
    if (!this.instance) {
      this.instance = DB.createDb()
    }
    return this.instance
  }

  static createDb() {
    const dbPath = path.resolve(
      app.getPath('userData'),
      './data/chat-wordcloud/Database.db'
    )
    const isDbExist = fs.existsSync(dbPath)

    if (!isDbExist) {
      mkdirp.sync(path.dirname(dbPath))
    }

    const dataBase = new Database(dbPath)

    if (!isDbExist) {
      dataBase.exec(fs.readFileSync(__static + '/V1_extract.sql', 'utf8'))
      dataBase.exec(fs.readFileSync(__static + '/V2_weChat.sql', 'utf8'))
    }

    dataBase.pragma('journal_mode = WAL')
    // 数据库区分大小写
    dataBase.pragma('case_sensitive_like=ON')

    return dataBase
  }
}

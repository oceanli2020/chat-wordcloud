import DB from '../../utils/database'

export function createTable(tableName) {
  const sql =
    `CREATE TABLE IF NOT EXISTS "${tableName}" (` +
    '"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
    '"userId" INTEGER,' +
    '"friendId" INTEGER,' +
    '"friendUin" INTEGER,' +
    '"senderUin" TEXT,' +
    '"isSend" INTEGER,' +
    '"isRead" INTEGER,' +
    '"isValid" INTEGER,' +
    '"isTroop" INTEGER,' +
    '"msgType" INTEGER,' +
    '"msgData" BLOB,' +
    '"time" INTEGER,' +
    '"showMessage" TEXT,' +
    '"filePath" TEXT,' +
    ');'

  const prepare = DB.getInstance().prepare(sql)
  return prepare.run()
}

export function save(group, tableName, rtnPrepare) {
  const sql =
    `insert into "${tableName}" ` +
    '(userId, friendId, friendUin, senderUin, isSend, isRead, isValid, isTroop, msgType, msgData, time, showMessage, filePath) values ' +
    '(@userId, @friendId, @friendUin, @senderUin, @isSend, @isRead, @isValid, @isTroop, @msgType, @msgData, @time, @showMessage, @filePath)'

  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.run(group)
}

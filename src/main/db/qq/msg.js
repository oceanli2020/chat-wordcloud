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
    '"filePath" TEXT' +
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

export function getMsgTableListByTableName(msg, rtnPrepare) {
  const sql =
    'SELECT * FROM sqlite_master where type = "table" and name like @name'
  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.all({ name: `%${msg.name}%` })
}

export function getMsgFriendsByUserIdAndTableName(msg, rtnPrepare) {
  const sql = `select f.uin, f.name nickname, f.remark conRemark, f.avatar  from "${msg.firstTableName}" t left join "${msg.secondTableName}" f on f.userId = @userId and f.uin = t.friendUin where t.userId = @userId  group by f.uin`
  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.get(msg)
}
export function getMsgByUserIdAndTableName(msg, rtnPrepare) {
  const sql = `SELECT * FROM  "${msg.tableName}" where userId = @userId order by time asc   `
  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.all(msg)
}

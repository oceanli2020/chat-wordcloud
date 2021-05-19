import DB from '../../utils/database'

export function save(message) {
  const sql =
    'insert into weChatMessage ' +
    '(msgId, type, isSend, createTime, talker, content, imgPath, userId) values ' +
    '(@msgId, @type, @isSend, @createTime, @talker, @content, @imgPath, @userId)'
  return DB.getInstance()
    .prepare(sql)
    .run(message)
}

export function getByUserId(message) {
  const sql =
    'select m.talker, m.isSend, m.createTime, m.content, m.type, m.imgPath from weChatMessage m ' +
    'INNER JOIN  weChatContacts c on m.talker = c.username and c.userId = @userId  ' +
    `where m.userId = @userId and m.type = 1 and m.talker = @talker`
  return DB.getInstance()
    .prepare(sql)
    .all(message)
}

export function getByUserIdAndContactsType(message) {
  const sql =
    'SELECT c.conRemark, c.nickname, c.avatar, c.username uin, max(m.createTime) time from weChatMessage m ' +
    'INNER JOIN  weChatContacts c on m.talker = c.username and c.userId = @userId and c.type = @contactsType WHERE m.userId = @userId and m.type = 1 ' +
    'GROUP BY c.username ORDER BY time DESC'
  return DB.getInstance()
    .prepare(sql)
    .all(message)
}

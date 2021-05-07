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



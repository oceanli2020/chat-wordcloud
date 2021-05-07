import DB from '../../utils/database'

export function save(contacts) {
  const sql =
    'insert into weChatContacts ' +
    '(username, alias, nickname, avatar, conRemark, type, userId) values ' +
    '(@username, @alias, @nickname, @avatar, @conRemark, @type, @userId)'
  return DB.getInstance()
    .prepare(sql)
    .run(contacts)
}


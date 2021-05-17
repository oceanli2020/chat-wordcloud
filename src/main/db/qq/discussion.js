import DB from '../../utils/database'

export function save(discussion, rtnPrepare) {
  const sql =
    'insert into qqDiscussion ' +
    '(userId, uin, name, ownerUin, createTime) values ' +
    '(@userId, @uin, @name, @ownerUin, @createTime)'

  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.run(discussion)
}

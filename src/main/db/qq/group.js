import DB from '../../utils/database'

export function save(group, rtnPrepare) {
  console
  const sql =
    'insert into qqGroup ' +
    '(userId, name, count) values ' +
    '(@userId, @name, @count)'

  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.run(group)
}

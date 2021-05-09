import DB from '../utils/database'

export function save(extract) {
  const sql =
    'insert into extract ' +
    '(name, deviceModel, createTime) values (@name, @deviceModel, @createTime)'
  return DB.getInstance()
    .prepare(sql)
    .run(extract)
}

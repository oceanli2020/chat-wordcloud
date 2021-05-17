import DB from '../utils/database'

export function save(extract) {
  const sql =
    'insert into extract ' +
    '(name, apps, createTime, path) values (@name, @apps, @createTime, @path)'
  return DB.getInstance()
    .prepare(sql)
    .run(extract)
}

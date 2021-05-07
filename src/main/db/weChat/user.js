import DB from '../../utils/database'

export function save(user) {
  const sql =
    'insert into weChatUser ' +
    '(name, alias, nickname, signature, country, province, city, qq, phone, avatar) values ' +
    '(@name, @alias, @nickname, @signature, @country, @province, @city, @qq, @phone, @avatar)'
  return DB.getInstance()
    .prepare(sql)
    .run(user)
}

export function list(user) {
  const sql = 'select * from weChatUser'
  return DB.getInstance().prepare(sql).all(user)
}

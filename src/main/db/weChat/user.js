import DB from '../../utils/database'

export function save(user) {
  const sql =
    'insert into weChatUser ' +
    '(name, alias, nickname, signature, country, province, city, qq, phone, avatar, extractId) values ' +
    '(@name, @alias, @nickname, @signature, @country, @province, @city, @qq, @phone, @avatar, @extractId)'
  return DB.getInstance()
    .prepare(sql)
    .run(user)
}

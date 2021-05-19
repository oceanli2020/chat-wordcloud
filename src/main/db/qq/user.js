import DB from '../../utils/database'

export function save(user) {
  const sql =
    'insert into qqUser ' +
    '(uin, name, gender, age, extractId, country, province, city, email,' +
    ' phone, sign, constellation, birthday, company, profession, school, avatar) values ' +
    '(@uin, @name, @gender, @age, @extractId, @country, @province, @city, @email,' +
    ' @phone, @sign, @constellation, @birthday, @company, @profession, @school, @avatar)'

  return DB.getInstance()
    .prepare(sql)
    .run(user)
}

export function getById(user, rtnPrepare) {
  const sql = 'select * from qqUser where id = @id '
  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.get(user)
}

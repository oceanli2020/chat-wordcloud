import DB from '../../utils/database'

export function save(friend, rtnPrepare) {
  const sql =
    'insert into qqFriend ' +
    '(uin, name, gender, age, userId, remark, groupId, country, province, city, email,' +
    ' phone, sign, constellation, birthday, company, profession, school, avatar) values ' +
    '(@uin, @name, @gender, @age, @userId, @remark, @groupId, @country, @province, @city, @email,' +
    ' @phone, @sign, @constellation, @birthday, @company, @profession, @school, @avatar)'

  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.run(friend)
}

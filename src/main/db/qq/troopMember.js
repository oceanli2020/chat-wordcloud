import DB from '../../utils/database'

export function save(troopMember, rtnPrepare) {
  const sql =
    'insert into qqTroopMember ' +
    '(userId, troopId, troopUin, memberUin, friendNick, troopNick, joinTime, sex, age, phone, email) values ' +
    '(@userId, @troopId, @troopUin, @memberUin, @friendNick, @troopNick, @joinTime, @sex, @age, @phone, @email)'

  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.run(troopMember)
}

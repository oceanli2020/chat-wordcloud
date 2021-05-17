import DB from '../../utils/database'

export function save(troop, rtnPrepare) {
  const sql =
    'insert into qqTroop ' +
    '(userId, uin, name, ownerUin, memo, joinTime, memberNum) values ' +
    '(@userId, @uin, @name, @ownerUin, @memo, @joinTime, @memberNum)'

    const prepare = DB.getInstance().prepare(sql)
    return rtnPrepare ? prepare : prepare.run(troop)

import DB from '../../utils/database'

export function save(discussionMember, rtnPrepare) {
  const sql =
    'insert into qqDiscussionMember ' +
    '(userId, discussionId, discussionUin, memberUin, remark) values ' +
    '(@userId, @discussionId, @discussionUin, @memberUin, @remark)'

  const prepare = DB.getInstance().prepare(sql)
  return rtnPrepare ? prepare : prepare.run(discussionMember)
}

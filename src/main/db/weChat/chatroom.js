import DB from '../../utils/database'

export function save(chatroom) {
  const sql =
    'insert into weChatChatroom ' +
    '(name, nickname, memberList, displayNameList, roomOwner, selfDisplayName, notice, noticeEditor, noticePublishTime, memberCount, avatar,userId) values ' +
    '(@name, @nickname, @memberList, @displayNameList, @roomOwner, @selfDisplayName, @notice, @noticeEditor, @noticePublishTime, @memberCount, @avatar, @userId)'
  return DB.getInstance()
    .prepare(sql)
    .run(chatroom)
}


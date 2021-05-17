import { Buffer } from 'buffer'
import md5 from 'md5'
import { save as saveUser } from '../../db/qq/user'
import { extract as extractStorage } from '../../utils/storage'
import { save as saveFriend } from '../../db/qq/friend'
import { save as saveGroup } from '../../db/qq/group'
import { save as saveTroop } from '../../db/qq/troop'
import { save as saveTroopMember } from '../../db/qq/troopMember'
import { save as saveDiscussion } from '../../db/qq/discussion'
import { save as saveDiscussionMember } from '../../db/qq/discussionMember'
import { createTable as createMsgTable, save as saveMsg } from '../../db/qq/msg'
import DB from '../../utils/database'
import Adb from '../../utils/adb'
import mkdirp from 'mkdirp'
import path from 'path'
import { transfer as transferFile } from '../../utils/format'

export default class QqBase {
  constructor() {
    this._db = null
    this._keyArray = new Uint8Array()
    this._storagePath = ''
    this._uin = ''
  }

  _msgType = {
    // 文本
    '-1000': 1,
    // 图文混合
    '-1035': 4,
    // 图片
    '-2000': 2,
    // 音频
    '-2002': 3,
    // 文件 （群文件？）
    '-2017': 4,
    // 文件（已下载？）
    '-2005': 5,
    // 红包
    '-2025': 5,
    // 位置共享 | 群签到 | 群公告
    '-5008': 96,
    // 戳一戳
    '-5018': 97,
    // 好友申请
    '-2050': 98,
    // 撤回消息通知
    '-5040': 99
  }

  async execExtract() {
    const friends = await this.handleFriends()
    if (friends.length !== 0) {
      this.handleFriendMessage(friends)
    }
    this.handleSystemMessage()

    const troops = await this.handleTroop()
    if (troops.length > 0) {
      this.handleTroopMember(troops)
      this.handleTroopMessage(troops)
    }

    const discussions = this.handleDiscussion()
    if (discussions.length > 0) {
      this.handleDiscussionMember(discussions)
      this.handleDiscussionMessage(discussions)
    }
  }

  // 处理好友信息并，获取当前用户信息
  async handleFriends() {
    if (!this.isExistTable('Friends')) {
      return []
    }
    const uin = this._uin
    const friendsMap = new Map()

    const encodedUsers = this._db.prepare('select * from friends').all()
    const users = this.decodeArrayResult(encodedUsers)
    users.forEach((user) => {
      friendsMap.set(user.uin, {
        name: user.name,
        remark: user.remark,
        age: user.age,
        gender: user.gender,
        groupId: user.groupid,
        constellation: null,
        country: null,
        province: null,
        city: null,
        email: null,
        phone: null,
        sign: null,
        birthday: null,
        company: null,
        school: null,
        profession: null,
        avatar: null
      })
    })

    if (this.isExistTable('Card')) {
      const encodedCards = this._db.prepare('select * from card').all()

      const cards = this.decodeArrayResult(encodedCards)
      cards.forEach((card) => {
        if (friendsMap.has(card.uin)) {
          const user = friendsMap.get(card.uin)
          Object.assign(user, {
            constellation: card.constellation,
            country: card.strCountry,
            province: card.strProvince,
            city: card.strCity,
            email: card.strEmail,
            phone: card.bindPhoneInfo,
            sign: card.vRichSign,
            birthday: card.lBirthday,
            company: card.strCompany,
            school: card.strSchool,
            profession: card.iProfession
          })
        }
      })
    }

    if (this.isExistTable('Setting')) {
      const encodedSettings = this._db
        .prepare("select * from setting where uin not like 'troop_%'")
        .all()

      const settings = this.decodeArrayResult(encodedSettings)

      for (const setting of settings) {
        // bHeadType为1时代表自定义头像，0为系统头像，系统头像文件命名规则暂时未发现
        let avatarPath
        if (setting.bHeadType === 1 && friendsMap.has(setting.uin)) {
          avatarPath = await this.getUserAvatar(setting.uin)
        }
        if (friendsMap.has(setting.uin)) {
          const user = friendsMap.get(setting.uin)
          Object.assign(user, {
            avatar: avatarPath
          })
        }
      }
    }

    const curUser = friendsMap.get(uin)
    Object.assign(curUser, {
      uin: uin,
      extractId: extractStorage.id
    })
    delete curUser['remark']
    delete curUser['groupId']
    const userId = saveUser(curUser).lastInsertRowid
    if (typeof userId === 'string' || typeof userId === 'number') {
      this._userId = Number(userId)
    } else {
      this._userId = userId.toNumber()
    }

    const groupMap = this.handleGroup(userId)

    const friends = []
    friendsMap.forEach((value, key) => {
      if (key !== uin) {
        Object.assign(value, {
          uin: key,
          userId: userId,
          groupId: groupMap.has(value.groupId)
            ? groupMap.get(value.groupId).groupId
            : -1
        })
        friends.push(value)
      }
    })

    const saveFriendPre = saveFriend(null, true)

    const saveBatch = DB.getInstance().transaction((friends) => {
      for (const friend of friends) {
        Object.assign(friend, {
          id: saveFriendPre.run(friend).lastInsertRowid
        })
      }
    })

    saveBatch(friends)
    return friends
  }

  handleGroup(userId) {
    if (!this.isExistTable('Groups')) {
      return new Map()
    }
    const encodedGroups = this._db.prepare('select * from groups').all()
    const groups = this.decodeArrayResult(encodedGroups)
    const qqGroups = []
    const groupMap = new Map()

    groups.forEach((group) => {
      const qqGroup = {
        userId: userId,
        name: group.group_name,
        count: group.group_friend_count
      }
      qqGroups.push(qqGroup)
      groupMap.set(group.group_id, qqGroup)
    })

    const saveGroupPre = saveGroup(null, true)

    const saveBatch = DB.getInstance().transaction((qqGroups) => {
      for (let index = 0; index < qqGroups.length; index++) {
        const qqGroup = qqGroups[index]
        const group = groups[index]
        const newGroupId = saveGroupPre.run(qqGroup).lastInsertRowid
        Object.assign(groupMap.get(group.group_id), {
          groupId: newGroupId
        })
      }
    })
    saveBatch(qqGroups)
    return groupMap
  }

  async handleTroop() {
    if (!this.isExistTable('TroopInfoV2')) {
      return []
    }
    const encodedTroops = this._db.prepare('SELECT * FROM TroopInfoV2').all()
    const troops = this.decodeArrayResult(encodedTroops)
    const qqTroops = []
    const troopMap = new Map()
    troops.forEach((troop) => {
      const qqTroop = {
        userId: this._userId,
        uin: troop.troopuin,
        name: troop.troopname,
        ownerUin: troop.troopowneruin,
        memo: troop.troopmemo,
        joinTime: troop.dwCmdUinJoinTime * 1000,
        memberNum: troop.wMemberNum
      }
      qqTroops.push(qqTroop)
      troopMap.set('troop_' + troop.troopuin, qqTroop)
    })

    if (this.isExistTable('Setting')) {
      const encodedSettings = this._db
        .prepare("select * from setting where uin like 'troop_%'")
        .all()

      const settings = this.decodeArrayResult(encodedSettings)

      for (const setting of settings) {
        // bHeadType为1时代表自定义头像，0为系统头像，系统头像文件命名规则暂时未发现
        let avatarPath
        if (setting.bHeadType === 1 && troopMap.has(setting.uin)) {
          avatarPath = await this.getTroopAvatar(setting.uin)
        }
        if (troopMap.has(setting.uin)) {
          const user = troopMap.get(setting.uin)
          Object.assign(user, {
            avatar: avatarPath
          })
        }
      }
    }

    const saveTroopPre = saveTroop(null, true)
    const saveBatch = DB.getInstance().transaction((troops) => {
      for (const troop of troops) {
        Object.assign(troop, {
          id: saveTroopPre.run(troop).lastInsertRowid
        })
      }
    })

    saveBatch(qqTroops)
    return qqTroops
  }

  handleTroopMember(troops) {
    if (!this.isExistTable('TroopMemberInfo')) {
      return
    }
    const troopMap = new Map()
    troops.forEach((troop) => {
      troopMap.set(troop.uin, troop)
    })

    const troopMemberMap = new Map()

    const encodedMembers = this._db
      .prepare('select * from troopmemberinfo')
      .all()
    const members = this.decodeArrayResult(encodedMembers)
    members.forEach((member) => {
      if (member.memberuin === '0') {
        return
      }
      troopMemberMap.set(member.troopuin + member.memberuin, {
        userId: this._userId,
        troopId: troopMap.has(member.troopuin)
          ? troopMap.get(member.troopuin).id
          : -1,
        troopUin: member.troopuin,
        memberUin: member.memberuin,
        friendNick: member.friendnick,
        troopNick: member.troopnick,
        joinTime: member.join_time,
        // -1 不明 0 男 1 女
        sex: member.sex,
        // 0 不明
        age: member.age,
        phone: null,
        email: null
      })
    })

    if (this.isExistTable('TroopMemberCardInfo')) {
      const encodedMemberCards = this._db
        .prepare('select * from troopmembercardinfo')
        .all()
      const memberCards = this.decodeArrayResult(encodedMemberCards)
      memberCards.forEach((memberCard) => {
        const uqin = memberCard.troopuin + memberCard.memberuin
        if (troopMemberMap.has(uqin)) {
          Object.assign(troopMemberMap.get(uqin), {
            phone: memberCard.tel,
            email: memberCard.email
          })
        }
      })
    }

    const saveTroopMemberPre = saveTroopMember(null, true)

    const saveBatch = DB.getInstance().transaction((troopMemberMap) => {
      troopMemberMap.forEach((troopMember) => {
        saveTroopMemberPre.run(troopMember)
      })
    })

    saveBatch(troopMemberMap)
  }

  handleDiscussion() {
    if (!this.isExistTable('DiscussionInfo')) {
      return []
    }
    const encodedDiscussions = this._db
      .prepare('SELECT * FROM DiscussionInfo')
      .all()
    const discussions = this.decodeArrayResult(encodedDiscussions)
    const qqDiscussions = []
    discussions.forEach((discussion) => {
      qqDiscussions.push({
        userId: this._userId,
        uin: discussion.uin,
        name: discussion.discussionName,
        ownerUin: discussion.ownerUin,
        createTime: discussion.createTime * 1000
      })
    })

    const saveDiscussionPre = saveDiscussion(null, true)
    const saveBatch = DB.getInstance().transaction((discussions) => {
      for (const discussion of discussions) {
        Object.assign(discussion, {
          id: saveDiscussionPre.run(discussion).lastInsertRowid
        })
      }
    })

    saveBatch(qqDiscussions)
    return qqDiscussions
  }

  handleDiscussionMember(discussions) {
    if (!this.isExistTable('DiscussionMemberInfo')) {
      return
    }
    const discussionMap = new Map()
    discussions.forEach((discussion) => {
      discussionMap.set(discussion.uin, discussion)
    })

    const discussionMemberMap = new Map()

    const encodedMembers = this._db
      .prepare('select * from DiscussionMemberInfo')
      .all()
    const members = this.decodeArrayResult(encodedMembers)
    members.forEach((member) => {
      discussionMemberMap.set(member.discussionUin + member.memberUin, {
        userId: this._userId,
        discussionId: discussionMap.has(member.discussionUin)
          ? discussionMap.get(member.discussionUin).id
          : -1,
        discussionUin: member.discussionUin,
        memberUin: member.memberUin,
        remark: member.inteRemark
      })
    })

    const saveDiscussionMemberPre = saveDiscussionMember(null, true)

    const saveBatch = DB.getInstance().transaction((discussionMemberMap) => {
      discussionMemberMap.forEach((discussionMember) => {
        saveDiscussionMemberPre.run(discussionMember)
      })
    })

    saveBatch(discussionMemberMap)
  }

  handleTroopMessage(troops) {
    const tableNames = this._db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' and name like 'mr_troop_%' ORDER BY name"
      )
      .all()
    troops.forEach((troop) => {
      const saveTableName = `qqMsg_troop_${this._uin}_${troop.uin}`
      this.handleBaseMessage(troop, tableNames, saveTableName)
    })
  }

  handleFriendMessage(friends) {
    const tableNames = this._db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' and name like 'mr_friend_%' ORDER BY name"
      )
      .all()
    friends.forEach((friend) => {
      const saveTableName = `qqMsg_friend_${this._uin}_${friend.uin}`
      this.handleBaseMessage(friend, tableNames, saveTableName)
    })
  }

  handleDiscussionMessage(discussions) {
    const tableNames = this._db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' and name like 'mr_discussion_%' ORDER BY name"
      )
      .all()
    discussions.forEach((discussion) => {
      const saveTableName = `qqMsg_discussion_${this._uin}_${discussion.uin}`
      this.handleBaseMessage(discussion, tableNames, saveTableName)
    })
  }

  handleSystemMessage() {
    // 系统通知的uin为9987
    const tableNames = [
      { name: 'mr_friend_D4FCC05BD8205C41FBE4F2645BF0C6B8_New' }
    ]
    if (this.isExistTable('mr_friend_D4FCC05BD8205C41FBE4F2645BF0C6B8_New')) {
      const saveTableName = `qqMsg_friend_${this._uin}_9987`
      const friend = { uin: '9987', id: -1 }
      this.handleBaseMessage(friend, tableNames, saveTableName)
    }
  }

  handleBaseMessage(object, orgTableNames, destTableName) {
    const uinMd5 = md5(object.uin).toUpperCase()
    const index = orgTableNames.findIndex(
      (nameObj) => nameObj.name.indexOf(uinMd5) !== -1
    )
    if (index !== -1) {
      const orgTableName = orgTableNames[index].name
      const encodedMessages = this._db
        .prepare(`SELECT * FROM ${orgTableName}`)
        .all()
      const messages = this.decodeArrayResult(encodedMessages)
      createMsgTable(destTableName)
      const qqMessages = []
      messages.forEach((message) => {
        const msg = this.formatMessage(message.msgData, message.msgtype)
        qqMessages.push({
          userId: this._userId,
          friendId: object.id,
          friendUin: object.uin,
          senderUin: message.senderuin,
          isSend: message.issend,
          isTroop: message.istroop,
          isRead: message.isread,
          isValid: message.isValid,
          msgType: message.msgtype,
          msgData: message.msgData,
          time: message.time * 1000,
          showMessage: msg.showMessage,
          filePath: msg.filePath
        })
      })
      const saveMsgPre = saveMsg(null, destTableName, true)
      const saveBatch = DB.getInstance().transaction((msgs) => {
        for (const msg of msgs) {
          saveMsgPre.run(msg)
        }
      })
      saveBatch(qqMessages)
    }
  }

  async getUserAvatar(uin) {
    return null
  }

  async getTroopAvatar(uin) {
    return null
  }

  formatMessage(data, type) {
    const result = {
      showMessage: null,
      filePath: null
    }
    const rootPath = path.join(extractStorage.path, 'qq', 'file')
    if (data instanceof Buffer) {
      // 图片或音频
      if (type === -2000 || type === -2002) {
        const startIndex = data.indexOf(10)
        const endIndex = data.indexOf(16)
        const filePath = data.subarray(startIndex, endIndex).toString('utf8')
        // try {
        //   this.getMessageFile(filePath, destPath)
        // } catch (error) {
        //   console.debug(TAG, error)
        // }
        // 第二位为数字的没有缓存图片
        if ((data[1] >= 48 && data[1] <= 57) || data[1] === 42) {
          result.filePath = ''
        }
        result.showMessage = filePath
      } else if (type === -2005) {
        const startIndex = data.indexOf(47)
        const endIndex = data.indexOf(124)
        const filePath = data.subarray(startIndex, endIndex).toString('utf8')
        // this.getMessageFile(filePath, destPath)
      } else if (type === -5008) {
        const startIndex = data.indexOf(123)
        const endIndex = data.lastIndexOf(125)
        result.showMessage = data
          .subarray(startIndex, endIndex + 1)
          .toString('utf8')
      } else if (type === -5040) {
        const startIndex = data.indexOf(42)
        const colonEndIndex = data.indexOf(58)
        const endIndex = data.lastIndexOf(64)

        result.showMessage = data
          .subarray(
            startIndex + 2,
            colonEndIndex > 0 && colonEndIndex < endIndex
              ? colonEndIndex
              : endIndex
          )
          .toString('utf8')
      } else if (type === -2050 || type === -2059) {
        const str = Buffer.from(
          data.subarray(data.indexOf(12)).filter((item) => item != 0)
        ).toString('utf-8')
        let showMessage = ''
        for (let i = 0; i < str.length; i++) {
          const code = str[i].charCodeAt(0)
          if (
            (code >= 19968 && code <= 40869) ||
            /^[0-9a-zA-Z]+$/.test(str[i])
          ) {
            showMessage += str[i]
          } else {
            showMessage += ' '
          }
        }
        result.showMessage = showMessage
      } else {
        result.showMessage = data.toString('utf-8')
      }
    }
    return result
  }

  getMessageFile(orgPath, destPath) {
    mkdirp(path.dirname(destPath)).then(() => {
      Adb.getInstance()
        .pull(extractStorage.serial, orgPath)
        .then((transfer) => {
          return transferFile(transfer, destPath)
        })
    })
  }

  isExistTable(tableName) {
    const cntObj = this._db
      .prepare(
        "SELECT count(1) as cnt FROM sqlite_master WHERE type='table' and name = ?"
      )
      .get(tableName)
    return cntObj.cnt > 0
  }

  decodeObjectResult(objResult) {
    if (!objResult) {
      return null
    }
    const result = {}
    Object.keys(objResult).forEach((key) => {
      const item = objResult[key]
      if (item instanceof Uint8Array) {
        result[key] = this.decodeBlob(item)
      } else if (typeof item === 'string') {
        result[key] = this.decodeText(item)
      } else {
        result[key] = item
      }
    })
    return result
  }

  decodeArrayResult(arrResult) {
    if (!arrResult) {
      return null
    }
    const results = []
    arrResult.forEach((result) => {
      results.push(this.decodeObjectResult(result))
    })
    return results
  }

  decodeText(text, keyArray) {
    keyArray = keyArray || this._keyArray
    const plainText = new Array(text.length)
    for (let i = 0; i < text.length; i++) {
      plainText[i] = String.fromCharCode(
        text[i].charCodeAt(0) ^ keyArray[i % keyArray.length]
      )
    }
    return plainText.join('')
  }

  decodeBlob(blob, keyArray) {
    keyArray = keyArray || this._keyArray
    const plainText = new Uint8Array(blob.length)
    for (let i = 0; i < blob.length; i++) {
      plainText[i] = blob[i] ^ keyArray[i % keyArray.length]
    }
    return Buffer.from(plainText)
  }
}

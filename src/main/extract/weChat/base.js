import { save as saveUser } from '../../db/weChat/user'
import { save as saveContacts } from '../../db/weChat/contacts'
import { save as saveChatroom } from '../../db/weChat/chatroom'
import { save as saveMessage } from '../../db/weChat/message'
import Database from 'better-sqlite3'
import { Parser } from 'xml2js'
import path from 'path'
import mkdirp from 'mkdirp'
import cpFile from 'cp-file'
import md5 from 'md5'
import fs from 'fs'
import { extract as extractStorage } from '../../utils/storage'

export default class WeChatBase {
  constructor() {
    this._enDB = null
    this._filePath = null
  }
  async execExtract() {
    await mkdirp(path.join(extractStorage.path, 'weChat'))
    await this.saveAvatar()
    await this.saveImage()
    const userInfoResult = this._enDB.prepare('select * from userinfo').all()
    this.saveUser(userInfoResult)
    const contactResult = this._enDB
      .prepare('select * from rcontact where username !="" ')
      .all()
    this.saveContacts(contactResult)
    const chatroomResult = this._enDB.prepare('select * from chatroom').all()
    this.saveChatroom(chatroomResult)
    const messageResult = this._enDB.prepare('select * from message').all()
    this.saveMessage(messageResult)
  }

  _userId = ''
  _userType = {
    // 昵称
    4: 'nickname',
    // 微信ID
    2: 'name',
    // 微信号
    42: 'alias',
    // 国家
    12324: 'country',
    // 个性签名
    12291: 'signature',
    // 城市
    12292: 'city',
    // 省份
    12293: 'province',
    // 绑定的QQ
    9: 'qq',
    // 绑定的手机号码
    6: 'phone'
  }
  async saveAvatar() {
    await mkdirp(path.join(extractStorage.path, 'weChat', 'avatar'))
    let srcPath = path.join(this._filePath, 'avatar')
    let tarPath = path.join(extractStorage.path, 'weChat', 'avatar')
    await this.copyFolder(srcPath, tarPath)
  }
  async saveImage() {
    await mkdirp(path.join(extractStorage.path, 'weChat', 'image'))
    let srcPath = path.join(this._filePath, 'image2')
    let tarPath = path.join(extractStorage.path, 'weChat', 'image')
    if (fs.existsSync(srcPath)) {
      await this.copyFolder(srcPath, tarPath)
    }
  }
  async copyFolder(srcDir, tarDir) {
    let files = await fs.promises.readdir(srcDir)
    for (const file of files) {
      var srcPath = path.join(srcDir, file)
      var tarPath = path.join(tarDir, file)
      let states = await fs.promises.stat(srcPath)
      if (states.isDirectory()) {
        await mkdirp(tarPath)
        await this.copyFolder(srcPath, tarPath)
      } else {
        await cpFile(srcPath, tarPath)
      }
    }
  }

  saveUser(result) {
    const user = {
      extractId: extractStorage.id,
      nickname: '',
      name: '',
      alias: '',
      country: '',
      signature: '',
      city: '',
      province: '',
      qq: '',
      phone: ''
    }
    result.forEach((rs) => {
      if (this._userType[rs.id] !== undefined) {
        user[this._userType[rs.id]] = rs.value
      }
    })
    const md5Name = md5(user.name)
    let avatar = path.join(
      extractStorage.path,
      'weChat',
      'avatar',
      md5Name.substr(0, 2),
      md5Name.substr(2, 2),
      'user_' + md5Name + '.png'
    )
    Object.assign(user, { avatar: avatar })
    this._userId = saveUser(user).lastInsertRowid
  }

  saveContacts(result) {
    result.forEach((rs) => {
      let contacts = {
        username: rs.username,
        alias: rs.alias,
        nickname: rs.nickname,
        conRemark: rs.conRemark,
        userId: this._userId
      }
      switch (rs.type) {
        case 0:
          if (rs.username.substr(0, 2) === 'gh') {
            if (rs.username.substr(rs.username.length - 3) === 'app') {
              // 小程序
              Object.assign(contacts, { type: 4 })
            } else {
              // 公众号
              Object.assign(contacts, { type: 3 })
            }
          } else {
            return
          }
          break
        // 群聊中的非联系人
        case 4:
          Object.assign(contacts, { type: 1 })
          break
        // 系统功能
        case 33:
          Object.assign(contacts, { type: 5 })
          break
        // 群聊
        case 2:
          if (rs.username.substr(rs.username.length - 8) === 'chatroom') {
            Object.assign(contacts, { type: 2 })
          } else {
            return
          }
          break
        default:
          if (rs.username.substr(0, 2) === 'gh') {
            // 公众号
            Object.assign(contacts, { type: 3 })
          } else if (
            rs.username.substr(rs.username.length - 8) === 'chatroom'
          ) {
            // 加入通讯录中的群聊
            Object.assign(contacts, { type: 2 })
          } else {
            // 联系人
            Object.assign(contacts, { type: 0 })
          }
      }
      const md5Name = md5(contacts.username)
      let avatar = path.join(
        extractStorage.path,
        'weChat',
        'avatar',
        md5Name.substr(0, 2),
        md5Name.substr(2, 2),
        'user_' + md5Name + '.png'
      )
      Object.assign(contacts, { avatar: avatar })
      if (contacts.type === 4) {
        const imgFlag = this._enDB
          .prepare('select * from img_flag where username = @username')
          .get(contacts)
        if (imgFlag != null && imgFlag.reserved1) {
          contacts.avatar = imgFlag.reserved1
        } else {
          contacts.avatar = ''
        }
      }
      saveContacts(contacts)
    })
  }

  saveChatroom(result) {
    result.forEach((rs) => {
      let chatroom = {
        name: rs.chatroomname,
        roomOwner: rs.roomowner,
        selfDisplayName: rs.selfDisplayName,
        notice: rs.chatroomnotice,
        noticeEditor: rs.chatroomnoticeEditor,
        noticePublishTime: rs.chatroomnoticePublishTime,
        memberCount: rs.memberCount,
        userId: this._userId
      }
      const chatroomContact = this._enDB
        .prepare('select * from rcontact where username = @name')
        .get(chatroom)
      Object.assign(chatroom, { nickname: chatroomContact.nickname })
      let memberList = ''
      let members = rs.memberlist.split(';')
      members.forEach((member) => {
        memberList += member + ','
      })
      Object.assign(chatroom, {
        memberList: memberList.substr(0, memberList.length - 1)
      })
      let displayNameList = ''
      let displayNames = rs.displayname.split('、')
      displayNames.forEach((displayName) => {
        displayNameList += displayName + ','
      })
      Object.assign(chatroom, {
        displayNameList: displayNameList.substr(0, displayNameList.length - 1)
      })
      const md5Name = md5(chatroom.name)
      let avatar = path.join(
        extractStorage.path,
        'weChat',
        'avatar',
        md5Name.substr(0, 2),
        md5Name.substr(2, 2),
        'user_' + md5Name + '.png'
      )
      Object.assign(chatroom, { avatar: avatar })
      saveChatroom(chatroom)
    })
  }

  saveMessage(result) {
    result.forEach((rs) => {
      let message = {
        msgId: rs.msgId,
        type: rs.type,
        isSend: rs.isSend,
        createTime: rs.createTime,
        talker: rs.talker,
        content: rs.content,
        imgPath: rs.imgPath,
        userId: this._userId
      }
      if (message.imgPath) {
        if (
          message.type === 3 ||
          message.type === 1048625 ||
          message.type === 49
        ) {
          let code = message.imgPath.replace('THUMBNAIL_DIRPATH://th_', '')
          message.imgPath = path.join(
            extractStorage.path,
            'weChat',
            'image',
            code.substr(0, 2),
            code.substr(2, 2)
          )
          let codeJpg = path.join(message.imgPath, code + '.jpg')
          let thCodeHd = path.join(message.imgPath, 'th_' + code + 'hd')
          let thCode = path.join(message.imgPath, 'th_' + code)
          if (fs.existsSync(codeJpg)) {
            message.imgPath = codeJpg
          } else if (fs.existsSync(thCodeHd)) {
            message.imgPath = thCodeHd
          } else {
            message.imgPath = thCode
          }
        } else if (message.type === 47) {
          const emojiInfo = this._enDB
            .prepare('select * from EmojiInfo where md5 = @imgPath')
            .get(message)
          // 解决微信图片的防盗链
          if (emojiInfo != null && emojiInfo.cdnUrl) {
            message.imgPath = emojiInfo.cdnUrl.replace('mmbiz', 'emoji')
          } else {
            message.imgPath = ''
          }
        } else if (message.type === 43) {
          const videoInfo = this._enDB
            .prepare('select * from videoinfo2 where filename = @imgPath')
            .get(message)
          let index = message.content.indexOf(':')
          message.content =
            message.content.substring(0, index + 1) + videoInfo.videolength
          message.imgPath = ''
        } else if (message.type === 34) {
          const voiceInfo = this._enDB
            .prepare('select * from voiceinfo where Filename = @imgPath')
            .get(message)
          let index = message.content.indexOf(':')
          message.content =
            message.content.substring(0, index + 1) + voiceInfo.VoiceLength
          message.imgPath = ''
        }
      }
      saveMessage(message)
    })
  }

  async computeUins(keyData) {
    const parser = new Parser()
    const xml = await parser.parseStringPromise(keyData)
    const setList = xml['map']['set']
    let uinSet = null
    for (const set of setList) {
      if (set['$']['name'] === 'uin_set') {
        uinSet = set
      }
    }
    return uinSet['string']
  }

  async computePassword(dbFile, uin) {
    const keyArr = [`1234567890ABCDEF${uin}`]
    if (extractStorage.imei) {
      if (
        extractStorage.imei instanceof Array &&
        extractStorage.imei.length > 0
      ) {
        for (const subImei of extractStorage.imei) {
          keyArr.push(`${subImei}${uin}`)
        }
      } else {
        keyArr.push(`${extractStorage.imei}${uin}`)
      }
    }
    extractStorage.meid && keyArr.push(`${extractStorage.meid}${uin}`)

    const rkeyArr = keyArr.map((item) => md5(item).substr(0, 7))

    let realKey = ''
    try {
      realKey = this.migratePromise(dbFile, rkeyArr)
    } catch (error) {
      throw Error('compute password failed')
    }
    return realKey
  }

  migratePromise(dbFile, rkeyArr) {
    for (const key of rkeyArr) {
      const db = new Database(dbFile)
      try {
        db.pragma(` key = "${key}"`)
        db.pragma(' cipher_migrate ')
        db.prepare('SELECT count(1) as cnt FROM sqlite_master').all()
      } catch (error) {
        console.error(error)
        db.close()
        continue
      }
      db.close()
      return key
    }
    throw Error('no key')
  }
}

import { ipcMain } from 'electron'
import nodejieba from 'nodejieba'
import { getByUserIdAndContactsType, getByUserId } from '../db/weChat/message'
import {
  getMsgTableListByTableName,
  getMsgFriendsByUserIdAndTableName,
  getMsgByUserIdAndTableName
} from '../db/qq/msg'
import { getById as getQqUserById } from '../db/qq/user'

const wordcloud = (mainWindow) => {
  ipcMain.on('wordcloud:qq', (event, params) => {
    const messages = handleQqMessage(params)
    const wordMap = {}
    messages.forEach((message) => {
      let words = []
      try {
        words = nodejieba.cut(message.showMessage)
      } catch (error) {}

      words.forEach((word) => {
        wordMap[word] = wordMap[word] ? wordMap[word] + 1 : 1
      })
    })
    const wordList = []
    const size = Object.keys(wordMap).length
    Object.keys(wordMap).forEach((word) => {
      if (wordMap[word] > size / 400 && word.length > 1) {
        wordList.push({ name: word, value: wordMap[word] })
      }
    })
    event.reply('wordcloud:qq:reply', wordList)
  })

  ipcMain.on('wordcloud:weChat:talkers', (event, params) => {
    const talkers = getByUserIdAndContactsType(params)
    event.reply('wordcloud:weChat:talkers:reply', talkers)
  })

  ipcMain.on('wordcloud:qq:talkers', (event, params) => {
    let user = getQqUserById({ id: params.userId })
    let tableList = []
    if (params.type === 0) {
      tableList = getMsgTableListByTableName({
        name: 'qqMsg_friend_' + user.uin
      }).filter((item) => item.name !== 'qqMsg_friend_' + user.uin + '_9987')
    } else if (params.type === 1) {
      tableList = getMsgTableListByTableName({
        name: 'qqMsg_troop_' + user.uin
      })
    } else if (params.type === 2) {
      tableList = getMsgTableListByTableName({
        name: 'qqMsg_friend_' + user.uin + '_9987'
      })
    }
    let friends = []
    if (params.type === 0 || params.type === 1) {
      tableList.forEach((table) => {
        let obj = {
          userId: params.userId,
          firstTableName: table.name,
          secondTableName: params.type === 0 ? 'qqFriend' : 'qqTroop'
        }
        let friend = getMsgFriendsByUserIdAndTableName(obj)
        if (friend) {
          friends.push(friend)
        }
      })
    } else if (params.type === 2) {
      tableList.forEach((table) => {
        let obj = {
          tableName: table.name,
          userId: params.userId
        }
        let count = getMsgCountByUserIdAndTableName(obj).count
        if (count !== 0) {
          friends.push({ name: '9987', count: count, uin: '9987' })
        }
      })
    }
    event.reply('wordcloud:qq:talkers:reply', friends)
  })
}

function handleQqMessage(params) {
  let tableName
  let msgs = []
  if (params.type === 0 || params.type === 2) {
    tableName = 'qqMsg_friend_' + params.userUin + '_' + params.friendUin
    msgs = getMsgByUserIdAndTableName({
      userId: params.userId,
      tableName: tableName
    })
  }
  return msgs
}
export default wordcloud

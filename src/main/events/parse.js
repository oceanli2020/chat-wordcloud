import { ipcMain } from 'electron'
import WeChatXiaomi from '../parse/weChat/xiaomi'

const parse = (mainWindow) => {
  ipcMain.on('parse:data', (event, params) => {
    new WeChatXiaomi().execParse(params.path)
    event.reply('parse:data:reply', 'success')
  })
}
export default parse

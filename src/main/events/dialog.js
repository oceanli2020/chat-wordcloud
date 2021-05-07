import { ipcMain, dialog as elDialog } from 'electron'

const dialog = (mainWindow) => {
  ipcMain.on('dialog:folder:open', (event) => {
    const options = {
      properties: ['openDirectory']
    }
    elDialog.showOpenDialog(mainWindow, options).then((result) => {
      if (result.filePaths.length === 0) {
        result.filePaths.push('')
      }
      event.reply('dialog:folder:open:reply', result.filePaths)
    })
  })

  ipcMain.on('dialog:file:open', (event) => {
    const options = {
      properties: ['openFile']
    }
    elDialog.showOpenDialog(mainWindow, options).then((result) => {
      if (result.filePaths.length === 0) {
        result.filePaths.push('')
      }
      event.reply('dialog:file:open:reply', result.filePaths)
    })
  })
}
export default dialog

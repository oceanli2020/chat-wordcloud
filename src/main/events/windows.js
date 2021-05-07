import { ipcMain } from 'electron'

const window = mainWindow => {
  let isMax = false
  ipcMain.on('min', e => mainWindow.minimize())
  ipcMain.on('max', e => {
    if (isMax) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
    isMax = !isMax
  })
  ipcMain.on('close', e => mainWindow.close())
}
export default window

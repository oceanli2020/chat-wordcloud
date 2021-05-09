import { ipcMain } from 'electron'
import Extract from '../extract/index'

const extract = (mainWindow) => {

  ipcMain.on('extract:data', (event, params) => {
    Extract.extractData(params)
  })
}
export default extract

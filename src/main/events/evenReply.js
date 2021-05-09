let mainWin
const EventReply = (mainWindow) => {
  mainWin = mainWindow
}
export function sendStart(message, percentage) {
  mainWin.webContents.send('extract:progress', { message, percentage })
}
export function sendProcess(message, percentage) {
  mainWin.webContents.send('extract:progress', { message, percentage })
}
export function sendEnd(status, message, percentage) {
  mainWin.webContents.send('extract:progress', { status, message, percentage })
}

export default EventReply

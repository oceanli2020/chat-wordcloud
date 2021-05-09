import Adb from '../utils/adb'
import { ipcMain } from 'electron'

const device = (mainWindow) => {
  const client = Adb.getInstance()

  client
    .trackDevices()
    .then(function(tracker) {
      tracker.on('add', function(device) {
        console.log('Device %s was plugged in', device.id)
        mainWindow.webContents.send('device:change')
      })
      tracker.on('remove', function(device) {
        console.log('Device %s was unplugged', device.id)
        mainWindow.webContents.send('device:change')
      })
      tracker.on('end', function() {
        console.log('Tracking stopped')
      })
    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    })
  ipcMain.on('device:list', (event) => {
    client.listDevices().then((devices) => {
      const deviceInfos = []
      const promises = []
      if (devices.length === 0) {
        event.reply('device:list:reply', deviceInfos)
      }
      devices.forEach((device) => {
        deviceInfos.push({
          serial: device.id
        })
        promises.push(client.getProperties(device.id))
        Promise.all(promises).then((results) => {
          for (let index = 0; index < results.length; index++) {
            const result = results[index]
            Object.assign(deviceInfos[index], getDevice(result))
          }
          event.reply('device:list:reply', deviceInfos)
        })
      })
    })
  })
}
function getDevice(properties) {
  return {
    manufacturer: properties['ro.product.manufacturer'],
    model: properties['ro.product.model'],
    product: properties['ro.build.product'],
    os: properties['ro.build.version.release'],
    imei: properties['ro.ril.oem.imei'],
    imsi: properties['ril.slot0_imsi'],
    timezone: properties['persist.sys.timezone']
  }
}
export default device

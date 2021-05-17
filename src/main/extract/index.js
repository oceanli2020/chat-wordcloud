import WeChatXiaomi from './weChat/xiaomi'
import qqXiaomi from './qq/xiaomi'
import mkdirp from 'mkdirp'
import { extract as extractStorage } from '../utils/storage'

const extract = {
  extractData: async () => {
    await mkdirp(extractStorage.path)
    extractStorage.apps.forEach((app) => {
      appMap[app].execExtract()
    })
  }
}

const appMap = {
  weChat: weChatCreate(),
  qq: new qqXiaomi()
}
const deviceMap = {
  Xiaomi: qqCreate()
}
function weChatCreate() {
  switch (extractStorage.manufacturer) {
    case 'xiaomi':
      return new WeChatXiaomi()
  }
}
function qqCreate() {
  switch (extractStorage.manufacturer) {
    case 'xiaomi':
      return new qqXiaomi()
  }
}

export default extract

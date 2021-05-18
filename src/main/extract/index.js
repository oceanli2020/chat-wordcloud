import WeChatXiaomi from './weChat/xiaomi'
import qqXiaomi from './qq/xiaomi'
import mkdirp from 'mkdirp'
import { extract as extractStorage } from '../utils/storage'

const extract = {
  extractData: async () => {
    await mkdirp(extractStorage.path)
    extractStorage.apps.forEach((app) => {
      let item
      switch (app) {
        case 'weChat':
          switch (extractStorage.manufacturer) {
            case 'Xiaomi':
              item = new WeChatXiaomi()
          }
          break
        case 'qq':
          switch (extractStorage.manufacturer) {
            case 'Xiaomi':
              item = new qqXiaomi()
          }
          break
      }
      item.execExtract()
    })
  }
}

export default extract

import WeChatBase from './base'
import { sleep } from '../../utils/sleep'
import { sendProcess, sendEnd } from '../../events/evenReply'

export default class WeChatXiaomi extends WeChatBase {
  async execParse(file) {
    sendProcess('解压中...', 50)
    await sleep(2000)
    sendProcess('解析中...', 75)
    await sleep(2000)
    sendEnd('success', '已完成', 100)
  }
}

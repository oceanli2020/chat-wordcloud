<template>
  <div class="parse-prepare">
    <div class="form-block">
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="应用"
          ><el-radio v-model="form.app" label="weChat">微信</el-radio>
          <el-radio v-model="form.app" label="qq">QQ</el-radio></el-form-item
        >
        <el-form-item label="设备"
          ><el-select v-model="form.device" placeholder="请选择设备">
            <el-option
              v-for="(item, index) in deviceList"
              :key="index"
              :label="item.manufacturer + ' ' + item.model"
              :value="item"
            >
            </el-option> </el-select
        ></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="extractData" style="width: 200px;"
            >开始提取</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { sleep } from '../../utils/sleep'
export default {
  name: 'ExtractPrepare',
  data() {
    return {
      deviceList: [],
      appList: [{ name: '微信', vlaue: 'weChat' }],
      form: {
        app: 'weChat',
        device: ''
      }
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    ipcRenderer.removeAllListeners('device:change')
  },
  methods: {
    init() {
      this.getDeviceList()
      ipcRenderer.on('device:change', async (event, result) => {
        await sleep(200)
        this.getDeviceList()
      })
    },
    getDeviceList() {
      ipcRenderer.once('device:list:reply', (event, result) => {
        console.log(result)
        this.deviceList = result
        if (this.deviceList.length === 0) {
          this.form.device = ''
        } else {
          this.form.device = result[0]
        }
      })
      ipcRenderer.send('device:list')
    },
    extractData() {
      if (this.form.device) {
        this.$router.push({ name: 'ExtractProcess', query: this.form })
      }
    }
  }
}
</script>

<style scoped>
.form-block {
  height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-select >>> .el-input__inner {
  width: 200px;
}
</style>

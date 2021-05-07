<template>
  <div class="parse-process">
    <div class="parse-process-block">
      <div>
        <el-progress
          type="circle"
          :percentage="percentage"
          :width="250"
          :stroke-width="8"
        ></el-progress>
      </div>
      <div class="title">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'ParseProcess',
  data() {
    return {
      params: {
        path: '',
      },
      percentage: 0,
      message: ''
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    ipcRenderer.removeAllListeners('parse:progress')
  },
  methods: {
    init() {
      this.params = this.$route.query
      ipcRenderer.once('parse:data:reply', (event, result) => {
        console.log(result)
      })
      ipcRenderer.send('parse:data', this.params)
      ipcRenderer.on('parse:progress', (event, result) => {
        this.percentage = result.percentage
        this.message = result.message
      })
    }
  }
}
</script>
<style scoped>
.parse-process {
  text-align: center;
}
.parse-process-block {
  margin-top: 150px;
}
.title {
  color: #1890ff;
  margin-top: 10px;
  font-size: 18px;
}
</style>

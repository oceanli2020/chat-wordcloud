<template>
  <div class="extract-process">
    <div class="extract-process-block">
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px"
      top="30vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>备份文件解析完成</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$router.push('/extractData')"
          >继续解析其他备份文件</el-button
        >
        <el-button type="primary" @click="$router.push('/showData')"
          >查看数据</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('extract')
export default {
  name: 'ExtractProcess',
  data() {
    return {
      params: {},
      percentage: 0,
      message: '',
      dialogVisible: false
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    ipcRenderer.removeAllListeners('extract:progress')
  },
  methods: {
    init() {
      this.setIsExtracting(true)
      this.params = this.$route.query
      ipcRenderer.send('extract:data', this.params)
      ipcRenderer.on('extract:progress', (event, result) => {
        this.percentage = result.percentage
        this.message = result.message
        if (this.percentage === 100) {
          this.setIsExtracting(false)
          this.dialogVisible = true
        }
      })
    },
    ...mapActions(['setIsExtracting'])
  }
}
</script>
<style scoped>
.extract-process-block {
  height: calc(100vh - 250px);
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.title {
  color: #1890ff;
  margin-top: 10px;
  font-size: 18px;
}
</style>

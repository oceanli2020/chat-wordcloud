<template>
  <div class="parse-prepare">
    <div class="form-block">
      <el-form ref="form" :model="form" label-width="80px">
        <!-- <el-form-item label="机型"
          ><el-select v-model="form.device" placeholder="请选择机型">
            <el-option
              v-for="(item, index) in deviceList"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option> </el-select
        ></el-form-item> -->
        <el-form-item label="文件路径" prop="path">
          <el-input
            v-model="form.path"
            style="width:287px"
            :readonly="true"
          ></el-input>
          <el-button plain @click="getExportPath">浏览</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="parseData" style="width: 125px;"
            >解析备份文件</el-button
          >
          <el-button
            type="info"
            @click="reset"
            style="width: 76px;margin-left:82px"
            >重置</el-button
          ></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'ParsePrepare',
  data() {
    return {
      // deviceList: [{ name: 'XiaoMI MI6' }],
      // form: { device: '', path: '' }
      form: { path: '' }
    }
  },
  methods: {
    getExportPath() {
      ipcRenderer.once('dialog:file:open:reply', (event, result) => {
        if (result[0]) {
          this.form.path = result[0]
        }
      })
      ipcRenderer.send('dialog:file:open')
    },
    parseData() {
      this.$router.push({ name: 'ParseProcess' })
    },
    reset() {
      this.form = { path: '' }
    }
  }
}
</script>

<style scoped>
.form-block {
  height: calc(100vh - 250px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-select >>> .el-input__inner {
  width: 287px;
}
</style>

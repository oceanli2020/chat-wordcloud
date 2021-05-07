<template>
  <div class="title-bar">
    <div class="title">chat-wordcloud</div>
    <div class="window-button flex-center no-drag">
      <el-button
        plain
        size="mini"
        icon="el-icon-minus"
        @click="handleWindow('min')"
      ></el-button>
      <el-button
        plain
        size="mini"
        icon="el-icon-full-screen"
        @click="handleWindow('max')"
      ></el-button>
      <el-button
        plain
        size="mini"
        icon="el-icon-close"
        @click="handleWindow('close')"
      ></el-button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'TitleBar',
  data() {
    return {}
  },
  methods: {
    handleWindow(type) {
      ipcRenderer.send(type)
    }
  }
}
</script>

<style scoped>
.title-bar {
  -webkit-app-region: drag;
}
.window-button {
  position: absolute;
  right: 10px;
  top: 5px;
  font-size: 14px;
}
.flex-center {
  display: flex;
  align-items: center;
}
.title {
  display: flex;
  align-items: center;
  font-size: 18px;
  padding-left: 12px;
  height: 40px;
  color: #3d97eb;
}
.no-drag {
  -webkit-app-region: no-drag;
}
</style>

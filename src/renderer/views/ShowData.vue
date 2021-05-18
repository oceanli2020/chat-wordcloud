<template>
  <el-container class="show-data"
    ><el-aside width="300px" class="aside">
      <el-menu
        :default-active="defaultActive"
        @select="selectMenuItem"
        class="menu"
      >
        <el-scrollbar
          :style="{
            height: 'calc(100vh - 105px)'
          }"
        >
          <el-menu-item
            :index="talker.username"
            v-for="(talker, i) in talkers"
            :key="i"
          >
            <el-avatar :size="32" :src="talker.avatar" @error="true"
              ><img :src="defaultAvatarUrl"
            /></el-avatar>
            <span style="margin-left:5px;">{{
              (talker.conRemark ? talker.conRemark : talker.nickname) +
                '(' +
                talker.count +
                ')'
            }}</span>
          </el-menu-item>
        </el-scrollbar>
      </el-menu></el-aside
    >
    <el-main class="main"></el-main>
  </el-container>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'ShowData',
  data() {
    return {
      defaultActive: '',
      talkers: [],
      defaultAvatarUrl: require('../assets/avatar/people.png'),
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // ipcRenderer.once('show:weChat:message:talkers:reply', (event, result) => {
      //   this.talkers = result.talkers
      //   if (this.talkers.length > 0) {
      //     this.defaultActive = this.talkers[0].username
      //     this.selectMenuItem(this.talkers[0].username)
      //   }
      // })
      // ipcRenderer.send('show:weChat:message:talkers', talkerParams)
    },
    selectMenuItem(username) {
      console.log(username)
    }
  }
}
</script>

<style scoped>
.show-data {
  margin: 10px 10px 0px 10px;
}
.aside {
  margin: 0px 10px 0px 0px;
}
.el-menu {
  border-right: 0 !important;
}
.el-menu-item {
  height: 42px;
  line-height: 42px;
}
main {
  padding: 0px;
  background-color: #ffff;
  border: solid 1px #cccccc;
}
.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>

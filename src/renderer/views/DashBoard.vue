<template>
  <div>
    <TitleBar />
    <el-menu
      mode="horizontal"
      :default-active="activeIndex"
      @select="handleSelect"
      ><el-menu-item
        :index="index.toString()"
        v-for="(item, index) in menuItemList"
        :key="index"
        :disabled="menuDisabled"
        >{{ item }}</el-menu-item
      ></el-menu
    >
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import TitleBar from '../components/TitleBar'
export default {
  name: 'DashBoard',
  components: {
    TitleBar
  },
  data() {
    return {
      menuDisabled: false,
      activeIndex: '1',
      menuItemList: ['文件解析', '数据展示', '词云'],
      menuRouterMap: {
        0: '/parseData',
        1: '/showData',
        2: '/wordCloud'
      }
    }
  },
  methods: {
    handleSelect(key) {
      this.$router.push(this.menuRouterMap[key])
    }
  }
}
</script>

<style scoped>
.el-menu-item {
  height: 45px;
  line-height: 45px;
}
</style>

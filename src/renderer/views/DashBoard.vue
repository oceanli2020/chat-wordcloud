<template>
  <div>
    <TitleBar />
    <el-menu
      ref="menu"
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
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('extract')
export default {
  name: 'DashBoard',
  components: {
    TitleBar
  },
  data() {
    return {
      menuDisabled: false,
      activeIndex: '1',
      menuItemList: ['数据提取', '数据展示', '词云'],
      menuRouterMap: {
        '0': '/extractData',
        '1': '/showData',
        '2': '/wordCloud'
      },
      routerMenuMap: {
        '/extractData': '0',
        '/showData': '1',
        '/wordCloud': '2'
      }
    }
  },
  computed: {
    ...mapState({
      isExtracting: (state) => state.isExtracting
    })
  },
  watch: {
    isExtracting: function(newVal, oldVal) {
      this.menuDisabled = newVal
    },
    $route: {
      handler: function(newVal, oldVal) {
        this.$refs.menu.activeIndex = this.routerMenuMap[newVal.path]
      },
      // 深度观察监听
      deep: true
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

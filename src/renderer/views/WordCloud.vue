<template>
  <el-container class="word-cloud">
    <el-aside width="150px" class="aside">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group>
      <el-menu
        :default-active="defaultActive"
        @select="selectMenuItem"
        class="menu"
        :collapse="isCollapse"
      >
        <el-scrollbar
          :style="{
            height: 'calc(100vh - 105px)'
          }"
        >
          <!-- <el-menu-item
            :index="item.toString()"
            v-for="(item, index) in list"
            :key="index"
            style="padding-left: 5px;"
          >
            <template slot="title">
              <el-avatar :size="32" :src="''" @error="true"
                ><img :src="defaultAvatarUrl"
              /></el-avatar>
              <span slot="title">{{ item }}</span>
            </template>
          </el-menu-item> -->
          <el-submenu index="1">
            <template slot="title">
              <el-avatar :size="32" :src="''" @error="true"
                ><img :src="defaultAvatarUrl"
              /></el-avatar>
            </template>
            <el-menu-item-group>
              <span slot="title">分组一</span>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-scrollbar></el-menu
      >
    </el-aside>
    <!-- <el-main class="main"> -->
    <!-- <div ref="echartCloud" class="echarts"></div> -->
    <!-- </el-main> -->
  </el-container>
</template>
<script>
import { ipcRenderer } from 'electron'
import Echarts from 'echarts'
import 'echarts-wordcloud'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('show')
export default {
  name: 'WordCloud',
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6],
      myChartCloud: {},
      wordList: [{ name: '123', value: 2 }],
      defaultAvatarUrl: require('../assets/avatar/people.png'),
      isCollapse: true,
      defaultActive: '1'
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState({
      talker: (state) => state.talker
    })
  },
  methods: {
    init() {
      // this.wordCloud()
      // const params = {
      //   userId: 1,
      //   type: 1,
      //   talker: this.talker
      // }
      // ipcRenderer.once('analysis:weChat:message:reply', (event, result) => {
      //   this.wordList = []
      //   this.wordList = result
      //   this.wordCloud()
      //   // console.log(result)
      // })
      // ipcRenderer.send('analysis:weChat:message', params)
    },
    selectMenuItem() {},
    wordCloud() {
      let that = this
      let option = {
        title: {
          text: '',
          x: 'center',
          textStyle: {
            fontSize: 23
          }
        },
        // 背景颜色
        backgroundColor: '#fff',
        // 是否显示数据提示
        tooltip: {
          show: true
        },
        series: [
          {
            name: '', // 数据提示窗标题
            type: 'wordCloud',
            gridSize: 15, // 单词之间的间隔大小
            drawOutOfBound: false, //设置为true以允许部分在画布外部绘制单词
            sizeRange: [12, 60], // 最小字体和最大字体
            rotationRange: [0, 0], // 字体旋转角度的范围
            // triangle三角形，pentagon五角形，star五角星形,circle圆形
            shape: 'circle', // cardioid心形,diamond菱形,square正方形,triangle-forward指向右边的三角形,triangle-upright正三角形
            //跟随左/上/下/宽/高/右/下的位置来定位词云
            //默认放置在中间尺寸为75％x 80％，
            left: 'center',
            top: 'center',
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,
            layoutAnimation: true,
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6
            },
            textStyle: {
              // 词云的字体样式与echarts其他的图表设置字体样式类似
              normal: {
                // 随机生成每个单词的颜色
                color: function() {
                  return (
                    'rgb(' +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160)
                    ].join(',') +
                    ')'
                  )
                }
              },
              // 鼠标光标移动到时的阴影
              emphasis: {
                shadowBlur: 1,
                shadowColor: '#333'
              }
            },
            data: this.wordList
          }
        ]
      }
      this.myChartCloud = Echarts.init(that.$refs.echartCloud)
      this.myChartCloud.setOption(option, true)
    }
  }
}
</script>

<style scoped>
.word-cloud {
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
  padding: 0px;
  padding-left: 0px;
}

.main {
  padding: 0px;
  text-align: center;
  border: 1px solid #cccccc;
}
.echarts {
  width: 100%;
  height: 100%;
}
.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100px;
  min-height: 400px;
}
</style>

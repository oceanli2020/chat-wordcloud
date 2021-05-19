<template>
  <el-container class="word-cloud">
    <el-aside width="200px" class="aside">
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
            :index="friend.uin"
            v-for="(friend, i) in friends"
            :key="i"
            style="padding-left: 5px;"
          >
            <template slot="title">
              <el-avatar :size="32" :src="friend.avatar" @error="true"
                ><img :src="defaultAvatarUrl"
              /></el-avatar>
              <span style="margin-left:5px;">{{
                friend.conRemark ? friend.conRemark : friend.nickname
              }}</span>
            </template>
          </el-menu-item>
        </el-scrollbar></el-menu
      >
    </el-aside>
    <el-main class="main">
      <div ref="echartCloud" class="echarts"></div>
    </el-main>
  </el-container>
</template>
<script>
import { ipcRenderer } from 'electron'
import Echarts from 'echarts'
import 'echarts-wordcloud'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('show')
export default {
  name: 'Wordcloud',
  data() {
    return {
      friends: [],
      myChartCloud: {},
      wordList: [],
      defaultAvatarUrl: require('../assets/avatar/people.png'),
      defaultActive: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // const params = {
      //   userId: 2,
      //   contactsType: 0 //0为好友，3为公众号，2为群聊
      // }
      const params = {
        userId: 1,
        type: 0
      }
      ipcRenderer.once('wordcloud:qq:talkers:reply', (event, result) => {
        this.friends = result
        if (this.friends.length > 0) {
          this.$nextTick(() => {
            this.defaultActive = this.friends[0].uin
          })
          this.selectMenuItem(this.friends[0].uin)
        } else {
          this.defaultActive = ''
        }
      })
      ipcRenderer.send('wordcloud:qq:talkers', params)
    },
    selectMenuItem(uin) {
      const params = {
        userId: 1,
        friendUin: uin,
        userUin: 1028771242,
        type: 0
      }
      ipcRenderer.once('wordcloud:qq:reply', (event, result) => {
        this.wordList = []
        this.wordList = result
        this.getWordcloud()
      })
      ipcRenderer.send('wordcloud:qq', params)
    },
    getWordcloud() {
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
            gridSize: 12, // 单词之间的间隔大小
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
  margin: 0px 5px 0px 0px;
}
.el-menu {
  border-right: 0 !important;
}
.el-menu-item {
  height: 42px;
  line-height: 42px;
  padding: 0px;
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
</style>

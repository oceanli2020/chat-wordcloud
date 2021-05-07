<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'chat-wordcloud'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
img {
  /* 禁止图片拖拽 */
  -webkit-user-drag: none;
}
</style>

<template>
  <div class="home">
    <div class="home-block">
      <div>
        <span class="title">hello! ocean li</span>
      </div>
      <div class="start">
        <el-link style="font-size:20px;" type="primary" @click="start"
          >start</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import TitleBar from '../components/TitleBar'
export default {
  name: 'HomePage',
  components: {
    TitleBar
  },
  data() {
    return {}
  },
  methods: {
    start() {
      this.$router.push('/dashBoard')
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}
.home-block{
  margin-top: 270px;
}
.title {
  font-size: 30px;
}
.start {
  margin-top: 10px;
}
</style>

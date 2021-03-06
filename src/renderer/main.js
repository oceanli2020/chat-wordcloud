import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui' // element
import 'element-ui/lib/theme-chalk/index.css' // element
import App from './App'
import router from './router'
import store from './store'
import '@/icons'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI) // element
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

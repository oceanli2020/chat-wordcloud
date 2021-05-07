import Vue from 'vue'
import Router from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/dashBoard',
      name: 'DashBoard',
      component: () => import('../views/DashBoard.vue'),
      redirect: '/showData',
      children: [
        {
          path: '/parseData',
          name: 'ParseData',
          component: () => import('../views/ParseData.vue'),
          redirect: '/parsePrepare',
          children: [
            {
              path: '/parsePrepare',
              name: 'ParsePrepare',
              component: () => import('../views/Parse/ParsePrepare.vue')
            },
            {
              path: '/parseProcess',
              name: 'ParseProcess',
              component: () => import('../views/Parse/ParseProcess.vue')
            }
          ]
        },
        {
          path: '/showData',
          name: 'ShowData',
          component: () => import('../views/ShowData.vue')
        },
        {
          path: '/wordCloud',
          name: 'WordCloud',
          component: () => import('../views/WordCloud.vue')
        }
      ]
    }
  ]
})

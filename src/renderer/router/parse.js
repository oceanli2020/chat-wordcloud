const routes = [
  {
    path: '',
    name: 'ParsePrepare',
    component: () => import('../views/Parse/ParsePrepare.vue')
  },
  {
    path: '/parseProcess',
    name: 'ParseProcess',
    component: () => import('../views/Parse/ParseProcess.vue')
  }
]

export default routes

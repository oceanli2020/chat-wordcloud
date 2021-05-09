const routes = [
  {
    path: '',
    name: 'ExtractPrepare',
    component: () => import('../views/extract/ExtractPrepare.vue')
  },
  {
    path: '/extractProcess',
    name: 'ExtractProcess',
    component: () => import('../views/extract/ExtractProcess.vue')
  }
]

export default routes

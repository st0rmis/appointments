import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import guest from '@/router/middleware/guest-middleware'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/ViewHome.vue'),
    },
    ...routes,
    {
      path: '*',
      name: 'Error404',
      component: () => import('@/views/error/Error404.vue')
    }
  ]
})

export default router

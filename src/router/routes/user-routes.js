import auth from '@/router/middleware/auth-middleware'

export default [
  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('@/views/user/UserProfile.vue'),
    beforeEnter: auth
  },
  {
    path: '/user/list',
    name: 'users',
    component: () => import('@/views/user/UserList.vue'),
    beforeEnter: auth
  }
]

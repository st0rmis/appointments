import guest from '@/router/middleware/guest-middleware'

export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/auth/AuthLogin.vue'),
    beforeEnter: guest,
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/views/auth/AuthRegister.vue'),
    beforeEnter: guest,
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/auth/reset-password',
    name: 'passwordReset',
    component: () => import('@/views/auth/AuthPasswordReset.vue'),
    beforeEnter: guest,
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/auth/forgot-password',
    name: 'passwordForgot',
    component: () => import('@/views/auth/AuthPasswordForgot.vue'),
    beforeEnter: guest,
    meta: {
      layout: 'default'
    }
  }
]

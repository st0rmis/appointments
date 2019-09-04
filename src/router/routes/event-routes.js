import auth from '@/router/middleware/auth-middleware'
import multiguard from 'vue-router-multiguard'

export default [
  {
    path: '/event/create',
    name: 'event.create',
    component: () => import('@/views/event/EventCreate.vue'),
    beforeEnter: multiguard([auth])
  },
  {
    path: '/event/update/:id',
    name: 'event.update',
    component: () => import('@/views/event/EventUpdate.vue'),
    beforeEnter: multiguard([auth])
  },
  {
    path: '/event/list',
    name: 'events',
    component: () => import('@/views/event/EventList.vue'),
    beforeEnter: multiguard([auth])
  }
]

import store from '@/store/'

export default async function guest (to, from, next) {
  await store.dispatch('auth/initAuth')
    .then((user) => {
      if (user) {
        return next({ name: 'home' })
      }
    })

  return next()
}

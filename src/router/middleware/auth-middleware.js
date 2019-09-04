import store from '@/store/'

export default async function auth (to, from, next) {
  await store.dispatch('auth/initAuth')
    .then((user) => {
      if (!user) {
        return next({ name: 'login' })
      }
    })

  return next()
}

import { db } from '@/plugins/firebase'

export default {
  getUser (id) {
    return new Promise((resolve) => {
      db.collection('users').doc(id).get()
        .then((user) => {
          if (user.exists) {
            resolve(user.data())
          } else {
            resolve(null)
          }
        })
    })
  },

  getUsers () {
    return new Promise((resolve) => {
      db.collection('users').get()
        .then((users) => {
          resolve(users)
        })
    })
  },

  createUser (id, email, name) {
    return new Promise((resolve) => {
      const createdAt = Math.floor(Date.now() / 1000)
      email = email.toLowerCase()
      const user = { id, email, name, createdAt }

      db.collection('users').doc(id).set(user)
      resolve(user)
    })
  },

  updateUser (id, role) {
    return new Promise((resolve) => {
      const item = { role }

      db.collection('users').doc(id).update(item)
      resolve(item)
    })
  },

  updateUserProfile (id, name) {
    return new Promise((resolve) => {
      const item = { name }

      db.collection('users').doc(id).update(item)
      resolve(item)
    })
  }
}

import { db } from '@/plugins/firebase'

export default {
  getEvent (id) {
    return new Promise((resolve) => {
      db.collection('events').doc(id).get()
        .then((event) => {
          if (event.exists) {
            resolve(event.data())
          } else {
            resolve(null)
          }
        })
    })
  },

  getUserEvents (userId) {
    return new Promise((resolve) => {
      let eventsRef = db.collection('events')

      eventsRef.where('userId', '==', userId).get()
        .then((events) => {
          resolve(events)
        })
    })
  },

  getEvents () {
    return new Promise((resolve) => {
      db.collection('events').orderBy('createdAt', 'desc').get()
        .then((events) => {
          resolve(events)
        })
    })
  },

  createEvent (name, type, location, imageUrl, description, userId, date, time_from, time_to, limit) {
    return new Promise((resolve) => {
      const createdAt = Math.floor(Date.now() / 1000)

      console.log(description, imageUrl)
      const event = { name, userId, createdAt, type, location, imageUrl, description, date, time_from, time_to, limit, eventRegistered: [] }
      console.log(event)

      db.collection('events').doc().set(event)
      resolve(event)
    })
  },

  updateEvent (id, payload) {
    return new Promise((resolve) => {
      const event = payload

      db.collection('events').doc(id).update(event)
      resolve(event)
    })
  },

  unregister (eventId, userId) {
    return new Promise((resolve) => {
      db.collection('events').doc(eventId).get()
        .then((event) => {
          if (event.exists) {
            let eventRegistered = event.data().eventRegistered

            if (eventRegistered) {
              if (eventRegistered.includes(userId)) {
                let index = eventRegistered.indexOf(userId)
                eventRegistered.splice(index, 1)
              }
            }

            const update = { eventRegistered }
            db.collection('events').doc(eventId).update(update)
          }
          resolve(event)
        })
    })
  },

  register (eventId, userId) {
    return new Promise((resolve) => {
      db.collection('events').doc(eventId).get()
        .then((event) => {
          if (event.exists) {
            let eventRegistered = event.data().eventRegistered

            if (!eventRegistered) {
              eventRegistered = []
              eventRegistered.push(userId)
            } else {
              if (!eventRegistered.includes(userId)) {
                eventRegistered.push(userId)
              }
            }

            const update = { eventRegistered }
            db.collection('events').doc(eventId).update(update)
          }
          resolve(event)
        })
    })
  },

  deleteEvent (id) {
    return new Promise((resolve) => {
      db.collection('events').doc(id).delete()
      resolve(true)
    })
  }
}

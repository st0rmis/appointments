import eventService from '@/services/event-service'
import authService from '@/services/auth-service'

export default {
  namespaced: true,

  state: {
    loading: false,
    list: [],
    event: null
  },

  getters: {
    loading: state => state.loading,
    list: (state) => state.list,
    event: (state) => state.event
  },

  actions: {
    getUserEvents ({ commit }) {
      commit('setList', [])
      commit('setLoading', true)

      let userId = authService.authUserId()

      eventService.getUserEvents(userId)
        .then((events) => {
          let eventData = []
          events.forEach((event) => {
            let item = {
              id: event.id,
              ...event.data()
            }

            eventData.push(item)
          })

          commit('setList', eventData)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },

    getEvent ({ commit }, id) {
      eventService.getEvent(id)
        .then((res) => {
          commit('setEvent', res)
        })
    },

    register ({ commit }, { eventId, userId }) {
      return eventService.register(eventId, userId)
    },

    unregister ({ commit }, { eventId, userId }) {
      return eventService.unregister(eventId, userId)
    },

    getAllEvents ({ commit }) {
      commit('setList', [])
      commit('setLoading', true)

      eventService.getEvents()
        .then((events) => {
          let eventData = []
          events.forEach((event) => {
            let item = {
              id: event.id,
              ...event.data()
            }

            eventData.push(item)
          })

          commit('setList', eventData)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },

    createEvent ({ commit }, { name, type, location, imageUrl, description, date, time_from, time_to, limit }) {
      commit('setLoading', true)

      console.log('deskas-', description, 'uras-', imageUrl)
      let userId = authService.authUserId()
      eventService.createEvent(name, type, location, imageUrl, description, userId, date, time_from, time_to, limit)
        .finally(() => {
          commit('setLoading', false)
        })
    },

    updateEvent ({ commit }, { id, payload }) {
      commit('setLoading', true)

      eventService.updateEvent(id, payload)
        .finally(() => {
          commit('setLoading', false)
        })
    },

    deleteEvent ({ commit }, { id }) {
      eventService.deleteEvent(id)
    },

    clear ({ commit }) {
      commit('clear')
    }
  },

  mutations: {
    setEvent (state, payload) {
      state.event = payload
    },
    setLoading (state, payload) {
      state.loading = !!payload
    },

    setList (state, payload) {
      state.list = payload || []
    },

    clear (state) {
      state.loading = false
      state.list = []
    }
  }
}

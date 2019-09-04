import userService from '@/services/user-service'

export default {
  namespaced: true,

  state: {
    loading: false,
    list: []
  },

  getters: {
    loading: state => state.loading,
    list: (state) => state.list
  },

  actions: {
    getAllUsers ({ commit }) {
      commit('setList', [])
      commit('setLoading', true)

      userService.getUsers()
        .then((users) => {
          let userData = []
          users.forEach((user) => {
            userData.push(user.data())
          })

          commit('setList', userData)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },

    createUser ({ commit }, { id, email, name }) {
      commit('setLoading', true)

      userService.createUser(id, email, name)
        .finally(() => {
          commit('setLoading', false)
        })
    },

    updateUser ({ commit }, { id, role }) {
      commit('setLoading', true)

      userService.updateUser(id, role)
        .finally(() => {
          commit('setLoading', false)
        })
    },

    updateUserProfile ({ commit }, { id, name }) {
      commit('setLoading', true)

      userService.updateUserProfile(id, name)
        .finally(() => {
          commit('setLoading', false)
        })
    },

    clear ({ commit }) {
      commit('clear')
    }
  },

  mutations: {
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

import authService from '@/services/auth-service'
import userService from '@/services/user-service'

export default {
  namespaced: true,

  state: {
    loading: false,
    authUser: null,
    unsubscribeAuthObserver: null
  },

  getters: {
    loading: state => state.loading,
    authId: state => state.authId,
    authUser: state => state.authUser
  },

  actions: {
    logout ({ commit }) {
      authService.logout()
        .then(() => {
          commit('setAuthUser', null)
        })
    },

    initAuth ({ dispatch, commit, state }) {
      return new Promise((resolve) => {
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }

        const unsubscribe = authService.onAuthStateChanged((authUser) => {
          if (authUser) {
            dispatch('getAuthUser')
              .then((user) => {
                resolve(user)
              })
          } else {
            resolve(null)
          }
        })

        commit('setUnsubscribeAuthObserver', unsubscribe)
      })
    },

    login ({ commit }, { email, password }) {
      commit('setLoading', true)

      return authService.login(email, password)
        .finally(() => {
          commit('setLoading', false)
        })
    },

    register ({ commit, dispatch }, { email, name, password }) {
      commit('setLoading', true)

      return authService.register(email, password)
        .then((authUser) => {
          return dispatch('user/createUser', { id: authUser.user.uid, email, name, password }, { root: true })
        })
        .then(() => {
          dispatch('getAuthUser')
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },

    getAuthUser ({ commit }) {
      const authUserId = authService.authUserId()

      return userService.getUser(authUserId)
        .then((user) => {
          commit('setAuthUser', user)
          return user
        })
    },

    sendPasswordResetLink ({ commit }, { email }) {
      commit('setLoading', true)
      return authService.sendPasswordResetEmail(email)
        .finally(() => {
          commit('setLoading', false)
        })
    },

    confirmNewPassword ({ commit }, { code, password }) {
      commit('setLoading', true)
      return authService.confirmNewPassword(code, password)
        .finally(() => {
          commit('setLoading', false)
        })
    }
  },

  mutations: {
    setLoading (state, payload) {
      state.loading = !!payload
    },

    setAuthUser (state, payload) {
      state.authUser = payload
    },

    setUnsubscribeAuthObserver (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  }
}

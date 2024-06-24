import $axios from '../utils/fetchData.js'

export const useSessionStore = defineStore('sessionStore', {
  state: () => {
    return {
      user: {},
    }
  },
  getters: {
    getUser: (state) => {
      return state.user
    },
    getLoggedInStatus: (state) => {
      return !!localStorage.getItem('access_token')
    },
  },
  actions: {
    async login(payload) {
      const url = `/login/`
      try {
        const { data, status } = await $axios.post(url, payload)
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)

        // Busca datos de usuario logeado
        const res = await $axios.get(`/user/?email=${payload.email}`)
        if(res) {
          localStorage.setItem('userData', JSON.stringify(res.data[0]))
        }

        return status
      } catch (error) {
        return error.response.status
      }
    },
    async sendCodeToEmail(email) {
      try {
        await $axios.post('password_reset/', { email })
      } catch (error) {
        return error
      }
    },
    async sendCodeToBeValidated({ code }) {
      try {
        await $axios.post('password_reset/validate_token/', { token: code })
      } catch (error) {
        return error
      }
    },
    async sendNewPassword({ code, newPassword }) {
      try {
        await $axios.post('password_reset/confirm/', {
          token: code,
          password: newPassword,
        })
      } catch (error) {
        return error
      }
    },
    async logout() {
      localStorage.clear()
    },
  },
})

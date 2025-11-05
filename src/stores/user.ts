import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export interface AuthUser {
  id: string
  name: string
  token: string
}

interface UserState {
  user: AuthUser | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user?.token)
  },
  actions: {
    login(token: string, name = 'Admin', id = '1') {
      this.user = { token, name, id }
      Cookies.set('auth_token', token, { expires: 7, path: '/' })
    },
    loadFromStorage() {
      const token = Cookies.get('auth_token')
      if (token) this.user = { token, name: 'Admin', id: '1' }
    },
    logout() {
      this.user = null
      Cookies.remove('auth_token', { path: '/' })
    }
  }
})



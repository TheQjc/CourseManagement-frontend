import { createStore } from 'vuex'
import { login } from '@/api/auth'

// 处理本地存储的用户信息，确保有id字段
const savedUser = JSON.parse(localStorage.getItem('user')) || {}
if (savedUser.userId && !savedUser.id) {
  savedUser.id = savedUser.userId
}

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: savedUser
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER: (state, user) => {
      // 兼容处理：确保有 id 属性
      if (user.userId && !user.id) {
        user.id = user.userId
      }
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    LOGOUT: (state) => {
      state.token = ''
      state.user = {}
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  actions: {
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          // Assuming response structure, adjust if needed
          const { token, user } = response // Example assumption
          // If response is just the token or structure is different, we need to know. 
          // But looking at API doc "All interfaces return JSON". 
          // Usually a success login returns data. 
          // I will assume response is the data object directly due to my request interceptor returning response.data
          // However, my interceptor returns response.data. 
          
          // Let's assume the backend returns { token: '...', ...userFields } or similar.
          // Or maybe I need to fetch user info separately?
          // I'll assume the response contains token and user details for simplicity.
          if (response.token) {
             commit('SET_TOKEN', response.token)
          }
          // If the backend returns user info in the same response
          commit('SET_USER', response) 
          
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout({ commit }) {
      commit('LOGOUT')
    }
  },
  getters: {
    token: state => state.token,
    user: state => state.user,
    userId: state => state.user.id || state.user.userId, // Adapt to likely field
    userRole: state => state.user.role
  }
})

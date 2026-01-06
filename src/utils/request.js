import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'

// Create axios instance
const service = axios.create({
  baseURL: '/api', // Proxy target defined in vite.config.js
  timeout: 5000
})

// Request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + store.getters.token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('请求错误:', error)
    let message = '请求失败'
    if (error.response) {
      // 服务器返回了错误响应
      message = error.response.data?.message || error.response.statusText || '服务器错误'
      if (error.response.status === 401) {
        message = '未授权，请重新登录'
        store.dispatch('logout')
      } else if (error.response.status === 403) {
        message = '没有权限访问'
      } else if (error.response.status === 404) {
        message = '请求的资源不存在'
      } else if (error.response.status === 500) {
        message = error.response.data?.message || '服务器内部错误'
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message = '网络连接失败，请检查后端服务是否启动'
    } else {
      // 请求配置出错
      message = error.message
    }
    
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { useUserStore } from '@/stores/user'

const baseURL = '/api'

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userStore = useUserStore()
  if (userStore?.user?.token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${userStore.user.token}`
  }
  return config
})

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default http

export const get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  http.get<T>(url, config)
export const post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  http.post<T>(url, data, config)

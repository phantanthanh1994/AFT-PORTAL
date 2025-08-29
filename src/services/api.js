// src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/api'

// 👉 Helpers để dễ thay đổi về sau (localStorage ⇄ cookie)
const TOKEN_KEY = 'token'
export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    // Bật nếu dùng cookie (Sanctum) ở môi trường domain cùng gốc
    // withCredentials: true,
    timeout: 20000,
})

// Request interceptor
api.interceptors.request.use(config => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`

    // Đừng đặt Content-Type cố định: để axios tự set cho FormData
    // Nếu bạn chắc chắn JSON:
    // if (!(config.data instanceof FormData)) {
    //   config.headers['Content-Type'] = 'application/json'
    // }

    return config
})

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
      const status = error?.response?.status

      // 401: token hết hạn/không hợp lệ
      if (status === 401) {
        setToken(null)
        // Optional: điều hướng về trang đăng nhập
        // window.location.href = '/account/signin'
      }

      // 419: CSRF hết hạn (nếu dùng cookie + Sanctum)
      // if (status === 419) location.reload()

      // 422: để nguyên cho caller hiển thị lỗi field
      return Promise.reject(error)
    }
)

export default api

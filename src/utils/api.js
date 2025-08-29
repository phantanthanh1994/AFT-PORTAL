import { ofetch } from 'ofetch'

const isClient = typeof window !== 'undefined'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/api',
  
  // Request interceptor
  async onRequest({ options }) {
    // Set default headers
    options.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
    
    // Add authorization token
    if (isClient) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        options.headers.Authorization = `Bearer ${token}`
      }
    }
  },
  
  // Response interceptor để handle lỗi
  async onResponseError({ response }) {
    if (response.status === 401) {
      // Token expired hoặc invalid
      if (process.client) {
        localStorage.removeItem('accessToken')
        // Redirect to login nếu cần
        // navigateTo('/account/signin')
      }
    }
    
    // Re-throw error để component có thể handle
    throw response._data || response
  }
})
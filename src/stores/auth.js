// stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        initialized: false
    }),
    
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    
    actions: {
        async getUser() {
            if (!this.token) {
                this.user = null;
                throw new Error('No token available');
            }
            
            try {
                this.loading = true;
                const response = await api.get('/profile');
                this.user = response.data;
                return response.data;
            } catch (error) {
                // Token invalid
                this.clearAuth();
                throw error;
            } finally {
                this.loading = false;
            }
        },
        
        async login(credentials) {
            try {
                this.loading = true;
                const response = await api.post('/login', credentials);
                
                this.token = response.data.token;
                this.user = response.data.user;
                
                localStorage.setItem('token', this.token);
                
                return response.data;
            } catch (error) {
                this.clearAuth();
                throw error;
            } finally {
                this.loading = false;
            }
        },
        
        async logout() {
            try {
                if (this.token) {
                    await api.post('/logout');
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.clearAuth();
            }
        },
        
        async register(payload) {
            try {
                this.loading = true;
                const response = await api.post('/register', payload);
                
                // Tự động đăng nhập sau khi đăng ký thành công
//                if (response.data.token) {
//                    this.token = response.data.token;
//                    this.user = response.data.user;
//                    localStorage.setItem('token', this.token);
//                }
                
                return response.data;
            } catch (error) {
                // Xử lý lỗi validation từ backend
                if (error.response && error.response.data.errors) {
                    throw {
                        message: error.response.data.message || 'Validation failed',
                        errors: error.response.data.errors
                    };
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },
        
        clearAuth() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },
        
        // Initialize auth state from localStorage
        initAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                // Optionally get user info on init
                this.getUser().catch(() => {
                    // If token is invalid, clear auth
                    this.clearAuth();
                });
            }
        }
    },
});
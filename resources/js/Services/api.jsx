import axios from 'axios';
import { authAPI } from '@/Services/api'


const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
    logout: () => api.post('/logout'),
    me: () => api.get('/me'),
    updateProfile: (data) => api.put('/profile', data),
    changePassword: (data) => api.post('/change-password', data),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getBySlug: (slug) => api.get(`/products/${slug}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Orders API
export const ordersAPI = {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    cancel: (id) => api.post(`/orders/${id}/cancel`),
    updateStatus: (id, status) => api.post(`/orders/${id}/status`, { status }),
};

// Savings API
export const savingsAPI = {
    get: () => api.get('/savings'),
    getTransactions: (params) => api.get('/savings/transactions', { params }),
    deposit: (data) => api.post('/savings/deposit', data),
    withdraw: (data) => api.post('/savings/withdraw', data),
};

// Deposits API
export const depositsAPI = {
    getAll: (params) => api.get('/deposits', { params }),
    getById: (id) => api.get(`/deposits/${id}`),
    create: (data) => api.post('/deposits', data),
    cancel: (id) => api.post(`/deposits/${id}/cancel`),
};

// News API
export const newsAPI = {
    getAll: (params) => api.get('/news', { params }),
    getBySlug: (slug) => api.get(`/news/${slug}`),
};

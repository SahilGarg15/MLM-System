import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('member');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Member API
export const memberAPI = {
  register: (data) => api.post('/members/register', data),
  login: (email, password) => api.post('/members/login', { email, password }),
  getProfile: () => api.get('/members/profile'),
  getDownline: () => api.get('/members/downline'),
  verifySponsor: (code) => api.get(`/members/verify-sponsor/${code}`),
  getAllMembers: () => api.get('/members/all'),
};

export default api;
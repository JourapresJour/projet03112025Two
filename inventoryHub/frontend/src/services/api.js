import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging and error handling
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response) {
      // Server responded with error status
      return Promise.reject({
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        response: error.response.data
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'Network error: Unable to connect to server',
        status: 0
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message,
        status: -1
      });
    }
  }
);

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  
  const queryString = params.toString();
  const url = `/products${queryString ? `?${queryString}` : ''}`;
  
  return api.get(url);
};

export const getProduct = async (id) => {
  return api.get(`/products/${id}`);
};

export const createProduct = async (productData) => {
  return api.post('/products', productData);
};

export const updateProduct = async (id, productData) => {
  return api.put(`/products/${id}`, productData);
};

export const deleteProduct = async (id) => {
  return api.delete(`/products/${id}`);
};

export default api;
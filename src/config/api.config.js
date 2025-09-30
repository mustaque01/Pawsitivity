// Base URL for all API requests
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/users/login`,
    REGISTER: `${API_BASE_URL}/api/v1/users/register`,
    LOGOUT: `${API_BASE_URL}/api/v1/users/logout`,
    PROFILE: `${API_BASE_URL}/api/v1/users/profile`,
  },
  
  // Product endpoints
  PRODUCTS: {
    ALL: `${API_BASE_URL}/api/v1/products/allProducts`,
    BY_ID: (id) => `${API_BASE_URL}/api/v1/products/${id}`,
    REVIEWS: (id) => `${API_BASE_URL}/api/v1/products/${id}/reviews`,
  },
  
  // Cart endpoints
  CART: {
    GET: (userId) => `${API_BASE_URL}/api/v1/cart/${userId}`,
    ADD: `${API_BASE_URL}/api/v1/cart/add`,
    UPDATE: `${API_BASE_URL}/api/v1/cart/update`,
    DELETE: `${API_BASE_URL}/api/v1/cart/delete`,
    CLEAR: (userId) => `${API_BASE_URL}/api/v1/cart/clear/${userId}`,
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: `${API_BASE_URL}/api/v1/orders/new-order`,
    USER_ORDERS: (userId) => `${API_BASE_URL}/api/v1/orders/user/${userId}`,
    ALL_ORDERS: `${API_BASE_URL}/api/v1/orders/all`,
  },
  
  // Address endpoints
  ADDRESS: {
    GET_ALL: (userId) => `${API_BASE_URL}/api/v1/address/user/${userId}`,
    ADD: `${API_BASE_URL}/api/v1/address/add`,
    UPDATE: (addressId) => `${API_BASE_URL}/api/v1/address/${addressId}`,
    DELETE: (addressId) => `${API_BASE_URL}/api/v1/address/${addressId}`,
    SET_DEFAULT: (addressId) => `${API_BASE_URL}/api/v1/address/${addressId}/default`,
  },
  
  // Payment endpoints
  PAYMENT: {
    INITIATE: `${API_BASE_URL}/api/v1/payment/initiate`,
    VERIFY: `${API_BASE_URL}/api/v1/payment/verify`,
  },
  
  // Contact endpoints
  CONTACT: {
    SUBMIT: `${API_BASE_URL}/api/v1/contact/submit`,
  },
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Default timeout for API requests (in milliseconds)
export const DEFAULT_TIMEOUT = 15000; // 15 seconds

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 
    ...DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`
  } : DEFAULT_HEADERS;
};

export default {
  API_BASE_URL,
  ENDPOINTS,
  DEFAULT_HEADERS,
  DEFAULT_TIMEOUT,
  getAuthHeaders,
};
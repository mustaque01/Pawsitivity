import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add axios interceptor to include token in requests
API_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = async (userData) => {
  try {
    const response = await API_URL.post('/signup', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
      message: 'Registration successful'
    };
  } catch (error) {
     console.error("Signup API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
      error: error.message
    };
  }
};

export const login = async (credentials) => {
  try {
    const response = await API_URL.post('/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return {
      success: true,
      token: response.data.token,
      user: response.data.user
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};


// Create a separate instance for products API
const PRODUCTS_API_URL = axios.create({
  baseURL: "http://localhost:8000/api/v1/products",
  
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add axios interceptor to include token in requests for products API
PRODUCTS_API_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await PRODUCTS_API_URL.get('/allProducts');
    
    return {
      success: true,
      data: response.data,
      products: response.data.products || response.data,
      message: 'Products fetched successfully'
    };
  } catch (error) {
    console.error("Get All Products API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch products',
      error: error.message
    };
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await PRODUCTS_API_URL.get(`/${productId}`);
    
    return {
      success: true,
      data: response.data,
      product: response.data.product || response.data,
      message: 'Product fetched successfully'
    };
  } catch (error) {
    console.error("Get Product By ID API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch product',
      error: error.message
    };
  }
};
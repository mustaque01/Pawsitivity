import axios from "axios";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from "../config/api.config.js";

const API_URL = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users`,
  headers: DEFAULT_HEADERS
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
    
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
    
    return {
      success: true,
        token: response.data.accessToken,
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
    
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
    
    return {
      success: true,
        token: response.data.accessToken,
      user: response.data.user
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

// Admin login function
export const adminLogin = async (credentials) => {
  try {
    const response = await API_URL.post('/admin/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Admin login failed'
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};


// contact us api
const CONTACT_API_URL = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/contact`,
  headers: DEFAULT_HEADERS
});
export const submitContact = async (contactData) => {
  try {
    const response = await CONTACT_API_URL.post('/submit', contactData);

    return {
      success: true,
      message: 'Contact form submitted successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Submit Contact API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit contact form',
      error: error.message
    };
  }
};

// get all user list by admin
export const getAllUsersByAdmin = async () => {
  try {
    const response = await API_URL.get('/admin/all-users');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Get All Users API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to retrieve users',
      error: error.message
    };
  }
};
// change user role by admin
export const changeUserRoleByAdmin = async (userId, newRole) => {
  try {
    const response = await API_URL.put(`/admin/change/role/${userId}`, { role: newRole });
    return {
      success: true,
      message: 'User role updated successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Change User Role API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update user role',
      error: error.message
    };
  }
};
// get user detail by admin
export const getUserDetailByAdmin = async (userId) => {
  try {
    const response = await API_URL.get(`/admin/users/${userId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Get User Detail API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to retrieve user details',
      error: error.message
    };
  }
};

// address api
const ADDRESS_API_URL = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/address`,
  headers: DEFAULT_HEADERS
}); 
export const addAddress = async (addressData) => {
  try {
    const response = await ADDRESS_API_URL.post('/', addressData);
    return {
      success: true,
      message: 'Address added successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Add Address API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add address',
      error: error.message
    };
  }
};
export const getAddresses = async (userId) => {
  try {
    const response = await ADDRESS_API_URL.get(`/${userId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Get Addresses API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to retrieve addresses',
      error: error.message
    };
  } 
};
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await ADDRESS_API_URL.put(`/${addressId}`, addressData);
    return {
      success: true,
      message: 'Address updated successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Update Address API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update address',
      error: error.message
    };
  }
};
export const deleteAddress = async (addressId) => {
  try {
    const response = await ADDRESS_API_URL.delete(`/${addressId}`);
    return {
      success: true,
      message: 'Address deleted successfully',
      data: response.data
    };
  } catch (error) {
    console.error("Delete Address API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete address',
      error: error.message
    };
  }
};

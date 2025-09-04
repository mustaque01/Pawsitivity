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


// contact us api
const CONTACT_API_URL = axios.create({
  baseURL: "http://localhost:8000/api/v1/contact",
  headers: {
    'Content-Type': 'application/json'
  }
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
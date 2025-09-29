import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../config/api.config.js";

// Use the centralized config
const API_URL = `${API_BASE_URL}/api/v1/cart`;

export const addToCartAPI = async (userId, productId, quantity = 1) => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add to cart",
      error: error.message,
    };
  }
};

export const getCartAPI = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get cart",
      error: error.message,
    };
  }
};

export const updateCartItemAPI = async (userId, productId, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/update`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update cart item",
      error: error.message,
    };
  }
};

export const removeCartItemAPI = async (userId, productId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      data: { userId, productId },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to remove cart item",
      error: error.message,
    };
  }
};

export const clearCartAPI = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/clear/${userId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to clear cart",
      error: error.message,
    };
  }
};

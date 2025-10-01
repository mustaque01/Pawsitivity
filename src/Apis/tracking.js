import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, getAuthHeaders } from "../config/api.config.js";

// Create a separate instance for tracking API
const TRACKING_API_URL = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/tracking`,
  headers: getAuthHeaders()
});

// Add axios interceptor to include token in requests
TRACKING_API_URL.interceptors.request.use(
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

// Track an order by AWB number or order ID
export const trackOrderByAwb = async (awb) => {
  try {
    const response = await TRACKING_API_URL.get(`/track?awb=${awb}`);
    return {
      success: true,
      data: response.data,
      tracking: response.data.tracking,
      message: 'Order tracking information retrieved successfully'
    };
  } catch (error) {
    console.error("Track Order API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to track order',
      error: error.message
    };
  }
};

// Track an order by order ID
export const trackOrderById = async (orderId) => {
  try {
    const response = await TRACKING_API_URL.get(`/track?orderId=${orderId}`);
    return {
      success: true,
      data: response.data,
      tracking: response.data.tracking,
      orderDetails: response.data.orderDetails,
      message: 'Order tracking information retrieved successfully'
    };
  } catch (error) {
    console.error("Track Order API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to track order',
      error: error.message
    };
  }
};

// Admin: Create a shipment for an order
export const createShipment = async (orderId) => {
  try {
    const response = await TRACKING_API_URL.post(`/create/${orderId}`);
    return {
      success: true,
      data: response.data,
      shipment: response.data.shipment,
      message: 'Shipment created successfully'
    };
  } catch (error) {
    console.error("Create Shipment API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create shipment',
      error: error.message
    };
  }
};

// Get available couriers for a particular delivery
export const getAvailableCouriers = async (pickupPincode, deliveryPincode, weight, cod = false) => {
  try {
    const response = await TRACKING_API_URL.get(
      `/couriers?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod}`
    );
    return {
      success: true,
      data: response.data,
      couriers: response.data.couriers,
      message: 'Available couriers fetched successfully'
    };
  } catch (error) {
    console.error("Get Available Couriers API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch available couriers',
      error: error.message
    };
  }
};

// Admin: Update order tracking information
export const updateOrderTrackingInfo = async (orderId, trackingInfo) => {
  try {
    console.log(`Updating tracking info for order ${orderId}:`, trackingInfo);
    
    const response = await TRACKING_API_URL.put(`/update/${orderId}`, trackingInfo);
    console.log('Update tracking API response:', response.data);
    
    if (!response.data.order) {
      console.warn('API response missing order data:', response.data);
    }
    
    return {
      success: true,
      data: response.data,
      order: response.data.order,
      message: 'Order tracking information updated successfully'
    };
  } catch (error) {
    console.error("Update Order Tracking API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update order tracking information',
      error: error.message
    };
  }
};

// Get Shiprocket pickup locations
export const getPickupLocations = async () => {
  try {
    const response = await TRACKING_API_URL.get('/pickup-locations');
    return {
      success: true,
      data: response.data,
      pickupLocations: response.data.pickupLocations,
      message: 'Pickup locations fetched successfully'
    };
  } catch (error) {
    console.error("Get Pickup Locations API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch pickup locations',
      error: error.message
    };
  }
};

// Admin: Sync order status with Shiprocket tracking data
export const syncOrderStatus = async (orderId) => {
  try {
    const response = await TRACKING_API_URL.get(`/sync-status/${orderId}`);
    return {
      success: true,
      data: response.data,
      order: response.data.order,
      tracking: response.data.tracking,
      statusUpdated: response.data.statusUpdated,
      message: response.data.message
    };
  } catch (error) {
    console.error("Sync Order Status API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to sync order status',
      error: error.message
    };
  }
};

// User: Request a return for an order
export const requestReturn = async (orderId, reason) => {
  try {
    const response = await TRACKING_API_URL.post(`/return/${orderId}`, { reason });
    return {
      success: true,
      data: response.data,
      order: response.data.order,
      message: 'Return request submitted successfully'
    };
  } catch (error) {
    console.error("Request Return API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit return request',
      error: error.message
    };
  }
};
// src/utils/errorHandling.js

/**
 * Format and log API error responses consistently
 * @param {Error} error - The error object from the API call
 * @param {string} source - The source of the error (e.g., "payment", "order")
 * @param {string} action - The action being performed (e.g., "initiate", "verify")
 * @returns {Object} Formatted error response object
 */
export const formatApiError = (error, source, action) => {
  const errorSource = `${source.charAt(0).toUpperCase() + source.slice(1)} ${action}`;
  console.error(`${errorSource} API Error:`, error.response?.data || error.message);
  
  // Determine error message
  let errorMessage = `Failed to ${action} ${source}`;
  let errorCode = 'UNKNOWN_ERROR';
  let statusCode = error.response?.status || 500;
  
  // Extract error details from response if available
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  // Handle specific error types
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    errorMessage = `Request timeout. Please check your internet connection and try again.`;
    errorCode = 'REQUEST_TIMEOUT';
    statusCode = 408;
  } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
    errorMessage = `Network error. Please check your internet connection.`;
    errorCode = 'NETWORK_ERROR';
    statusCode = 0;
  } else if (statusCode === 401) {
    errorMessage = `Authentication failed. Please log in again.`;
    errorCode = 'UNAUTHORIZED';
  } else if (statusCode === 403) {
    errorMessage = `You don't have permission to perform this action.`;
    errorCode = 'FORBIDDEN';
  } else if (statusCode === 404) {
    errorMessage = `The requested ${source} resource was not found.`;
    errorCode = 'NOT_FOUND';
  } else if (statusCode >= 500) {
    errorMessage = `Server error. Please try again later.`;
    errorCode = 'SERVER_ERROR';
  }
  
  return {
    success: false,
    message: errorMessage,
    error: error.message,
    code: errorCode,
    status: statusCode
  };
};

/**
 * Handle common API error scenarios and provide user-friendly messages
 * @param {Error} error - The error from an API call
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (!error) return "An unknown error occurred";
  
  // Network or connection errors
  if (!navigator.onLine) {
    return "You appear to be offline. Please check your internet connection and try again.";
  }
  
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return "The request timed out. Please check your internet connection and try again.";
  }
  
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return "Unable to connect to the server. Please check your internet connection.";
  }
  
  // Authentication errors
  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  
  // Server errors
  if (error.response?.status >= 500) {
    return "We're experiencing technical difficulties. Please try again later.";
  }
  
  // Validation errors
  if (error.response?.status === 400) {
    return error.response.data?.message || "Invalid input. Please check your information and try again.";
  }
  
  // Use the error message from the server if available
  return error.response?.data?.message || error.message || "Something went wrong. Please try again.";
};

/**
 * Parse and handle Razorpay specific error responses
 * @param {Object} razorpayError - Error object from Razorpay
 * @returns {Object} Formatted error response
 */
export const handleRazorpayError = (razorpayError) => {
  if (!razorpayError) return { message: "Unknown payment error" };
  
  // Extract error details
  const { error } = razorpayError;
  
  // Common Razorpay error codes
  const codeMessages = {
    BAD_REQUEST_ERROR: "The payment request was invalid. Please try again.",
    GATEWAY_ERROR: "The payment gateway is experiencing issues. Please try again later.",
    SERVER_ERROR: "Razorpay servers are facing technical difficulties. Please try again later.",
    PAYMENT_FAILED: "Your payment was declined. Please try another payment method."
  };
  
  return {
    success: false,
    message: codeMessages[error?.code] || error?.description || "Payment processing failed",
    code: error?.code || "PAYMENT_ERROR",
    razorpayError: error
  };
};

export default {
  formatApiError,
  getUserFriendlyErrorMessage,
  handleRazorpayError
};
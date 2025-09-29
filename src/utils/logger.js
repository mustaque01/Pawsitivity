// src/utils/logger.js

/**
 * Logger utility for consistent logging across the application
 */

// Environment check
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Current log level - can be adjusted based on environment
const currentLogLevel = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

/**
 * Format a log message with timestamp and additional data
 * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR)
 * @param {string} message - Main log message
 * @param {any} data - Additional data to log
 * @returns {Object} Formatted log object
 */
const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] ${message}`;
  return { level, message: formattedMessage, data, timestamp };
};

/**
 * Debug level logging - only shows in development
 * @param {string} message - Message to log
 * @param {any} data - Additional data to log
 */
export const debug = (message, data = null) => {
  if (currentLogLevel <= LOG_LEVELS.DEBUG) {
    const logEntry = formatLog('DEBUG', message, data);
    console.debug(logEntry.message, data ? data : '');
  }
};

/**
 * Info level logging
 * @param {string} message - Message to log
 * @param {any} data - Additional data to log
 */
export const info = (message, data = null) => {
  if (currentLogLevel <= LOG_LEVELS.INFO) {
    const logEntry = formatLog('INFO', message, data);
    console.info(logEntry.message, data ? data : '');
  }
};

/**
 * Warning level logging
 * @param {string} message - Message to log
 * @param {any} data - Additional data to log
 */
export const warn = (message, data = null) => {
  if (currentLogLevel <= LOG_LEVELS.WARN) {
    const logEntry = formatLog('WARN', message, data);
    console.warn(logEntry.message, data ? data : '');
  }
};

/**
 * Error level logging
 * @param {string} message - Error message
 * @param {Error|any} error - Error object or additional error data
 */
export const error = (message, error = null) => {
  if (currentLogLevel <= LOG_LEVELS.ERROR) {
    const logEntry = formatLog('ERROR', message, error);
    console.error(logEntry.message, error ? error : '');
  }
};

/**
 * Log API request details
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {Object} requestData - Request payload
 */
export const logApiRequest = (method, endpoint, requestData = null) => {
  debug(`API Request: ${method} ${endpoint}`, 
    requestData ? { payload: requestData } : undefined);
};

/**
 * Log API response details
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {Object} responseData - Response data
 * @param {number} status - HTTP status code
 */
export const logApiResponse = (method, endpoint, responseData = null, status = 200) => {
  if (status >= 400) {
    warn(`API Error Response: ${method} ${endpoint} (${status})`, responseData);
  } else {
    debug(`API Success Response: ${method} ${endpoint} (${status})`, responseData);
  }
};

/**
 * Log payment-related events
 * @param {string} action - Payment action (e.g., "initiate", "verify")
 * @param {Object} details - Payment details
 */
export const logPayment = (action, details = {}) => {
  // Remove sensitive data
  const safeDetails = { ...details };
  if (safeDetails.signature) safeDetails.signature = '[REDACTED]';
  if (safeDetails.token) safeDetails.token = '[REDACTED]';
  
  info(`Payment ${action}`, safeDetails);
};

/**
 * Log order-related events
 * @param {string} action - Order action (e.g., "create", "update")
 * @param {string} orderId - Order ID
 * @param {Object} details - Order details
 */
export const logOrder = (action, orderId, details = {}) => {
  info(`Order ${action}: ${orderId}`, details);
};

export default {
  debug,
  info,
  warn,
  error,
  logApiRequest,
  logApiResponse,
  logPayment,
  logOrder
};
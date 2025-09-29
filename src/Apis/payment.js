// src/Apis/payment.js
import axios from "axios";
import { API_BASE_URL, ENDPOINTS, getAuthHeaders, DEFAULT_TIMEOUT } from "../config/api.config.js";
import { formatApiError } from "../utils/errorHandling.js";
import * as logger from "../utils/logger.js";

/**
 * Initiate a payment
 * @param {Object} paymentData - Data required to initiate payment
 * @param {string} paymentData.amount - Amount to be paid
 * @param {string} paymentData.currency - Currency code (default: INR)
 * @param {string} paymentData.orderId - Order ID for which payment is initiated
 * @returns {Promise<Object>} Response object with payment details
 */
export const initiatePayment = async (paymentData) => {
  logger.logApiRequest('POST', ENDPOINTS.PAYMENT.INITIATE, paymentData);
  try {
    const response = await axios.post(
      ENDPOINTS.PAYMENT.INITIATE, 
      paymentData, 
      { 
        headers: getAuthHeaders(),
        timeout: DEFAULT_TIMEOUT
      }
    );
    
    logger.logApiResponse('POST', ENDPOINTS.PAYMENT.INITIATE, response.data, response.status);
    
    // Extract the order data, handling potential nested structures
    const orderData = response.data?.order || response.data?.data || response.data;
    
    // Log the payment with comprehensive details
    logger.logPayment('initiated', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      orderId: orderData?.id,
      responseStructure: Object.keys(response.data || {}).join(',')
    });
    
    return {
      success: true,
      data: response.data,
      message: 'Payment initiated successfully'
    };
  } catch (error) {
    logger.error("Payment initiation failed", error);
    return formatApiError(error, 'payment', 'initiate');
  }
};

/**
 * Verify a payment after completion
 * @param {Object} verificationData - Data required to verify payment
 * @param {string} verificationData.order_id - Order ID from Razorpay
 * @param {string} verificationData.payment_id - Payment ID from Razorpay
 * @param {string} verificationData.signature - Signature from Razorpay
 * @returns {Promise<Object>} Response object with verification status
 */
export const verifyPayment = async (verificationData) => {
  logger.logApiRequest('POST', ENDPOINTS.PAYMENT.VERIFY, {
    order_id: verificationData.order_id,
    payment_id: verificationData.payment_id,
    // Don't log signature for security
  });
  
  try {
    const response = await axios.post(
      ENDPOINTS.PAYMENT.VERIFY,
      verificationData,
      { 
        headers: getAuthHeaders(),
        timeout: DEFAULT_TIMEOUT
      }
    );
    
    logger.logApiResponse('POST', ENDPOINTS.PAYMENT.VERIFY, response.data, response.status);
    logger.logPayment('verified', {
      orderId: verificationData.order_id,
      paymentId: verificationData.payment_id,
      status: response.data?.status
    });
    
    return {
      success: true,
      data: response.data,
      message: 'Payment verified successfully'
    };
  } catch (error) {
    logger.error("Payment verification failed", error);
    return formatApiError(error, 'payment', 'verify');
  }
};

/**
 * Get payment details by ID
 * @param {string} paymentId - The payment ID to retrieve details for
 * @returns {Promise<Object>} Response object with payment details
 */
export const getPaymentById = async (paymentId) => {
  logger.logApiRequest('GET', `${API_BASE_URL}/api/v1/payment/${paymentId}`);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/payment/${paymentId}`,
      { 
        headers: getAuthHeaders(),
        timeout: DEFAULT_TIMEOUT
      }
    );
    
    logger.logApiResponse('GET', `${API_BASE_URL}/api/v1/payment/${paymentId}`, response.data, response.status);
    
    return {
      success: true,
      data: response.data,
      message: 'Payment details fetched successfully'
    };
  } catch (error) {
    logger.error("Failed to fetch payment details", error);
    return formatApiError(error, 'payment', 'fetch');
  }
};

/**
 * Initiate a refund for a payment
 * @param {Object} refundData - Data required to initiate refund
 * @param {string} refundData.paymentId - Payment ID to refund
 * @param {number} refundData.amount - Amount to refund (in smallest currency unit)
 * @returns {Promise<Object>} Response object with refund details
 */
export const initiateRefund = async (refundData) => {
  logger.logApiRequest('POST', `${API_BASE_URL}/api/v1/payment/refund`, {
    paymentId: refundData.paymentId,
    amount: refundData.amount
  });
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/payment/refund`,
      refundData,
      { 
        headers: getAuthHeaders(),
        timeout: DEFAULT_TIMEOUT
      }
    );
    
    logger.logApiResponse('POST', `${API_BASE_URL}/api/v1/payment/refund`, response.data, response.status);
    logger.logPayment('refunded', {
      paymentId: refundData.paymentId,
      amount: refundData.amount,
      refundId: response.data?.refund?.id
    });
    
    return {
      success: true,
      data: response.data,
      message: 'Refund initiated successfully'
    };
  } catch (error) {
    logger.error("Failed to initiate refund", error);
    return formatApiError(error, 'payment', 'refund');
  }
};

export default {
  initiatePayment,
  verifyPayment,
  getPaymentById,
  initiateRefund
};
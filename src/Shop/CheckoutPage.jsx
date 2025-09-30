// src/Shop/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAddresses } from "../Apis/auth";
import { useCart } from "../Context/CartContext";
import { createOrder as createAppOrder } from "../Apis/product_api";
import { initiatePayment, verifyPayment } from "../Apis/payment";
import { ENDPOINTS } from "../config/api.config";

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const navigate = useNavigate();

  // Local UI states
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    if (userId) {
      getAddresses(userId).then((result) => {
        if (result.success && result.data.addresses && result.data.addresses.length > 0) {
          // Save all addresses
          setAddresses(result.data.addresses);
          
          // Set default or first address
          const defaultAddress = result.data.addresses.find(addr => addr.isDefault);
          setAddress(defaultAddress || result.data.addresses[0]);
          setAddressError(null);
        } else {
          setAddress(null);
          setAddresses([]);
          setAddressError("No address found.");
        }
        setAddressLoading(false);
      }).catch(() => {
        setAddress(null);
        setAddresses([]);
        setAddressError("Failed to load addresses.");
        setAddressLoading(false);
      });
    } else {
      setAddress(null);
      setAddresses([]);
      setAddressError("User not logged in.");
      setAddressLoading(false);
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Build order items payload for your app DB
  const buildAppOrderPayload = (paymentInfo = {}) => ({
    shippingInfo: { address: address?._id },
    orderItems: cart.map(item => ({
      name: item.name,
      product: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    paymentInfo, // e.g. { status: "Paid", method: "Razorpay", razorpay_payment_id: "..."}
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: total
  });

  // Main proceed: single button that handles both Magic Checkout (online + COD)
  const handleProceedOrder = async () => {
    setOrderError(null);

    if (!address || !address._id) {
      setOrderError("No address selected.");
      return;
    }
    if (!cart.length) {
      setOrderError("No items in cart.");
      return;
    }

    setOrderLoading(true);

    try {
      // Import logging utilities
      const logger = await import('../utils/logger.js');
      
      // Log checkout attempt
      logger.info("Checkout initiated", { 
        cartItems: cart.length,
        totalAmount: total,
        addressId: address._id
      });
      
      // Load Razorpay script first
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // 1) Create Razorpay Order (server-side) with better error handling
      logger.logApiRequest('POST', ENDPOINTS.PAYMENT.INITIATE, { 
        amount: total,
        currency: 'INR' 
      });
      
      console.log('Payment initiation endpoint:', ENDPOINTS.PAYMENT.INITIATE);
      console.log('Payment amount:', total);
      console.log('User ID:', JSON.parse(localStorage.getItem("user"))?._id);
      
      // Using the payment utility function instead of direct axios call
      const paymentResponse = await initiatePayment({
        amount: total,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          userId: JSON.parse(localStorage.getItem("user"))?._id,
          items: cart.length
        }
      });
      
      console.log('Razorpay response:', paymentResponse);
      
      // Handle both response formats: paymentResponse.data.data (nested) or paymentResponse.data (direct)
      const rzOrder = paymentResponse.data?.order || paymentResponse.data?.data || paymentResponse.data;
      
      console.log('Extracted Razorpay order:', rzOrder);
      
      // Log successful order creation
      logger.logPayment('order-created', { 
        orderId: rzOrder?.id,
        amount: rzOrder?.amount
      });

      if (!rzOrder || !rzOrder.id) {
        throw new Error("Failed to create Razorpay order. Response structure: " + JSON.stringify(paymentResponse));
      }

      // 2) Open Razorpay Checkout
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      console.log('Razorpay Key ID:', razorpayKeyId);
      
      if (!razorpayKeyId) {
        throw new Error("Razorpay Key ID not found. Please check your environment configuration.");
      }
      
      const options = {
        key: razorpayKeyId,
        order_id: rzOrder.id,
        amount: rzOrder.amount,
        currency: rzOrder.currency || "INR",
        name: "Pawsitivity",
        description: "Your order payment",
        prefill: {
          name: address.fullName || "",
          email: address.email || "",
          contact: address.phoneNumber || "",
        },
        theme: { color: "#EF6C00" },

          // Handler called on successful payment
          handler: async function (response) {
            try {
              // Verify payment signature with backend
              if (response && response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature) {
              const verifyResult = await verifyPayment({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });
              
              if (verifyResult.success && verifyResult.data && verifyResult.data.status === "success") {
                  // Log verification details
                  console.log("Payment verification successful:", verifyResult.data);
                  
                  // Create order in app database with complete payment information
                  const appOrderPayload = buildAppOrderPayload({
                    status: "Paid",
                    method: "Razorpay",
                    id: response.razorpay_payment_id, // Payment ID from Razorpay
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    transaction_ref: verifyResult.data.transaction_ref || `TXN-${Date.now()}`, // Use server transaction ref or generate one
                    payment_timestamp: verifyResult.data.verified_at || new Date().toISOString(),
                  });

                  const appCreateResp = await createAppOrder(appOrderPayload);
                  if (appCreateResp.success) {
                    setOrderLoading(false);
                    await clearCart(); // Clear the cart after successful order
                    navigate("/Order");
                  } else {
                    throw new Error(appCreateResp.message || "Failed to save order in database.");
                  }
                } else {
                  throw new Error("Payment verification failed.");
                }
              } else {
                throw new Error("Invalid payment response received.");
              }
            } catch (err) {
              console.error("Payment handler error:", err);
              setOrderError(err.message || "Payment processing failed.");
              setOrderLoading(false);
            }
          },        modal: {
          ondismiss: function () {
            setOrderLoading(false);
          }
        }
      };

      // Create and open Razorpay checkout
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setOrderError(`Payment failed: ${response.error.description || 'Please try again.'}`);
        setOrderLoading(false);
      });

      rzp.open();

    } catch (err) {
      console.error("Checkout error:", err);
      
      // Detailed error logging
      console.log('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        endpoint: ENDPOINTS.PAYMENT.INITIATE
      });
      
      // Import error handling utilities
      const { getUserFriendlyErrorMessage } = await import('../utils/errorHandling.js');
      const logger = await import('../utils/logger.js');
      
      // Log the error
      logger.error("Checkout failed", err);
      
      // Specific error messages based on common scenarios
      let errorMessage = "Failed to create Razorpay order";
      
      if (err.response?.data?.message) {
        errorMessage = `Razorpay error: ${err.response.data.message}`;
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (err.message.includes('Network Error')) {
        errorMessage = "Network error. Please check if the backend server is running.";
      } else {
        errorMessage = getUserFriendlyErrorMessage(err);
      }
      
      setOrderError(errorMessage);
      setOrderLoading(false);
    }
  };

  // QUICK GUARD: no items in cart
  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No items in cart</h2>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
              {addresses.length > 1 && (
                <button 
                  type="button"
                  onClick={() => setShowAddressSelector(!showAddressSelector)}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  {showAddressSelector ? 'Hide Options' : 'Change Address'}
                </button>
              )}
            </div>
            
            {addressLoading ? (
              <div className="text-gray-500">Loading address...</div>
            ) : address ? (
              <>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm">
                  <div><span className="font-semibold">Name:</span> {address.fullName}</div>
                  <div><span className="font-semibold">Phone:</span> {address.phoneNumber}</div>
                  <div><span className="font-semibold">Email:</span> {address.email}</div>
                  <div><span className="font-semibold">Address:</span> {address.street}{address.landmark ? `, ${address.landmark}` : ""}</div>
                  <div>
                    <span className="font-semibold">City/State/Pincode:</span> {address.city}, {address.state} - {address.pinCode}
                  </div>
                  <div><span className="font-semibold">Country:</span> {address.country}</div>
                  {address.company && <div><span className="font-semibold">Company:</span> {address.company}</div>}
                  {address.deliveryInstructions && <div><span className="font-semibold">Instructions:</span> {address.deliveryInstructions}</div>}
                </div>
                
                {showAddressSelector && addresses.length > 0 && (
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <h3 className="bg-gray-100 px-3 py-2 font-medium text-sm">Select Shipping Address</h3>
                    <div className="max-h-60 overflow-y-auto">
                      {addresses.map(addr => (
                        <div 
                          key={addr._id} 
                          onClick={() => setAddress(addr)}
                          className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition ${addr._id === address._id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''}`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{addr.fullName}</span>
                            {addr.isDefault && <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-1">Default</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{addr.street}, {addr.city}, {addr.state}, {addr.pinCode}</div>
                          <div className="text-xs text-gray-500">{addr.phoneNumber}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {addresses.length === 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/profile/addresses/add')}
                      className="text-sm text-orange-600 hover:underline"
                    >
                      + Add a New Address
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <div className="text-red-600 mb-4">{addressError || "No address found."}</div>
                <button
                  onClick={() => navigate('/profile/addresses/add')}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                >
                  Add New Address
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Order Summary</h2>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center py-4 gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.format}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-orange-600">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-orange-600">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center mt-8 gap-4">
          <button
            onClick={handleProceedOrder}
            className={`w-full sm:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition ${orderLoading || !address ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={orderLoading || !address}
          >
            {orderLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>

        {orderError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
            <strong>Error:</strong> {orderError}
          </div>
        )}
      </div>
    </div>
  );
}

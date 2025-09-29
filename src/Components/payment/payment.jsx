import axios from "axios";
import { useState } from "react";

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 second timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const amount = 500; // Example ₹500

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Load Razorpay script first
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // Create order in backend with proper error handling
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const { data: order } = await axios.post(`${backendUrl}/create-order`, {
        amount,
        currency: 'INR',
        receipt: `order_${Date.now()}`
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      });

      if (!order || !order.id) {
        throw new Error('Invalid order response from server');
      }

      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "Pawsitivity",
        description: "Order Payment",
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: { color: "#EF6C00" },
        handler: function (response) {
          alert(`Payment Success! 
            Order: ${order.id} 
            Payment ID: ${response.razorpay_payment_id || "COD Pending"}`);
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      let errorMessage = 'Checkout failed. Please try again.';
      
      if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Server endpoint not found. Please contact support.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <p className="mb-2">Total: ₹{amount}</p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}

export default Checkout;

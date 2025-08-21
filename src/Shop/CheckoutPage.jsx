import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getCartFromStorage() {
  try {
    const cart = localStorage.getItem("pawsitivity_cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

function getAddressFromStorage() {
  try {
    const address = localStorage.getItem("pawsitivity_address");
    return address ? JSON.parse(address) : null;
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  const [cart, setCart] = useState(getCartFromStorage());
  const [address, setAddress] = useState(getAddressFromStorage());
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      localStorage.removeItem("pawsitivity_cart");
      localStorage.removeItem("pawsitivity_address");
      setProcessing(false);
      navigate("/shop");
      alert("Payment successful! Thank you for your order.");
    }, 2000);
  };

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
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Shipping Address</h2>
            {address ? (
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm">
                <div><span className="font-semibold">Name:</span> {address.name}</div>
                <div><span className="font-semibold">Phone:</span> {address.phone}</div>
                <div><span className="font-semibold">Address:</span> {address.address}</div>
                <div>
                  <span className="font-semibold">City/State/Pincode:</span> {address.city}, {address.state} - {address.pincode}
                </div>
              </div>
            ) : (
              <div className="text-red-600">No address found.</div>
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
            onClick={handlePayment}
            disabled={processing}
            className="w-full sm:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-60"
          >
            {processing ? "Processing Payment..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

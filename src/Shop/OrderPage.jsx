import React, { useEffect, useState } from "react";
import { getUserOrders } from "../Apis/product_api";
import { useAuth } from "../Components/Auth/AuthContext";
import { Link } from 'react-router-dom';
import { FaShippingFast, FaBoxOpen, FaMapMarkerAlt, FaBarcode } from "react-icons/fa";

function OrderPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        setError("User not found. Please login.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await getUserOrders(user._id);
        console.log('Orders API response:', result);
        
        if (result.success && result.data && result.data.orders) {
          setOrders(result.data.orders);
        } else {
          setError(result.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError("An error occurred while fetching your orders");
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="mb-2 text-sm text-gray-600">
                Order ID: <span className="font-mono">{order._id}</span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </div>
              <div className="mb-2 text-sm text-gray-600">
                Status:{" "}
                <span className={`font-semibold ${order.awbNumber ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.awbNumber ? 'Shipped' : 
                   order.orderStatus ? order.orderStatus : 
                   order.paymentInfo?.status === 'Paid' ? 'Processing' : 'Pending'}
                </span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                Total Amount:{" "}
                <span className="font-bold text-orange-600">
                  ₹{order.totalAmount || 0}
                </span>
              </div>
              
              {/* Tracking Information */}
              {order.awbNumber ? (
                <div className="mt-3 mb-4">
                  <div className="flex items-center mb-2">
                    <FaShippingFast className="text-yellow-600 mr-2" />
                    <span className="text-sm font-semibold">Shipment Status</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FaBarcode className="text-yellow-700 mr-2" />
                          <span className="text-sm font-medium">AWB: <span className="font-mono">{order.awbNumber}</span></span>
                        </div>
                        {order.courier && (
                          <div className="flex items-center">
                            <FaBoxOpen className="text-yellow-700 mr-2" />
                            <span className="text-sm">Courier: {order.courier}</span>
                          </div>
                        )}
                      </div>
                      <Link 
                        to={`/track/${order._id}`}
                        className="flex items-center bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        <FaShippingFast className="mr-2" />
                        Track Package
                      </Link>
                    </div>
                    <div className="mt-3 pt-2 border-t border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        Your order has been shipped. Click 'Track Package' to see the latest delivery status.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 mb-4">
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                    <span className="text-sm font-semibold">Delivery Status</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-600">
                        {order.orderStatus === 'Processing' 
                          ? 'Your order is being processed. It will be shipped soon.'
                          : order.paymentInfo?.status === 'Paid' 
                            ? 'Your order is being prepared for shipment.'
                            : 'Your order is pending. Tracking information will be available once your order is confirmed and shipped.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-2 text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-gray-500 mr-2" />
                  <span className="font-semibold">Shipping Address</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-md">
                  {order.shippingInfo?.address ? (
                    <div className="space-y-1">
                      <p className="font-medium">
                        {order.shippingInfo.address.name || 'Recipient'}
                      </p>
                      
                      <p>
                        {order.shippingInfo.address.street || order.shippingInfo.address.address || order.shippingInfo.address.addressLine1 || ''}
                        {order.shippingInfo.address.addressLine2 ? `, ${order.shippingInfo.address.addressLine2}` : ''}
                      </p>
                      
                      <p>
                        {order.shippingInfo.address.landmark ? `${order.shippingInfo.address.landmark}, ` : ''}
                        {order.shippingInfo.address.city || ''}
                        {order.shippingInfo.address.city && order.shippingInfo.address.state ? ', ' : ''}
                        {order.shippingInfo.address.state || ''}
                        {(order.shippingInfo.address.city || order.shippingInfo.address.state) && order.shippingInfo.address.pinCode ? ' - ' : ''}
                        {order.shippingInfo.address.pinCode || ''}
                      </p>
                      
                      <p>
                        {order.shippingInfo.address.country || 'India'}
                      </p>
                      
                      <p className="text-gray-600">
                        Phone: {order.shippingInfo.address.phoneNumber || order.shippingInfo.address.phone || 'N/A'}
                      </p>
                      
                      {order.shippingInfo.address.email && (
                        <p className="text-gray-600">
                          Email: {order.shippingInfo.address.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Shipping address not available</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h2 className="font-semibold mb-2">Items:</h2>
                <ul className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span>{item.name || 'Product'}</span>
                      <span className="text-gray-500">
                        Qty: {item.quantity || 1}
                      </span>
                      <span className="text-orange-600 font-bold">
                        ₹{(item.price || 0) * (item.quantity || 1)}
                      </span>
                    </li>
                  ))}
                  <li>
                    <div className="mb-2 text-sm text-gray-600">
                      Total Amount:{" "}
                      <span className="font-bold text-orange-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderPage;

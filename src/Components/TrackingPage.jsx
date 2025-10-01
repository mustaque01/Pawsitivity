import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trackOrderById, trackOrderByAwb } from '../Apis/tracking';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaCalendarAlt, FaTruck, FaBarcode } from 'react-icons/fa';

const TrackingPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingId, setTrackingId] = useState(orderId || '');
  const [trackingIdType, setTrackingIdType] = useState('order'); // 'order' or 'awb'

  // Function to get the tracking details wrapped with useCallback
  const getTrackingDetails = useCallback(async (id, type) => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (type === 'order') {
        result = await trackOrderById(id);
      } else {
        result = await trackOrderByAwb(id);
      }
      
      if (result.success) {
        setTrackingInfo(result.tracking);
        if (result.orderDetails) {
          setOrderDetails(result.orderDetails);
        }
        // Add this order ID to tracking history in localStorage
        saveToTrackingHistory(id, type);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to track shipment. Please try again.');
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save successful tracking query to localStorage for history
  const saveToTrackingHistory = (id, type) => {
    try {
      const history = JSON.parse(localStorage.getItem('trackingHistory')) || [];
      
      // Check if this ID is already in history
      const existingIndex = history.findIndex(item => item.id === id);
      
      if (existingIndex >= 0) {
        // Move this item to the front (most recent)
        const existingItem = history[existingIndex];
        history.splice(existingIndex, 1);
        history.unshift({
          ...existingItem,
          lastChecked: new Date().toISOString()
        });
      } else {
        // Add new item to the front
        history.unshift({
          id,
          type,
          lastChecked: new Date().toISOString()
        });
      }
      
      // Keep only the last 5 items
      const trimmedHistory = history.slice(0, 5);
      
      localStorage.setItem('trackingHistory', JSON.stringify(trimmedHistory));
    } catch (err) {
      console.error('Error saving tracking history:', err);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingId) return;
    
    // Update URL without refreshing
    navigate(`/track/${trackingId}?type=${trackingIdType}`, { replace: true });
    
    // Get tracking details
    getTrackingDetails(trackingId, trackingIdType);
  };

  // Load tracking details when the component mounts or when parameters change
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type') || 'order';
    
    if (orderId) {
      setTrackingId(orderId);
      setTrackingIdType(typeParam);
      getTrackingDetails(orderId, typeParam);
    } else {
      setLoading(false);
    }
  }, [orderId, location.search, getTrackingDetails]);

  // Get recent tracking history from localStorage
  const [trackingHistory, setTrackingHistory] = useState([]);
  
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('trackingHistory')) || [];
      setTrackingHistory(history);
    } catch (err) {
      console.error('Error loading tracking history:', err);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-600">Track Your Order</h1>
      
      {/* Tracking Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap space-y-2 sm:space-y-0">
            <div className="w-full sm:w-2/3 sm:pr-2">
              <label htmlFor="trackingId" className="block mb-1 font-medium text-gray-700">
                Enter Order ID or AWB Number
              </label>
              <input
                type="text"
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div className="w-full sm:w-1/3">
              <label className="block mb-1 font-medium text-gray-700">
                ID Type
              </label>
              <select
                value={trackingIdType}
                onChange={(e) => setTrackingIdType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="order">Order ID</option>
                <option value="awb">AWB Number</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium text-lg"
          >
            Track
          </button>
        </form>
        
        {/* Recent Tracking History */}
        {trackingHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Recent Tracking</h3>
            <div className="space-y-2">
              {trackingHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTrackingId(item.id);
                    setTrackingIdType(item.type);
                    navigate(`/track/${item.id}?type=${item.type}`);
                    getTrackingDetails(item.id, item.type);
                  }}
                  className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm"
                >
                  <div className="flex justify-between items-center">
                    <span>
                      <FaBarcode className="inline-block mr-2 text-gray-500" />
                      {item.id} ({item.type === 'order' ? 'Order ID' : 'AWB'})
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.lastChecked).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracking information...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center mb-4">
            <FaTimesCircle className="text-red-500 text-3xl mr-3" />
            <h2 className="text-xl font-bold">Tracking Error</h2>
          </div>
          <p className="mb-4">{error}</p>
          <p>Please check your tracking details and try again.</p>
        </div>
      )}
      
      {/* Tracking Information */}
      {trackingInfo && !loading && !error && (
        <div className="space-y-6">
          {/* Order Information */}
          {orderDetails && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Order ID</p>
                  <p className="font-medium">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Order Date</p>
                  <p className="font-medium">
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  <p className="font-medium">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                      orderDetails.orderStatus === 'Delivered' ? 'bg-green-500' : 
                      orderDetails.orderStatus === 'Shipped' ? 'bg-blue-500' :
                      orderDetails.orderStatus === 'Processing' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}>
                      {orderDetails.orderStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Shipment Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Shipment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">
                  <FaBarcode className="inline-block mr-2" /> AWB Number
                </p>
                <p className="font-medium">{trackingInfo.awb || trackingInfo.tracking_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <FaTruck className="inline-block mr-2" /> Courier
                </p>
                <p className="font-medium">{trackingInfo.courier_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <FaCalendarAlt className="inline-block mr-2" /> Shipped Date
                </p>
                <p className="font-medium">
                  {trackingInfo.shipped_date ? new Date(trackingInfo.shipped_date).toLocaleDateString() : 'Pending'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <FaMapMarkerAlt className="inline-block mr-2" /> Current Location
                </p>
                <p className="font-medium">
                  {trackingInfo.current_location || trackingInfo.current_status_location || 'In Transit'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <FaCheckCircle className="inline-block mr-2" /> Current Status
                </p>
                <p className="font-medium">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                    trackingInfo.current_status === 'Delivered' ? 'bg-green-500' : 
                    trackingInfo.current_status === 'In Transit' ? 'bg-blue-500' :
                    trackingInfo.current_status === 'Picked Up' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {trackingInfo.current_status || 'Processing'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <FaCalendarAlt className="inline-block mr-2" /> Expected Delivery
                </p>
                <p className="font-medium">
                  {trackingInfo.expected_delivery_date 
                    ? new Date(trackingInfo.expected_delivery_date).toLocaleDateString() 
                    : 'Information not available'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Shipment Status Progress */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Shipment Progress</h2>
            
            {/* Status Progress Bar */}
            <div className="mb-10">
              {(() => {
                // Define the standard shipment statuses in order
                const statuses = [
                  { key: 'order_placed', label: 'Order Placed', icon: FaBox },
                  { key: 'processing', label: 'Processing', icon: FaBox },
                  { key: 'shipped', label: 'Shipped', icon: FaShippingFast },
                  { key: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck },
                  { key: 'delivered', label: 'Delivered', icon: FaCheckCircle }
                ];
                
                // Map Shiprocket or internal statuses to our standard statuses
                const currentStatus = trackingInfo.current_status || 
                                     (orderDetails?.shipmentStatus || 'Processing');
                
                // Helper function to determine if a status is active
                const isActive = (status) => {
                  const statusKey = status.key.toLowerCase();
                  const currentStatusLower = currentStatus.toLowerCase();
                  
                  if (currentStatusLower.includes('delivered') || currentStatusLower === 'delivered early') {
                    return true; // If delivered, all steps are active
                  }
                  if (currentStatusLower.includes('out for delivery') && 
                      (statusKey === 'order_placed' || statusKey === 'processing' || statusKey === 'shipped')) {
                    return true;
                  }
                  if ((currentStatusLower.includes('shipped') || currentStatusLower === 'in transit') && 
                      (statusKey === 'order_placed' || statusKey === 'processing')) {
                    return true;
                  }
                  if (currentStatusLower.includes('processing') && statusKey === 'order_placed') {
                    return true;
                  }
                  
                  return currentStatusLower.includes(statusKey);
                };
                
                return (
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="absolute left-0 top-10 right-0 h-1 bg-gray-200"></div>
                    <div className="absolute left-0 top-10 h-1 bg-green-500" 
                         style={{ 
                           width: (() => {
                             if (currentStatus.toLowerCase().includes('delivered')) return '100%';
                             if (currentStatus.toLowerCase().includes('out for delivery')) return '75%';
                             if (currentStatus.toLowerCase().includes('shipped') || currentStatus.toLowerCase() === 'in transit') return '50%';
                             if (currentStatus.toLowerCase().includes('processing')) return '25%';
                             return '0%';
                           })()
                         }}>
                    </div>
                    
                    {/* Status Points */}
                    <div className="flex justify-between">
                      {statuses.map((status) => {
                        const StatusIcon = status.icon;
                        const active = isActive(status);
                        
                        return (
                          <div key={status.key} className="flex flex-col items-center relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                              active ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                              <StatusIcon />
                            </div>
                            <p className={`mt-3 text-xs font-medium text-center max-w-[80px] ${
                              active ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {status.label}
                            </p>
                            
                            {/* Current indicator */}
                            {(() => {
                              const statusLower = status.key.toLowerCase();
                              const currentLower = currentStatus.toLowerCase();
                              
                              if (
                                (statusLower === 'delivered' && currentLower.includes('delivered')) ||
                                (statusLower === 'out_for_delivery' && currentLower.includes('out for delivery')) ||
                                (statusLower === 'shipped' && (currentLower.includes('shipped') || currentLower === 'in transit')) ||
                                (statusLower === 'processing' && currentLower.includes('processing')) ||
                                (statusLower === 'order_placed' && currentLower.includes('order'))
                              ) {
                                return (
                                  <div className="absolute -top-8">
                                    <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                                      Current
                                    </div>
                                    <div className="w-2 h-2 border-t-4 border-l-4 border-r-4 border-yellow-500 mx-auto" 
                                         style={{ transform: 'translateY(-1px)' }}></div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
            
            {/* Expected delivery information */}
            {trackingInfo.expected_delivery_date && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center mb-6">
                <FaCalendarAlt className="text-green-600 mr-3 text-xl" />
                <div>
                  <p className="font-medium text-green-800">Expected Delivery</p>
                  <p className="text-green-700">
                    {new Date(trackingInfo.expected_delivery_date).toLocaleDateString()} 
                    {new Date(trackingInfo.expected_delivery_date).toLocaleDateString() === new Date().toLocaleDateString() && (
                      <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">Today</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Tracking Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Tracking Timeline</h2>
            
            {trackingInfo.tracking_data && trackingInfo.tracking_data.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {trackingInfo.tracking_data.map((event, index) => (
                    <div key={index} className="relative pl-10">
                      <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {index === 0 ? (
                          <FaCheckCircle className="text-white" />
                        ) : (
                          <FaBox className="text-white" />
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="font-semibold text-gray-800">{event.status || 'Status Update'}</p>
                        <p className="text-sm text-gray-600 mb-1">{event.location || 'In Transit'}</p>
                        <p className="text-xs text-gray-500">
                          {event.date ? new Date(event.date).toLocaleString() : 'Date not available'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaShippingFast className="mx-auto text-5xl text-yellow-500 mb-4" />
                <p className="text-gray-600">
                  Detailed tracking information is being updated.
                  <br />Please check back later for real-time updates.
                </p>
                
                {/* Basic status when no detailed timeline is available */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg inline-block">
                  <p className="font-medium text-yellow-800">Current Status</p>
                  <p className="text-yellow-700">
                    {trackingInfo.current_status || orderDetails?.shipmentStatus || 'Processing'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Help Information */}
      {!loading && (
        <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Need Help?</h3>
          <p className="mb-4">
            If you have any questions about your order or need assistance with tracking,
            please contact our customer support.
          </p>
          <a 
            href="/contact" 
            className="inline-block py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
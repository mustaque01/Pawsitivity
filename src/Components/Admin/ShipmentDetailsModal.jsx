import React, { useState, useEffect } from 'react';
import { FaShippingFast, FaBoxOpen, FaMapMarkerAlt, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { trackOrderById } from '../../Apis/tracking';

// Modal for viewing detailed shipment information
const ShipmentDetailsModal = ({ orderId, onClose }) => {
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching shipment details for order:', orderId);
        const result = await trackOrderById(orderId);
        console.log('Tracking API response:', result);
        
        if (result.success) {
          console.log('Order details:', result.orderDetails);
          console.log('Tracking data:', result.tracking);
          
          // Verify we have the expected data structure
          if (!result.orderDetails) {
            console.warn('Missing orderDetails in API response');
          }
          
          setShipmentDetails(result.orderDetails);
          setTrackingData(result.tracking);
        } else {
          console.error('API returned error:', result.message, result.error);
          setError(result.message || 'Failed to load shipment details');
        }
      } catch (err) {
        setError('Failed to fetch shipment details');
        console.error('Error fetching shipment details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchShipmentDetails();
    }
  }, [orderId]);

  // Calculate estimated delivery date (3-5 days from shipped date)
  const getEstimatedDelivery = () => {
    if (!trackingData?.shipped_date) return 'Not available';
    
    const shippedDate = new Date(trackingData.shipped_date);
    const minDelivery = new Date(shippedDate);
    const maxDelivery = new Date(shippedDate);
    
    minDelivery.setDate(minDelivery.getDate() + 3);
    maxDelivery.setDate(maxDelivery.getDate() + 5);
    
    return `${minDelivery.toLocaleDateString()} - ${maxDelivery.toLocaleDateString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Shipment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <FaSpinner className="animate-spin text-yellow-600 text-3xl mb-4" />
              <p className="text-gray-600">Loading shipment details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-600 mb-6">
              <p>{error}</p>
              <p className="mt-2 text-sm">Please try again or contact support if the issue persists.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Shipment Status */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center mb-2">
                  <FaShippingFast className="text-yellow-600 mr-2 text-xl" />
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Shipment Status
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <p className="font-medium text-gray-800">
                      {trackingData?.current_status || 'Processing'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium text-gray-800">
                      {trackingData?.expected_delivery_date
                        ? new Date(trackingData.expected_delivery_date).toLocaleDateString()
                        : getEstimatedDelivery()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">AWB Number</p>
                    <p className="font-medium text-gray-800">
                      {trackingData?.awb || shipmentDetails?.awbNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Courier Service</p>
                    <p className="font-medium text-gray-800">
                      {trackingData?.courier_name || shipmentDetails?.courier || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Order Information */}
              {shipmentDetails && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FaBoxOpen className="text-gray-600 mr-2 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium text-gray-800">{shipmentDetails.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date(shipmentDetails.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-gray-800">
                        ₹{shipmentDetails.totalAmount || shipmentDetails.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className={`font-medium ${
                        shipmentDetails.paymentInfo?.status === 'Paid' 
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}>
                        {shipmentDetails.paymentInfo?.status || 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Delivery Address */}
              {shipmentDetails?.deliveryAddress && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-gray-600 mr-2 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Delivery Address
                    </h3>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium text-gray-800">
                      {shipmentDetails.deliveryAddress.name || `${shipmentDetails.user?.firstName || ''} ${shipmentDetails.user?.lastName || ''}`}
                    </p>
                    <p className="text-gray-600">
                      {shipmentDetails.deliveryAddress.street || shipmentDetails.deliveryAddress.address || ''}
                      {shipmentDetails.deliveryAddress.city ? `, ${shipmentDetails.deliveryAddress.city}` : ''}
                    </p>
                    <p className="text-gray-600">
                      {shipmentDetails.deliveryAddress.state || ''}
                      {shipmentDetails.deliveryAddress.state && shipmentDetails.deliveryAddress.zipCode ? ' - ' : ''}
                      {shipmentDetails.deliveryAddress.zipCode || shipmentDetails.deliveryAddress.pincode || ''}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Phone: {shipmentDetails.deliveryAddress.phone || shipmentDetails.user?.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Tracking History Timeline */}
              {trackingData?.tracking_data && trackingData.tracking_data.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Tracking History
                  </h3>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {trackingData.tracking_data.map((event, index) => (
                        <div key={index} className="relative pl-10">
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{event.status || 'Status Update'}</p>
                            <p className="text-sm text-gray-600">{event.location || 'In Transit'}</p>
                            <p className="text-xs text-gray-500">
                              {event.date ? new Date(event.date).toLocaleString() : 'Date not available'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsModal;
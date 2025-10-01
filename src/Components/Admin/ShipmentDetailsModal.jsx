import React, { useState, useEffect } from 'react';
import { FaShippingFast, FaBoxOpen, FaMapMarkerAlt, FaTimesCircle, FaSpinner, FaSync } from 'react-icons/fa';
import { trackOrderById, syncOrderStatus } from '../../Apis/tracking';

// Modal for viewing detailed shipment information
const ShipmentDetailsModal = ({ order, onClose, onStatusUpdated }) => {
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching shipment details for order:', order._id);
        const result = await trackOrderById(order._id);
        console.log('Tracking API response:', result);
        
        if (result.success) {
          console.log('Order details:', result.orderDetails);
          console.log('Tracking data:', result.tracking);
          
          // Verify we have the expected data structure
          if (!result.orderDetails) {
            console.warn('Missing orderDetails in API response');
            // Use order data as a fallback if orderDetails is missing
            setShipmentDetails({
              ...order,
              deliveryAddress: order.shippingInfo?.address || {}
            });
          } else {
            setShipmentDetails(result.orderDetails);
          }
          
          // Handle tracking data
          if (result.tracking) {
            setTrackingData(result.tracking);
          } else {
            // Create a simplified tracking object if no tracking data
            setTrackingData({
              awb: order.awbNumber,
              courier_name: order.courier,
              current_status: order.shipmentStatus || 'Processing',
              tracking_data: []
            });
          }
        } else {
          console.error('API returned error:', result.message, result.error);
          // Even if API fails, show basic order info
          setShipmentDetails({
            ...order,
            deliveryAddress: order.shippingInfo?.address || {}
          });
          setTrackingData({
            awb: order.awbNumber,
            courier_name: order.courier,
            current_status: order.shipmentStatus || 'Processing',
            tracking_data: []
          });
          setError(result.message || 'Failed to load detailed shipment information');
        }
      } catch (err) {
        setError('Failed to fetch detailed shipment information');
        console.error('Error fetching shipment details:', err);
        
        // Still show basic order info even if API call fails
        setShipmentDetails({
          ...order,
          deliveryAddress: order.shippingInfo?.address || {}
        });
        setTrackingData({
          awb: order.awbNumber,
          courier_name: order.courier,
          current_status: order.shipmentStatus || 'Processing',
          tracking_data: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (order && order._id) {
      fetchShipmentDetails();
    }
  }, [order]);

  // Handle sync status with Shiprocket
  const handleSyncStatus = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      
      if (!order || !order._id) {
        setSyncMessage({
          type: 'error',
          text: 'Invalid order data. Cannot sync status.'
        });
        return;
      }
      
      console.log('Syncing status for order:', order._id);
      const result = await syncOrderStatus(order._id);
      console.log('Sync status API response:', result);
      
      if (result.success) {
        // Update local state with new data
        if (result.tracking) {
          setTrackingData(result.tracking);
        }
        
        if (result.order) {
          setShipmentDetails(prevDetails => ({
            ...prevDetails,
            shipmentStatus: result.order.shipmentStatus,
            awbNumber: result.order.awbNumber,
            courier: result.order.courier
          }));
          
          // If status was updated and we have a callback
          if (result.statusUpdated && typeof onStatusUpdated === 'function') {
            onStatusUpdated(result.order);
          }
        }
        
        setSyncMessage({
          type: 'success',
          text: result.message || 'Status synced successfully'
        });
      } else {
        setSyncMessage({
          type: 'error',
          text: result.message || 'Failed to sync status with tracking provider'
        });
      }
    } catch (err) {
      console.error('Error syncing status:', err);
      setSyncMessage({
        type: 'error',
        text: 'An unexpected error occurred while syncing status'
      });
    } finally {
      setSyncing(false);
    }
  };
  
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
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FaShippingFast className="text-yellow-600 mr-2 text-xl" />
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Shipment Status
                    </h3>
                  </div>
                  
                  {/* Sync Status Button */}
                  {shipmentDetails && (shipmentDetails.awbNumber || shipmentDetails.shipmentId) && (
                    <button
                      onClick={handleSyncStatus}
                      disabled={syncing}
                      className={`px-2 py-1 text-xs flex items-center rounded-md ${
                        syncing 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      title="Sync status with shipping provider"
                    >
                      {syncing ? (
                        <>
                          <FaSpinner className="animate-spin mr-1" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <FaSync className="mr-1" />
                          Sync Status
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Sync Message */}
                {syncMessage && (
                  <div className={`mb-3 p-2 rounded text-sm ${
                    syncMessage.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-100' 
                      : 'bg-red-50 text-red-800 border border-red-100'
                  }`}>
                    {syncMessage.text}
                  </div>
                )}
                
                {/* Status Timeline */}
                <div className="mb-4 mt-2">
                  <div className="relative flex justify-between items-center">
                    {/* Progress Bar */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full z-0"></div>
                    
                    {/* Status Points */}
                    {(() => {
                      const statuses = [
                        { key: 'processing', label: 'Processing' },
                        { key: 'shipped', label: 'Shipped' },
                        { key: 'out_for_delivery', label: 'Out for Delivery' },
                        { key: 'delivered', label: 'Delivered' }
                      ];
                      
                      // Get current status from tracking data or shipment details
                      const currentStatus = trackingData?.current_status || 
                                           shipmentDetails?.shipmentStatus || 
                                           'Processing';
                      
                      // Helper function to determine if a status is active
                      const isActive = (status) => {
                        if (currentStatus.toLowerCase().includes('delivered')) {
                          return true; // If delivered, all steps are active
                        }
                        if (currentStatus.toLowerCase().includes('out for delivery') && 
                            (status.key === 'processing' || status.key === 'shipped')) {
                          return true;
                        }
                        if (currentStatus.toLowerCase().includes('shipped') && 
                            status.key === 'processing') {
                          return true;
                        }
                        return currentStatus.toLowerCase().includes(status.key);
                      };
                      
                      return (
                        <>
                          {statuses.map((status, index) => (
                            <div key={status.key} className="relative z-10 flex flex-col items-center">
                              <div 
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isActive(status) 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {index + 1}
                              </div>
                              <span className="text-xs mt-1">{status.label}</span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <p className="font-medium text-gray-800">
                      {(() => {
                        const status = trackingData?.current_status || 
                                      shipmentDetails?.shipmentStatus || 
                                      'Processing';
                        let statusColor;
                        
                        if (status.toLowerCase().includes('delivered')) {
                          statusColor = 'text-green-600';
                        } else if (status.toLowerCase().includes('out for delivery')) {
                          statusColor = 'text-blue-600';
                        } else if (status.toLowerCase().includes('shipped')) {
                          statusColor = 'text-yellow-600';
                        } else if (status.toLowerCase().includes('return')) {
                          statusColor = 'text-orange-600';
                        } else if (status.toLowerCase().includes('cancel')) {
                          statusColor = 'text-red-600';
                        } else {
                          statusColor = 'text-gray-800';
                        }
                        
                        return <span className={statusColor}>{status}</span>;
                      })()}
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
                      {trackingData?.awb || shipmentDetails?.awbNumber || 
                       (shipmentDetails?.shipmentId ? 'AWB pending' : 'N/A')}
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
              {(shipmentDetails?.deliveryAddress || shipmentDetails?.shippingInfo?.address) && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-gray-600 mr-2 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Delivery Address
                    </h3>
                  </div>
                  <div className="mt-4">
                    {(() => {
                      // Determine which address object to use
                      const addressData = shipmentDetails.deliveryAddress || 
                                          shipmentDetails.shippingInfo?.address || {};
                      
                      return (
                        <>
                          <p className="font-medium text-gray-800">
                            {addressData.fullName || addressData.name || 
                            `${shipmentDetails.user?.firstName || ''} ${shipmentDetails.user?.lastName || ''}`}
                          </p>
                          <p className="text-gray-600">
                            {addressData.street || addressData.address || ''}
                            {addressData.city ? `, ${addressData.city}` : ''}
                            {addressData.landmark ? `, ${addressData.landmark}` : ''}
                          </p>
                          <p className="text-gray-600">
                            {addressData.state || ''}
                            {addressData.state && (addressData.zipCode || addressData.pinCode) ? ' - ' : ''}
                            {addressData.zipCode || addressData.pinCode || ''}
                          </p>
                          <p className="text-gray-600 mt-1">
                            Phone: {addressData.phoneNumber || addressData.phone || shipmentDetails.user?.phone || 'N/A'}
                          </p>
                          {addressData.email && (
                            <p className="text-gray-600">
                              Email: {addressData.email}
                            </p>
                          )}
                        </>
                      );
                    })()}
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
import React, { useState, useEffect } from 'react';
import { FaShippingFast, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaBoxes, FaTruck, FaHome, FaBox } from 'react-icons/fa';
import { updateOrderTrackingInfo } from '../../Apis/tracking';

const ShipmentStatusModal = ({ order, onClose, onStatusUpdated }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.shipmentStatus || 'Pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  
  // Update selectedStatus when order changes
  useEffect(() => {
    setSelectedStatus(order.shipmentStatus || 'Pending');
  }, [order]);
  
  const statusOptions = [
    'Pending',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Delivered Early',
    'Returning',
    'Returned',
    'Cancelled'
  ];
  
  // Define the status progression for validation on the frontend
  const statusProgression = [
    'Pending',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Delivered Early'
  ];

  // Special statuses that can be set at any point
  const specialStatuses = ['Returning', 'Returned', 'Cancelled'];
  
  // Status icons and colors for visual representation
  const statusInfo = {
    'Pending': { icon: FaBox, color: 'text-gray-500', bgColor: 'bg-gray-100' },
    'Processing': { icon: FaBoxes, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    'Shipped': { icon: FaShippingFast, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    'Out for Delivery': { icon: FaTruck, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'Delivered': { icon: FaHome, color: 'text-green-600', bgColor: 'bg-green-100' },
    'Delivered Early': { icon: FaHome, color: 'text-green-800', bgColor: 'bg-green-100' },
    'Returning': { icon: FaTruck, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    'Returned': { icon: FaBoxes, color: 'text-orange-800', bgColor: 'bg-orange-100' },
    'Cancelled': { icon: FaExclamationTriangle, color: 'text-red-600', bgColor: 'bg-red-100' }
  };
  
  // Check if selected status is a valid progression
  const isValidProgression = () => {
    // Special statuses can always be selected
    if (specialStatuses.includes(selectedStatus)) {
      return true;
    }
    
    const currentIndex = statusProgression.indexOf(order.shipmentStatus || 'Pending');
    const newIndex = statusProgression.indexOf(selectedStatus);
    
    // Allow if status is the same or moving forward
    return currentIndex === -1 || newIndex >= currentIndex;
  };
  
  const handleStatusChange = async () => {
    setIsUpdating(true);
    setError(null);
    
    console.log('Updating status for order:', order._id);
    console.log('New status:', selectedStatus);
    console.log('Current status:', order.shipmentStatus);
    
    // Client-side validation to match server-side rules
    if (!isValidProgression()) {
      setError(`Cannot change shipment status from '${order.shipmentStatus}' to '${selectedStatus}'. Status can only move forward in the shipping process.`);
      setIsUpdating(false);
      return;
    }
    
    try {
      const result = await updateOrderTrackingInfo(order._id, {
        shipmentStatus: selectedStatus
      });
      
      console.log('API response:', result);
      
      if (result.success) {
        console.log('Status update successful. Updated order:', result.order);
        if (typeof onStatusUpdated === 'function') {
          console.log('Calling onStatusUpdated with order:', result.order);
          onStatusUpdated(result.order);
        } else {
          console.warn('onStatusUpdated is not a function');
        }
        onClose();
      } else {
        console.error('Status update failed:', result.message);
        setError(result.message || 'Failed to update shipment status');
      }
    } catch (err) {
      setError('An error occurred while updating shipment status');
      console.error('Error updating shipment status:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Get the current status info
  const currentStatusInfo = statusInfo[order.shipmentStatus || 'Pending'];
  const selectedStatusInfo = statusInfo[selectedStatus];
  const CurrentStatusIcon = currentStatusInfo?.icon || FaBox;
  const SelectedStatusIcon = selectedStatusInfo?.icon || FaBox;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold flex items-center">
            <FaShippingFast className="mr-2 text-yellow-600" />
            Update Shipment Status
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Order ID
            </label>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {order.orderId || order._id}
            </div>
          </div>
          
          {/* Visual representation of status change */}
          <div className="mb-6 flex items-center justify-center">
            <div className={`p-4 rounded-lg flex flex-col items-center ${currentStatusInfo?.bgColor || 'bg-gray-100'}`}>
              <CurrentStatusIcon className={`text-2xl ${currentStatusInfo?.color || 'text-gray-500'}`} />
              <span className="mt-1 text-sm font-medium">{order.shipmentStatus || 'Pending'}</span>
            </div>
            
            <FaArrowRight className="mx-4 text-gray-400" />
            
            <div className={`p-4 rounded-lg flex flex-col items-center ${selectedStatusInfo?.bgColor || 'bg-gray-100'}`}>
              <SelectedStatusIcon className={`text-2xl ${selectedStatusInfo?.color || 'text-gray-500'}`} />
              <span className="mt-1 text-sm font-medium">{selectedStatus}</span>
            </div>
          </div>
          
          {/* Status progression visualization */}
          <div className="mb-6">
            <div className="relative mb-6 mt-4">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
              <div className="flex justify-between relative">
                {statusProgression.map((status, index) => {
                  // Current status index and selected status index
                  const currentIdx = statusProgression.indexOf(order.shipmentStatus || 'Pending');
                  const selectedIdx = statusProgression.indexOf(selectedStatus);
                  
                  // If this status is the current, passed, or future selected status
                  const isPassed = currentIdx >= index;
                  const isSelected = selectedIdx >= index && !specialStatuses.includes(selectedStatus);
                  const isActive = isPassed || isSelected;
                  
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 ${
                          isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs mt-1 whitespace-nowrap">
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={isUpdating}
            >
              {statusOptions.map((status) => {
                const statusIdx = statusProgression.indexOf(status);
                const currentIdx = statusProgression.indexOf(order.shipmentStatus || 'Pending');
                const isValid = specialStatuses.includes(status) || statusIdx === -1 || currentIdx === -1 || statusIdx >= currentIdx;
                
                return (
                  <option 
                    key={status} 
                    value={status} 
                    className={!isValid ? 'text-gray-400' : ''}
                  >
                    {status} {!isValid ? '(cannot select - backward movement)' : ''}
                  </option>
                );
              })}
            </select>
            
            {!isValidProgression() && (
              <p className="mt-1 text-xs text-amber-600">
                <FaExclamationTriangle className="inline mr-1" />
                This status is behind the current status in the shipping process. It cannot be selected.
              </p>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleStatusChange}
            disabled={isUpdating || selectedStatus === order.shipmentStatus || !isValidProgression()}
            className={`px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center ${
              isUpdating || selectedStatus === order.shipmentStatus || !isValidProgression() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUpdating ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-2" />
                Update Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentStatusModal;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../Apis/product_api';
import { 
  createShipment, 
  updateOrderTrackingInfo, 
} from '../../Apis/tracking';
import { 
  FaShippingFast, 
  FaCheck, 
  FaTruck, 
  FaTimes, 
  FaSpinner,
  FaSearch,
  FaFilter,
  FaBarcode,
  FaEye,
  FaPrint,
  FaFileInvoice,
  FaClipboardCheck,
  FaBoxOpen
} from 'react-icons/fa';
import ShipmentDetailsModal from './ShipmentDetailsModal';
import ShipmentStatusModal from './ShipmentStatusModal';
import ShipmentStatusBadge from './ShipmentStatusBadge';

const AdminShipments = () => {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackingInfo, setTrackingInfo] = useState({
    awbNumber: '',
    shipmentId: '',
    courier: ''
  });
  const [viewShipmentDetails, setViewShipmentDetails] = useState(null); // For viewing shipment details
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null); // For updating status
  
  // Set tracking info when an order is selected for updating
  useEffect(() => {
    if (selectedOrder) {
      setTrackingInfo({
        awbNumber: selectedOrder.awbNumber || '',
        shipmentId: selectedOrder.shipmentId || '',
        courier: selectedOrder.courier || ''
      });
    }
  }, [selectedOrder]);
  
  // Fetch orders from backend - wrapped in useCallback to avoid infinite re-renders
  const fetchOrders = React.useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      setError(null);
      const result = await getAllOrders();
      if (result.success) {
        console.log('Orders fetched successfully:', result.data.orders);
        const ordersData = result.data.orders || [];
        setOrders(ordersData);
        const filteredData = applyFilters(ordersData, searchTerm, statusFilter);
        setFilteredOrders(filteredData);
      } else {
        setError(result.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [searchTerm, statusFilter]);
  
  // Apply filters to orders
  const applyFilters = (ordersList, search, status) => {
    // Make sure we're working with a proper array
    let filtered = Array.isArray(ordersList) ? [...ordersList] : [];
    
    console.log('Applying filters to orders:', filtered);
    
    // Apply search term filter
    if (search) {
      filtered = filtered.filter(order => 
        order._id?.toLowerCase().includes(search.toLowerCase()) || 
        order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        order.awbNumber?.toLowerCase().includes(search.toLowerCase()) ||
        order.shipmentId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      if (status === 'shipped') {
        filtered = filtered.filter(order => order.awbNumber);
      } else if (status === 'unshipped') {
        filtered = filtered.filter(order => !order.awbNumber && !order.shipmentId);
      } else if (status === 'processing') {
        filtered = filtered.filter(order => 
          order.shipmentId && !order.awbNumber && order.shipmentStatus === 'Processing'
        );
      } else if (status === 'paid') {
        filtered = filtered.filter(order => 
          order.paymentInfo && order.paymentInfo.status === 'Paid'
        );
      }
    }
    
    console.log('Filtered orders after applying filters:', filtered);
    return filtered;
  };
  
  // Create shipment for an order
  const handleCreateShipment = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      setError(null);
      
      const result = await createShipment(orderId);
      if (result.success) {
        const hasInvoice = result.shipment?.invoice_url;
        const message = hasInvoice 
          ? 'Shipment created successfully! You can view the invoice now.' 
          : 'Shipment created successfully!';
        
        if (hasInvoice) {
          // Show confirmation with option to view invoice
          const viewInvoice = window.confirm(`${message}\n\nWould you like to view the invoice?`);
          if (viewInvoice) {
            window.open(result.shipment.invoice_url, '_blank');
          }
        } else {
          alert(message);
        }
        
        fetchOrders(); // Refresh orders
      } else {
        setError(result.message || 'Failed to create shipment');
      }
    } catch (err) {
      setError('An error occurred while creating shipment');
      console.error('Error creating shipment:', err);
    } finally {
      setProcessingOrderId(null);
    }
  };
  
  // Handle the form submission for updating tracking info manually
  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setProcessingOrderId(selectedOrder._id); // Show loading indicator
      
      // Prepare tracking info with shipment status if not already set
      const updatedTrackingInfo = {
        ...trackingInfo,
        // Set to Shipped if not already set and awbNumber is provided
        shipmentStatus: trackingInfo.shipmentStatus || 
                       (trackingInfo.awbNumber ? 'Shipped' : selectedOrder.shipmentStatus || 'Processing')
      };
      
      console.log('Updating tracking info:', updatedTrackingInfo);
      
      const result = await updateOrderTrackingInfo(selectedOrder._id, updatedTrackingInfo);
      if (result.success) {
        alert('Tracking information updated successfully!');
        fetchOrders(); // Refresh orders
        setSelectedOrder(null); // Close modal
        // Reset tracking info for next use
        setTrackingInfo({
          awbNumber: '',
          shipmentId: '',
          courier: ''
        });
      } else {
        setError(result.message || 'Failed to update tracking information');
      }
    } catch (err) {
      setError('An error occurred while updating tracking information');
      console.error('Error updating tracking:', err);
    } finally {
      setProcessingOrderId(null); // Clear loading indicator
    }
  };
  
  // Handle shipment status update
  const handleStatusUpdate = (updatedOrder) => {
    console.log('handleStatusUpdate called with order:', updatedOrder);
    setUpdateStatusOrder(null);
    
    if (!updatedOrder || !updatedOrder._id) {
      console.error('Invalid updated order received:', updatedOrder);
      return;
    }
    
    // Get a fresh list of orders - this is more reliable
    fetchOrders().then(() => {
      console.log('Orders refreshed after status update');
    }).catch(err => {
      console.error('Error refreshing orders after status update:', err);
      
      // Fallback: Try to update locally if API fetch fails
      const updatedOrders = orders.map(order => {
        if (order._id === updatedOrder._id) {
          // Create a new merged order object
          return {
            ...order,
            ...updatedOrder,
            shipmentStatus: updatedOrder.shipmentStatus || order.shipmentStatus || 'Pending'
          };
        }
        return order;
      });
      
      console.log('Updated orders list (fallback):', updatedOrders);
      setOrders(updatedOrders);
      const filtered = applyFilters(updatedOrders, searchTerm, statusFilter);
      setFilteredOrders(filtered);
    });
  };
  
  // Check auth status and fetch orders on mount
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn || user?.userType !== "admin") {
        navigate("/admin/login");
      } else {
        fetchOrders();
      }
    }
  }, [loading, isLoggedIn, user, navigate, fetchOrders]);
  
  // Update filtered orders when filters change
  useEffect(() => {
    console.log('Filters changed, re-applying filters to orders');
    const filtered = applyFilters(orders, searchTerm, statusFilter);
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);
  
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 sm:text-2xl">Shipment Management</h2>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or AWB"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              >
                <option value="all">All Orders</option>
                <option value="shipped">Shipped</option>
                <option value="processing">Processing</option>
                <option value="unshipped">Not Shipped</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-red-700">
          <p className="flex items-center">
            <FaTimes className="mr-2" />
            {error}
          </p>
        </div>
      )}
      
      {/* Loading State */}
      {isLoadingOrders ? (
        <div className="flex items-center justify-center p-8">
          <FaSpinner className="animate-spin text-yellow-600 mr-2" />
          <span>Loading orders...</span>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderId || order._id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.orderItems?.length || 0} item(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.paymentInfo?.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentInfo?.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.totalAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.awbNumber ? (
                          <div>
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <FaBarcode className="mr-1 text-gray-500" />
                              {order.awbNumber}
                            </div>
                            {order.courier && (
                              <div className="text-xs text-gray-500">
                                {order.courier}
                              </div>
                            )}
                            <div className="mt-1">
                              <ShipmentStatusBadge status={order.shipmentStatus || 'Pending'} />
                            </div>
                            {/* Status progression visualization */}
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              {(() => {
                                // Define the status progression percentages
                                const progressMap = {
                                  'Pending': 10,
                                  'Processing': 25,
                                  'Shipped': 50,
                                  'Out for Delivery': 75,
                                  'Delivered': 100,
                                  'Delivered Early': 100,
                                  'Returning': 50,
                                  'Returned': 75,
                                  'Cancelled': 100
                                };
                                
                                const status = order.shipmentStatus || 'Pending';
                                const progressPercent = progressMap[status] || 0;
                                
                                const getStatusColor = (status) => {
                                  if (status.includes('Delivered')) return 'bg-green-500';
                                  if (status === 'Out for Delivery') return 'bg-blue-500';
                                  if (status === 'Shipped') return 'bg-yellow-500';
                                  if (status === 'Processing') return 'bg-indigo-500';
                                  if (status === 'Returning' || status === 'Returned') return 'bg-orange-500';
                                  if (status === 'Cancelled') return 'bg-red-500';
                                  return 'bg-gray-500';
                                };
                                
                                return (
                                  <div 
                                    className={`h-full ${getStatusColor(status)}`} 
                                    style={{ width: `${progressPercent}%` }}
                                  ></div>
                                );
                              })()}
                            </div>
                            
                            {/* Invoice link */}
                            {order.invoiceUrl && order.paymentInfo?.status === 'Paid' && (
                              <div className="mt-1">
                                <a 
                                  href={order.invoiceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                  title="View invoice"
                                >
                                  <FaFileInvoice className="mr-1" /> 
                                  View Invoice
                                </a>
                              </div>
                            )}
                            {order.invoiceUrl && order.paymentInfo?.status !== 'Paid' && (
                              <div className="mt-1">
                                <span 
                                  className="flex items-center text-xs text-gray-500 cursor-not-allowed"
                                  title="Invoice will be available once payment is confirmed"
                                >
                                  <FaFileInvoice className="mr-1" /> 
                                  Invoice pending
                                </span>
                              </div>
                            )}
                          </div>
                        ) : order.shipmentId ? (
                          <div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">Shipment ID:</span> {order.shipmentId.substring(0, 8)}...
                            </div>
                            <div className="mt-1">
                              <ShipmentStatusBadge status={order.shipmentStatus || 'Processing'} />
                            </div>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: '25%' }}></div>
                            </div>
                            <div className="text-xs text-amber-600 mt-1">
                              AWB pending assignment
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-sm text-gray-500">Not shipped</span>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full bg-gray-400" style={{ width: '10%' }}></div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!order.awbNumber && !order.shipmentId ? (
                          <button
                            onClick={() => handleCreateShipment(order._id)}
                            disabled={processingOrderId === order._id}
                            className={`inline-flex items-center px-3 py-1 rounded-md ${
                              processingOrderId === order._id
                                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {processingOrderId === order._id ? (
                              <>
                                <FaSpinner className="animate-spin mr-1" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaShippingFast className="mr-1" />
                                Ship
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setViewShipmentDetails(order)}
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                title="View shipment details"
                              >
                                <FaEye className="mr-1" />
                                View
                              </button>
                              
                              <button
                                onClick={() => setUpdateStatusOrder(order)}
                                className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                title="Update shipment status"
                              >
                                <FaClipboardCheck className="mr-1" />
                                Status
                              </button>
                              
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                title="Update tracking information"
                              >
                                <FaTruck className="mr-1" />
                                {order.shipmentId && !order.awbNumber ? 'Add AWB' : 'Track'}
                              </button>
                              
                              {order.invoiceUrl && order.paymentInfo?.status === 'Paid' && (
                                <a
                                  href={order.invoiceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                  title="View invoice"
                                >
                                  <FaFileInvoice className="mr-1" />
                                  Invoice
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {filteredOrders.length === 0 && !isLoadingOrders && (
              <div className="text-center py-10">
                <FaShippingFast className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'There are no orders to display'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Manual Tracking Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Update Tracking Information</h3>
            <form onSubmit={handleUpdateTracking}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={selectedOrder._id}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AWB Number*
                  </label>
                  <input
                    type="text"
                    value={trackingInfo.awbNumber}
                    onChange={(e) => setTrackingInfo({...trackingInfo, awbNumber: e.target.value})}
                    required
                    placeholder="Enter AWB/tracking number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipment ID (optional)
                  </label>
                  <input
                    type="text"
                    value={trackingInfo.shipmentId}
                    onChange={(e) => setTrackingInfo({...trackingInfo, shipmentId: e.target.value})}
                    placeholder="Enter shipment ID (if available)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Courier (optional)
                  </label>
                  <input
                    type="text"
                    value={trackingInfo.courier}
                    onChange={(e) => setTrackingInfo({...trackingInfo, courier: e.target.value})}
                    placeholder="Enter courier name (if available)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center justify-center"
                  disabled={processingOrderId === selectedOrder._id}
                >
                  {processingOrderId === selectedOrder._id ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Update Tracking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      
      {/* Shipment Details Modal */}
      {viewShipmentDetails && (
        <ShipmentDetailsModal
          order={viewShipmentDetails}
          onClose={() => setViewShipmentDetails(null)}
          onStatusUpdated={handleStatusUpdate}
        />
      )}
      
      {/* Shipment Status Update Modal */}
      {updateStatusOrder && (
        <ShipmentStatusModal
          order={updateStatusOrder}
          onClose={() => setUpdateStatusOrder(null)}
          onStatusUpdated={handleStatusUpdate}
        />
      )}
    </div>
  );
};export default AdminShipments;
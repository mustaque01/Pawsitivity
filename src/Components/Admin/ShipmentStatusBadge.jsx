import React from 'react';
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaSpinner, 
  FaShippingFast, 
  FaUndoAlt, 
  FaTimesCircle
} from 'react-icons/fa';

const ShipmentStatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100 text-gray-800';
  let Icon = FaBox;
  
  // If status is null or undefined, default to "Pending"
  const currentStatus = status || 'Pending';
  
  switch (currentStatus) {
    case 'Pending':
      bgColor = 'bg-gray-100 text-gray-800';
      Icon = FaBox;
      break;
    case 'Processing':
      bgColor = 'bg-blue-100 text-blue-800';
      Icon = FaSpinner;
      break;
    case 'Shipped':
      bgColor = 'bg-indigo-100 text-indigo-800';
      Icon = FaShippingFast;
      break;
    case 'Out for Delivery':
      bgColor = 'bg-orange-100 text-orange-800';
      Icon = FaTruck;
      break;
    case 'Delivered':
      bgColor = 'bg-green-100 text-green-800';
      Icon = FaCheckCircle;
      break;
    case 'Delivered Early':
      bgColor = 'bg-emerald-100 text-emerald-800';
      Icon = FaCheckCircle;
      break;
    case 'Returning':
      bgColor = 'bg-amber-100 text-amber-800';
      Icon = FaUndoAlt;
      break;
    case 'Returned':
      bgColor = 'bg-red-100 text-red-800';
      Icon = FaUndoAlt;
      break;
    case 'Cancelled':
      bgColor = 'bg-red-100 text-red-800';
      Icon = FaTimesCircle;
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
      Icon = FaBox;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      <Icon className="mr-1" />
      {currentStatus}
    </span>
  );
};

export default ShipmentStatusBadge;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../services/orderService';
import { getPaymentByOrderId, updatePaymentStatus } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Package, Check, Truck, X } from 'lucide-react';

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  Product: {
    name: string;
    image_url: string;
    size?: string;
    color?: string;
  };
}

interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: string;
  tracking_number?: string;
  expected_delivery_date?: string;
  createdAt: string;
  updatedAt: string;
  OrderItems: OrderItem[];
}

interface Payment {
  payment_id: number;
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Edit fields
  const [trackingNumber, setTrackingNumber] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  
  const { token } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id || !token) return;
      
      try {
        const orderData = await getOrderById(token, parseInt(id));
        setOrder(orderData);
        setNewStatus(orderData.status);
        
        // Also set tracking number if it exists
        if (orderData.tracking_number) {
          setTrackingNumber(orderData.tracking_number);
        }
        
        try {
          const paymentData = await getPaymentByOrderId(token, parseInt(id));
          setPayment(paymentData);
          setNewPaymentStatus(paymentData.status);
        } catch (paymentError) {
          console.error('Error fetching payment details:', paymentError);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, token]);
  
  const handleUpdateOrder = async () => {
    if (!order || !token) return;
    
    setIsUpdating(true);
    setSuccessMessage('');
    
    try {
      // Update order status
      if (newStatus !== order.status) {
        await updateOrderStatus(token, order.order_id, newStatus);
      }
      
      // Update payment status if changed
      if (payment && newPaymentStatus !== payment.status) {
        await updatePaymentStatus(token, payment.payment_id, newPaymentStatus);
      }
      
      // Update the order object with new values
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: newStatus,
          payment_status: newPaymentStatus,
          tracking_number: trackingNumber || prev.tracking_number,
        };
      });
      
      // Update payment object
      if (payment) {
        setPayment(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: newPaymentStatus,
          };
        });
      }
      
      setSuccessMessage('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Order not found'}</h2>
        <button
          onClick={() => navigate('/admin/orders')}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h1>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${
            order.status.toLowerCase() === 'delivered' ? 'green' : 
            order.status.toLowerCase() === 'shipped' ? 'blue' : 
            order.status.toLowerCase() === 'cancelled' ? 'red' : 'yellow'
          }-100 text-${
            order.status.toLowerCase() === 'delivered' ? 'green' : 
            order.status.toLowerCase() === 'shipped' ? 'blue' : 
            order.status.toLowerCase() === 'cancelled' ? 'red' : 'yellow'
          }-800`}>
            {order.status}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${
            order.payment_status.toLowerCase() === 'paid' ? 'green' : 
            order.payment_status.toLowerCase() === 'failed' ? 'red' : 'yellow'
          }-100 text-${
            order.payment_status.toLowerCase() === 'paid' ? 'green' : 
            order.payment_status.toLowerCase() === 'failed' ? 'red' : 'yellow'
          }-800`}>
            {order.payment_status}
          </span>
        </div>
      </div>
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.OrderItems.map((item) => (
                    <tr key={`${order.order_id}-${item.product_id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={item.Product.image_url || 'https://images.pexels.com/photos/5935738/pexels-photo-5935738.jpeg'} 
                              alt={item.Product.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.Product.name}</div>
                            <div className="text-xs text-gray-500">
                              {[
                                item.Product.size && `Size: ${item.Product.size}`,
                                item.Product.color && `Color: ${item.Product.color}`
                              ].filter(Boolean).join(' | ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(parseFloat(item.price.toString()))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Subtotal
                    </th>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(parseFloat(order.total_amount.toString()) * 0.82)}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Shipping
                    </th>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(order.total_amount.toString()) > 1000 ? 'Free' : formatPrice(99)}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Tax (18%)
                    </th>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(parseFloat(order.total_amount.toString()) * 0.18)}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Total
                    </th>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatPrice(parseFloat(order.total_amount.toString()))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Update Order Status */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Update Order</h2>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Order Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="placed">Placed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="payment-status" className="block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>
                  <select
                    id="payment-status"
                    name="payment-status"
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="tracking" className="block text-sm font-medium text-gray-700">
                    Tracking Number
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="tracking"
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                      placeholder="Enter tracking number"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleUpdateOrder}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Info Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="mt-1 text-sm text-gray-900">
                <p className="font-medium">Customer ID: {order.user_id}</p>
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">#{order.order_id}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Date Placed</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.payment_method}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatPrice(parseFloat(order.total_amount.toString()))}</dd>
                </div>
                {order.tracking_number && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.tracking_number}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Shipping Info */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-900 whitespace-pre-line">
                {order.shipping_address}
              </p>
            </div>
          </div>
          
          {/* Payment Info */}
          {payment && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">#{payment.payment_id}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">{payment.payment_method}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatPrice(parseFloat(payment.amount.toString()))}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">{payment.status}</dd>
                  </div>
                  {payment.transaction_id && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{payment.transaction_id}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setNewStatus('shipped');
                    handleUpdateOrder();
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                  disabled={order.status !== 'placed' || isUpdating}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Mark as Shipped
                </button>
                
                <button
                  onClick={() => {
                    setNewStatus('delivered');
                    handleUpdateOrder();
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
                  disabled={order.status !== 'shipped' || isUpdating}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Delivered
                </button>
                
                <button
                  onClick={() => {
                    setNewStatus('cancelled');
                    handleUpdateOrder();
                  }}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                  disabled={order.status === 'delivered' || order.status === 'cancelled' || isUpdating}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
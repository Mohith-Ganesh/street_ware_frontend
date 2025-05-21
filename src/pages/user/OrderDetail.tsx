import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import { getPaymentByOrderId } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Package, TruckIcon, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

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
  
  const { token } = useAuth();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id || !token) return;
      
      try {
        const orderData = await getOrderById(token, parseInt(id));
        setOrder(orderData);
        
        try {
          const paymentData = await getPaymentByOrderId(token, parseInt(id));
          setPayment(paymentData);
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
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'Your order has been received and is being processed';
      case 'shipped':
        return 'Your order is on its way to you';
      case 'delivered':
        return 'Your order has been delivered';
      case 'cancelled':
        return 'Your order has been cancelled';
      default:
        return 'Order status unknown';
    }
  };
  
  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Order not found'}</h2>
          <Link 
            to="/orders" 
            className="inline-flex items-center text-black hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  const currentStep = getStatusStep(order.status);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 flex items-center">
          <Link
            to="/orders"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Header */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      Order #{order.order_id}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-600 mb-6">
                  {getStatusDescription(order.status)}
                </p>
                
                {/* Order Timeline */}
                {order.status.toLowerCase() !== 'cancelled' && (
                  <div className="relative">
                    <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${(currentStep / 3) * 100}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-500"
                      ></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className={`text-center relative ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
                        <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= 1 ? 'bg-black text-white' : 'border border-gray-300'}`}>
                          1
                        </div>
                        <div className="text-xs">Order Placed</div>
                      </div>
                      
                      <div className={`text-center relative ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
                        <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= 2 ? 'bg-black text-white' : 'border border-gray-300'}`}>
                          2
                        </div>
                        <div className="text-xs">Shipped</div>
                      </div>
                      
                      <div className={`text-center relative ${currentStep >= 3 ? 'text-black' : 'text-gray-400'}`}>
                        <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= 3 ? 'bg-black text-white' : 'border border-gray-300'}`}>
                          3
                        </div>
                        <div className="text-xs">Delivered</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ordered Items */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {order.OrderItems?.map((item) => (
                  <li key={`${order.order_id}-${item.product_id}`} className="px-4 py-4 sm:px-6 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.Product.image_url || 'https://images.pexels.com/photos/5935738/pexels-photo-5935738.jpeg'}
                        alt={item.Product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.Product.name}
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity} × {formatPrice(parseFloat(item.price.toString()))}
                        </p>
                        
                        {/* Size and Color */}
                        {(item.Product.size || item.Product.color) && (
                          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                            {item.Product.size && <span>Size: {item.Product.size}</span>}
                            {item.Product.color && (
                              <>
                                {item.Product.size && <span>•</span>}
                                <span>Color: {item.Product.color}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">{formatPrice(parseFloat(order.total_amount.toString()) * 0.82)}</p>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-gray-900">
                    {parseFloat(order.total_amount.toString()) > 20 ? 'Free' : formatPrice(99)}
                  </p>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <p className="text-gray-600">Tax (18%)</p>
                  <p className="font-medium text-gray-900">{formatPrice(parseFloat(order.total_amount.toString()) * 0.18)}</p>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatPrice(parseFloat(order.total_amount.toString()))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar with Payment & Shipping */}
          <div className="space-y-8">
            {/* Payment Info */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="mt-1 text-sm text-gray-900">{order.payment_method}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Status</p>
                    <p className="mt-1 text-sm text-gray-900">{order.payment_status}</p>
                  </div>
                  
                  {payment && payment.transaction_id && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                      <p className="mt-1 text-sm text-gray-900">{payment.transaction_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Shipping Info */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                      {order.shipping_address}
                    </p>
                  </div>
                  
                  {order.tracking_number && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                      <p className="mt-1 text-sm text-gray-900">{order.tracking_number}</p>
                    </div>
                  )}
                  
                  {order.expected_delivery_date && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expected Delivery</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(order.expected_delivery_date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Help & Support */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Need Help?</h2>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    If you have any questions or issues with your order, please contact our customer support.
                  </p>
                  
                  <div className="space-y-2">
                    <button
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                    >
                      Contact Support
                    </button>
                    
                    <button
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Request Return
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
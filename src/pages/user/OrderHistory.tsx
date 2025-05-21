import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { Package, ArrowRight, Clock } from 'lucide-react';

interface Order {
  order_id: number;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  createdAt: string;
  updatedAt: string;
  OrderItems: Array<{
    product_id: number;
    quantity: number;
    price: number;
    Product: {
      name: string;
      image_url: string;
    };
  }>;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        const data = await getOrders(token);
        // Sort by most recent first
        const sortedOrders = [...data].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [token]);
  
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
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.order_id}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.payment_method}
                    </p>
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  <ul className="divide-y divide-gray-200">
                    {order.OrderItems.map((item) => (
                      <li key={`${order.order_id}-${item.product_id}`} className="py-4 flex">
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
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Total: <span className="font-bold text-gray-900">{formatPrice(parseFloat(order.total_amount.toString()))}</span>
                    </p>
                  </div>
                  <Link
                    to={`/orders/${order.order_id}`}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Order Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
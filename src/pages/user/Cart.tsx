import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, isLoading, updateItem, removeItem, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  
  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantities({
      ...quantities,
      [cartItemId]: newQuantity
    });
    
    updateItem(cartItemId, newQuantity);
  };
  
  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-gray-500">Please sign in to view your cart</p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6 lg:mb-0">
              <ul role="list" className="divide-y divide-gray-200">
                {cart.CartItems.map((item) => (
                  <li key={item.cart_item_id} className="p-4 sm:p-6 flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mb-4 sm:mb-0">
                      <img
                        src={item.Product?.image_url || 'https://images.pexels.com/photos/5935738/pexels-photo-5935738.jpeg'}
                        alt={item.Product?.name || 'Product'}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="sm:ml-6 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/products/${item.product_id}`}>
                              {item.Product?.name || 'Product'}
                            </Link>
                          </h3>
                          <p className="ml-4 text-lg font-medium text-gray-900">
                            {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatPrice(parseFloat(item.price.toString()))} each
                        </p>
                        
                        {/* Size and Color */}
                        {(item.Product?.size || item.Product?.color) && (
                          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                            {item.Product?.size && <span>Size: {item.Product.size}</span>}
                            {item.Product?.color && (
                              <>
                                {item.Product?.size && <span>•</span>}
                                <span>Color: {item.Product.color}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        {/* Quantity Control */}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 border border-gray-300 rounded-l-md focus:outline-none disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantities[item.cart_item_id] || item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1) {
                                handleQuantityChange(item.cart_item_id, val);
                              }
                            }}
                            className="w-12 text-center border-t border-b border-gray-300 focus:outline-none py-1"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded-r-md focus:outline-none"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <Link
                  to="/products"
                  className="flex items-center text-indigo-600 hover:text-indigo-500"
                >
                  <ArrowRight className="h-5 w-5 mr-2 transform rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 shadow-sm rounded-lg overflow-hidden p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(totalPrice)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">
                    {totalPrice > 20 ? 'Free' : formatPrice(99)}
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(totalPrice * 0.18)}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatPrice(totalPrice + (totalPrice > 20 ? 0 : 99) + (totalPrice * 0.18))}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                >
                  Proceed to Checkout
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Free shipping on orders over $20</p>
                <p className="mt-1">Taxes calculated at checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
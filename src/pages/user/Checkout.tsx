import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkout } from '../../services/cartService';
import { createPayment } from '../../services/paymentService';

const Checkout = () => {
  const { cart, totalPrice, clearCartItems } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    paymentMethod: 'COD',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    
    if (formData.paymentMethod === 'CARD') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvv) newErrors.cardCvv = 'CVV is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !cart || !token) return;
    
    setIsLoading(true);
    
    try {
      const shippingAddress = `${formData.fullName}, ${formData.addressLine1}, ${formData.addressLine2 ? formData.addressLine2 + ', ' : ''}${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.phoneNumber}`;
      
      // Place order
      const orderResponse = await checkout(token, cart.cart_id, formData.paymentMethod, shippingAddress);
      
      // Create payment record
      if (orderResponse.order_id) {
        await createPayment(
          token,
          orderResponse.order_id,
          orderResponse.total_amount,
          formData.paymentMethod
        );
        
        setOrderId(orderResponse.order_id);
        setOrderPlaced(true);
        clearCartItems();

        navigate(`/payment/${orderResponse.order_id}`, {
          state: {
            amount: orderResponse.total_amount,
            paymentMethod: formData.paymentMethod,
          },
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Successfully Placed!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-600">Order Number: <span className="font-medium text-gray-900">{orderId}</span></p>
          </div>
          
          <div className="space-x-4">
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              View Order
            </button>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                          errors.addressLine1 ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.addressLine1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
                      )}
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:ring-black focus:border-black"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                          errors.city ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                          errors.state ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                          errors.postalCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                      )}
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                          errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="payment-cod"
                        name="paymentMethod"
                        type="radio"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <label htmlFor="payment-cod" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="payment-card"
                        name="paymentMethod"
                        type="radio"
                        value="CARD"
                        checked={formData.paymentMethod === 'CARD'}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <label htmlFor="payment-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit / Debit Card
                      </label>
                    </div>
                    
                    {formData.paymentMethod === 'CARD' && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-4">
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                                errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.cardNumber && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                            )}
                          </div>
                          
                          <div className="sm:col-span-1">
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                              Expiry
                            </label>
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                                errors.cardExpiry ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.cardExpiry && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                            )}
                          </div>
                          
                          <div className="sm:col-span-1">
                            <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700">
                              CVV
                            </label>
                            <input
                              type="password"
                              id="cardCvv"
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              placeholder="123"
                              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-black focus:border-black ${
                                errors.cardCvv ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.cardCvv && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardCvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="divide-y divide-gray-200">
                  {cart?.CartItems?.map((item) => (
                    <div key={item.cart_item_id} className="py-4 flex">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.Product?.image_url || 'https://images.pexels.com/photos/5935738/pexels-photo-5935738.jpeg'}
                          alt={item.Product?.name || 'Product'}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.Product?.name || 'Product'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium text-gray-900">{formatPrice(totalPrice)}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-2">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium text-gray-900">
                      {totalPrice > 20 ? 'Free' : formatPrice(99)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-2">
                    <p className="text-gray-600">Tax (18%)</p>
                    <p className="font-medium text-gray-900">{formatPrice(totalPrice * 0.18)}</p>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatPrice(totalPrice + (totalPrice > 20 ? 0 : 99) + (totalPrice * 0.18))}
                    </p>
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

export default Checkout;
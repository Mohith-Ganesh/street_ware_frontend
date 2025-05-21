import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react';

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  discounted_price: number | null;
  stock_quantity: number;
  image_url: string;
  size: string | null;
  color: string | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const data = await getProductById(parseInt(id));
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    addItem(product.product_id, quantity);
  };
  
  const incrementQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product not found'}</h2>
          <Link 
            to="/products" 
            className="inline-flex items-center text-black hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image_url || 'https://images.pexels.com/photos/5935738/pexels-photo-5935738.jpeg'}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="mb-4">
              {product.discounted_price ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900 mr-4">{formatPrice(product.discounted_price)}</span>
                  <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                  <span className="ml-4 px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    {Math.round((1 - product.discounted_price / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              )}
            </div>
            
            <div className="border-t border-gray-200 py-4">
              <p className="text-gray-700 mb-6">{product.description || 'No description available for this product.'}</p>
              
              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.size && (
                    <div>
                      <span className="font-medium text-gray-500">Size:</span> {product.size}
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <span className="font-medium text-gray-500">Color:</span> {product.color}
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-500">Availability:</span>{' '}
                    {product.stock_quantity > 0 ? (
                      <span className="text-green-600">In Stock ({product.stock_quantity} available)</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-l-md focus:outline-none disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= product.stock_quantity) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 text-center border-t border-b border-gray-300 focus:outline-none py-2"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="p-2 border border-gray-300 rounded-r-md focus:outline-none disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </button>
              </div>
            </div>
            
            {/* Shipping & Returns */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>Free standard shipping on orders over $20</p>
                <p>Free returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
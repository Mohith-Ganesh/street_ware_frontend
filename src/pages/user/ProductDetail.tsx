import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { ArrowLeft, MessageCircle } from 'lucide-react';

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
  const [error, setError] = useState('');
  
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
  
  const handleWhatsAppClick = () => {
    if (!product) return;
    
    const message = `Hi! I'm interested in the ${product.name} (Product ID: ${product.product_id}). Could you please provide more information?`;
    const phoneNumber = '+1234567890'; // Replace with your WhatsApp business number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
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
            
            <div className="mb-6">
              {product.discounted_price ? (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 mr-4">{formatPrice(product.discounted_price)}</span>
                  <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                  <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    {Math.round((1 - product.discounted_price / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              )}
            </div>
            
            <div className="border-t border-gray-200 py-6">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
              
              {/* Product Details */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <div className="grid grid-cols-1 gap-4 text-base">
                  {product.size && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-500">Size:</span> 
                      <span className="text-gray-900">{product.size}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-500">Color:</span> 
                      <span className="text-gray-900">{product.color}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-500">Availability:</span>
                    {product.stock_quantity > 0 ? (
                      <span className="text-green-600 font-medium">In Stock ({product.stock_quantity} available)</span>
                    ) : (
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* WhatsApp Contact Button */}
              <div className="space-y-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center px-8 py-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Contact us on WhatsApp
                </button>
                
                <p className="text-sm text-gray-500 text-center">
                  Get instant support and place your order directly through WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
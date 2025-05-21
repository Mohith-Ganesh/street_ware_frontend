import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: {
    product_id: number;
    name: string;
    price: number;
    discounted_price: number | null;
    image_url: string;
    size?: string;
    color?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated) {
      addItem(product.product_id, 1);
    } else {
      // Redirect to login or show login modal
      window.location.href = '/login';
    }
  };

  // Format price with INR currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative bg-white overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
      <Link to={`/products/${product.product_id}`}>
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 relative">
          <img
            src={product.image_url || 'https://images.pexels.com/photos/5935738/pexels-photo-5935738.jpeg'}
            alt={product.name}
            className="h-60 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 p-2 bg-black text-white rounded-full opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            title="Add to Cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center">
            {product.discounted_price ? (
              <>
                <span className="text-lg font-bold text-gray-900">{formatPrice(product.discounted_price)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            )}
          </div>
          
          {(product.size || product.color) && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              {product.size && <span>Size: {product.size}</span>}
              {product.color && <span>Color: {product.color}</span>}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
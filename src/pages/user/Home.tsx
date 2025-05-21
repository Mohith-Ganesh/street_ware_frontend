import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';

interface Product {
  product_id: number;
  name: string;
  price: number;
  discounted_price: number | null;
  image_url: string;
  size?: string;
  color?: string;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        // Get featured products (limit to 8)
        setFeaturedProducts(products.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-black text-white h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">WINTER COLLECTION 2025</h1>
          <p className="text-xl sm:text-2xl mb-8">Discover the latest trends in fashion</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none transition duration-150 ease-in-out"
          >
            Shop Now
          </Link>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative h-96 group overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg" 
                alt="Women's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold mb-4">Women</h3>
                  <Link 
                    to="/products" 
                    className="inline-block px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 group overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg" 
                alt="Men's Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold mb-4">Men</h3>
                  <Link 
                    to="/products" 
                    className="inline-block px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 group overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg" 
                alt="Accessories Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold mb-4">Accessories</h3>
                  <Link 
                    to="/products" 
                    className="inline-block px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link 
              to="/products" 
              className="flex items-center text-black hover:underline"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Winter Sale Up to 50% Off</h2>
              <p className="text-gray-300 mb-6">
                The biggest sale of the season is here. Refresh your wardrobe with the latest styles.
                Limited time offer.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none transition"
              >
                Shop the Sale
              </Link>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://res.cloudinary.com/dttnhad6r/image/upload/v1747852093/pexels-pixabay-325876_tqvrps.jpg" 
                alt="Summer Sale" 
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

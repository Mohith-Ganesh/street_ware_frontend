import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import { Search, Filter, X } from 'lucide-react';

interface Product {
  product_id: number;
  name: string;
  price: number;
  discounted_price: number | null;
  image_url: string;
  size?: string;
  color?: string;
  description?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    size: '',
    color: '',
    priceRange: '',
  });
  const [sortOption, setSortOption] = useState('');
  
  // Get unique sizes and colors for filter dropdowns
  const sizes = [...new Set(products.map(p => p.size).filter(Boolean))];
  const colors = [...new Set(products.map(p => p.color).filter(Boolean))];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    // Apply filters and search
    let result = [...products];
    
    // Search filter
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Size filter
    if (filters.size) {
      result = result.filter(p => p.size === filters.size);
    }
    
    // Color filter
    if (filters.color) {
      result = result.filter(p => p.color === filters.color);
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(p => {
        const price = p.discounted_price || p.price;
        return price >= min && (!max || price <= max);
      });
    }
    
    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case 'price-asc':
          result.sort((a, b) => (a.discounted_price || a.price) - (b.discounted_price || b.price));
          break;
        case 'price-desc':
          result.sort((a, b) => (b.discounted_price || b.price) - (a.discounted_price || a.price));
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, filters, sortOption]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      size: '',
      color: '',
      priceRange: '',
    });
    setSearchTerm('');
    setSortOption('');
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-full sm:w-auto">
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    id="size"
                    name="size"
                    value={filters.size}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                  >
                    <option value="">All Sizes</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    id="color"
                    name="color"
                    value={filters.color}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                  >
                    <option value="">All Colors</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                  >
                    <option value="">All Prices</option>
                    <option value="0-500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1,000</option>
                    <option value="1000-2000">₹1,000 - ₹2,000</option>
                    <option value="2000-5000">₹2,000 - ₹5,000</option>
                    <option value="5000-">Over ₹5,000</option>
                  </select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <label htmlFor="sortOption" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    id="sortOption"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                  >
                    <option value="">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-5 w-5 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Active filters */}
          {(filters.size || filters.color || filters.priceRange || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium">Active filters:</span>
              {filters.size && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Size: {filters.size}
                </span>
              )}
              {filters.color && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Color: {filters.color}
                </span>
              )}
              {filters.priceRange && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Price: {filters.priceRange === '5000-' ? 'Over ₹5,000' : `₹${filters.priceRange.replace('-', ' - ₹')}`}
                </span>
              )}
              {searchTerm && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
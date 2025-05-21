const API_URL = 'https://street-ware-backend.onrender.com';

const mockProducts = [
  {
    product_id: 1,
    name: "Classic White T-Shirt",
    description: "Essential cotton t-shirt in pure white",
    price: 599,
    discounted_price: 499,
    stock_quantity: 100,
    image_url: "https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg",
    size: "M",
    color: "White"
  },
  {
    product_id: 2,
    name: "Black Denim Jacket",
    description: "Timeless denim jacket in washed black",
    price: 2999,
    discounted_price: null,
    stock_quantity: 50,
    image_url: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
    size: "L",
    color: "Black"
  },
  {
    product_id: 3,
    name: "Pleated Midi Skirt",
    description: "Elegant pleated skirt in flowing fabric",
    price: 1499,
    discounted_price: 1299,
    stock_quantity: 75,
    image_url: "https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg",
    size: "S",
    color: "Beige"
  },
  {
    product_id: 4,
    name: "Slim Fit Chinos",
    description: "Classic chinos in comfortable cotton stretch",
    price: 1299,
    discounted_price: null,
    stock_quantity: 80,
    image_url: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg",
    size: "32",
    color: "Khaki"
  },
  {
    product_id: 5,
    name: "Floral Summer Dress",
    description: "Light and airy dress with floral print",
    price: 1999,
    discounted_price: 1599,
    stock_quantity: 45,
    image_url: "https://images.pexels.com/photos/12179283/pexels-photo-12179283.jpeg",
    size: "M",
    color: "Multicolor"
  },
  {
    product_id: 6,
    name: "Leather Crossbody Bag",
    description: "Compact leather bag with adjustable strap",
    price: 2499,
    discounted_price: null,
    stock_quantity: 30,
    image_url: "https://images.pexels.com/photos/5706273/pexels-photo-5706273.jpeg",
    size: null,
    color: "Brown"
  },
  {
    product_id: 7,
    name: "Striped Cotton Shirt",
    description: "Classic striped shirt in breathable cotton",
    price: 899,
    discounted_price: 799,
    stock_quantity: 60,
    image_url: "https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg",
    size: "L",
    color: "Blue"
  },
  {
    product_id: 8,
    name: "High-Waisted Jeans",
    description: "Flattering high-waisted jeans in dark wash",
    price: 1799,
    discounted_price: null,
    stock_quantity: 70,
    image_url: "https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg",
    size: "28",
    color: "Blue"
  }
];

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return response.json();
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    return mockProducts;
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    
    return response.json();
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    const product = mockProducts.find(p => p.product_id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
};

export const createProduct = async (token: string, productData: any) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create product');
  }
  
  return response.json();
};

export const updateProduct = async (token: string, id: number, productData: any) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update product');
  }
  
  return response.json();
};

export const deleteProduct = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product');
  }
  
  return response.json();
};

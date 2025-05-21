const API_URL = 'https://street-ware-backend.onrender.com';

export const getCart = async (token: string) => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    // If cart doesn't exist yet, create one
    if (response.status === 404) {
      return createCart(token);
    }
    throw new Error('Failed to fetch cart');
  }
  
  return response.json();
};

export const createCart = async (token: string) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create cart');
  }
  
  return response.json();
};

export const addToCart = async (token: string, productId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add item to cart');
  }
  
  return response.json();
};

export const removeFromCart = async (token: string, productId: number) => {
  const response = await fetch(`${API_URL}/cart/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove item from cart');
  }
  
  return response.json();
};

export const updateCartItem = async (token: string, cartItemId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ cart_item_id: cartItemId, quantity }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update cart item');
  }
  
  return response.json();
};

export const clearCart = async (token: string) => {
  const response = await fetch(`${API_URL}/cart/clear`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to clear cart');
  }
  
  return response.json();
};

export const checkout = async (token: string, cartId: number, paymentMethod: string, shippingAddress: string) => {
  const response = await fetch(`${API_URL}/cart/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      cart_id: cartId,
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Checkout failed');
  }
  
  return response.json();
};

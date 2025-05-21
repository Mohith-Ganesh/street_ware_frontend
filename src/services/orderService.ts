const API_URL = 'https://street-ware-backend.onrender.com';

export const getOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  return response.json();
};

export const getOrderById = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch order details');
  }
  
  return response.json();
};

export const updateOrderStatus = async (token: string, id: number, status: string) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update order status');
  }
  
  return response.json();
};

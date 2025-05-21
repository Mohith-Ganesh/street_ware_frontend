const API_URL = 'https://street-ware-backend.onrender.com';

export const createPayment = async (token: string, orderId: number, amount: number, paymentMethod: string) => {
  const response = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: orderId,
      amount,
      currency: 'USD',
      payment_method: paymentMethod,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create payment');
  }
  
  return response.json();
};

export const getPaymentByOrderId = async (token: string, orderId: number) => {
  const response = await fetch(`${API_URL}/payments/order/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch payment details');
  }
  
  return response.json();
};

export const updatePaymentStatus = async (token: string, paymentId: number, status: string) => {
  const response = await fetch(`${API_URL}/payments/${paymentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update payment status');
  }
  
  return response.json();
};

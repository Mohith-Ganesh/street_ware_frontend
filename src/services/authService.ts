const API_URL = 'https://street-ware-backend.onrender.com';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to log in');
  }
  
  return response.json();
};

export const signup = async (name: string, email: string, password: string, phone: string) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, phone }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to sign up');
  }
  
  return response.json();
};

export const adminLogin = async (email: string, password: string, secretKey: string) => {
  const response = await fetch(`${API_URL}/admin_signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, secretKey }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to log in as admin');
  }
  
  return response.json();
};

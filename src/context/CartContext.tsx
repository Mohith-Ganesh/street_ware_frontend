import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartItem {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  price: number;
  Product?: {
    name: string;
    image_url: string;
    size?: string;
    color?: string;
  };
}

interface Cart {
  cart_id: number;
  user_id: number;
  CartItems: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateItem: (cartItemId: number, quantity: number) => Promise<void>;
  clearCartItems: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    try {
      const cartData = await getCart(token);
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, token]);

  const handleAddItem = async (productId: number, quantity: number) => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    try {
      await addToCart(token, productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    try {
      await removeFromCart(token, productId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = async (cartItemId: number, quantity: number) => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    try {
      await updateCartItem(token, cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated || !token) return;
    
    setIsLoading(true);
    try {
      await clearCart(token);
      setCart(prev => prev ? { ...prev, CartItems: [] } : null);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = cart?.CartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  const totalPrice = cart?.CartItems?.reduce(
    (sum, item) => sum + (parseFloat(item.price.toString()) * item.quantity), 0
  ) || 0;

  const value = {
    cart,
    isLoading,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateItem: handleUpdateItem,
    clearCartItems: handleClearCart,
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login, signup, adminLogin } from '../services/authService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  adminLogin: (email: string, password: string, secretKey: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      setToken(storedToken);
      
      // Parse the JWT to get user info (without verification)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({
          id: payload.id,
          name: payload.name || 'User',
          email: payload.email || '',
          role: payload.role || 'user'
        });
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Parse the JWT to get user info
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser({
        id: payload.id,
        name: payload.name || 'User',
        email: payload.email || '',
        role: data.role || 'user'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (name: string, email: string, password: string, phone: string) => {
    setIsLoading(true);
    try {
      const data = await signup(name, email, password, phone);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Set default user info
      setUser({
        id: 0, // Will be updated once we fetch user details
        name,
        email,
        role: 'user'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (email: string, password: string, secretKey: string) => {
    setIsLoading(true);
    try {
      const data = await adminLogin(email, password, secretKey);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Parse the JWT to get user info
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser({
        id: payload.id,
        name: payload.name || 'Admin',
        email: payload.email || '',
        role: 'admin'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login: handleLogin,
    signup: handleSignup,
    adminLogin: handleAdminLogin,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
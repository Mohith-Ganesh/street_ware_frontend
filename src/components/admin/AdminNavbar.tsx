import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <ShoppingBag className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">STREET WEAR ADMIN</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user?.name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-300 hover:text-white"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

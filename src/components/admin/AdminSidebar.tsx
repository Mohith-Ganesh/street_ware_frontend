import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings } from 'lucide-react';

const AdminSidebar = () => {
  const linkClasses = "flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100";
  const activeLinkClasses = "flex items-center px-4 py-3 bg-gray-100 text-black font-medium";

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="py-6">
        <nav className="mt-5">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}
          >
            <ShoppingBag className="h-5 w-5 mr-3" />
            Products
          </NavLink>
          
          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}
          >
            <Package className="h-5 w-5 mr-3" />
            Orders
          </NavLink>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => isActive ? activeLinkClasses : linkClasses}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
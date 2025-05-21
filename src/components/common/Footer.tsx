import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">HELP</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white">Shop at STREETWEAR.com</Link></li>
              <li><Link to="/" className="hover:text-white">Product</Link></li>
              <li><Link to="/" className="hover:text-white">Payment</Link></li>
              <li><Link to="/" className="hover:text-white">Shipping</Link></li>
              <li><Link to="/" className="hover:text-white">Exchanges and Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">FOLLOW US</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white flex items-center"><Facebook className="w-4 h-4 mr-2" /> Facebook</a></li>
              <li><a href="#" className="hover:text-white flex items-center"><Instagram className="w-4 h-4 mr-2" /> Instagram</a></li>
              <li><a href="#" className="hover:text-white flex items-center"><Twitter className="w-4 h-4 mr-2" /> Twitter</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">COMPANY</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white">About Us</Link></li>
              <li><Link to="/" className="hover:text-white">Offices</Link></li>
              <li><Link to="/" className="hover:text-white">Stores</Link></li>
              <li><Link to="/" className="hover:text-white">Work With Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">POLICIES</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white">Terms of Use</Link></li>
              <li><Link to="/" className="hover:text-white">Cookies Settings</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} STREET WEAR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

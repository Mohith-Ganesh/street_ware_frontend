import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">FOLLOW US</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white flex items-center"><Instagram className="w-4 h-4 mr-2" /> Instagram</a></li>
              <li><a href="#" className="hover:text-white flex items-center"><Youtube className="w-4 h-4 mr-2" /> YouTube</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">CONTACT</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><span className="hover:text-white">Email: info@streetwear.com</span></li>
              <li><span className="hover:text-white">Phone: +1 (555) 123-4567</span></li>
              <li><span className="hover:text-white">Address: 123 Fashion St, Style City</span></li>
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
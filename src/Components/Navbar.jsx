// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logoImage from '../assets/Pawsitivity_logo.png';
import { Link, useNavigate } from 'react-router-dom';

// Memoized navigation links to prevent re-renders
const NavigationLinks = React.memo(() => (
    <ul className="hidden md:flex gap-6 text-gray-700 font-semibold">
        <li className="hover:text-pink-500 cursor-pointer">
            <Link to="/">Home</Link>
        </li>
        <li className="hover:text-pink-500 cursor-pointer">
            <Link to="/shop">Shop</Link>
        </li>
        <li className="hover:text-pink-500 cursor-pointer">
            <Link to="/about">About Us</Link>
        </li>
        <li className="hover:text-pink-500 cursor-pointer">
            <Link to="/contact">Contact</Link>
        </li>
    </ul>
));

export default function Navbar({ isLoggedIn, userType, onLogout }) {
  const [open, setOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Optimize click outside handler
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Memoized callbacks
  const handleLogoClick = useCallback(() => navigate('/'), [navigate]);
  const handleMenuToggle = useCallback(() => setOpen(prev => !prev), []);
  const handleUserMenuToggle = useCallback(() => setIsUserMenuOpen(prev => !prev), []);
  const handleLoginClick = useCallback(() => navigate('/login'), [navigate]);
  const handleDashboardClick = useCallback(() => navigate('/admin/dashboard'), [navigate]);

  return (
    <nav className="bg-black backdrop-blur-sm shadow-md z-50 relative">
      <div className="flex justify-between items-center bg-white px-6 py-1 ">
        <img 
          src={logoImage} 
          alt="Pawsitivity Logo" 
          className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={handleLogoClick}
          loading="eager" // Logo should load immediately
        />

        {/* Hamburger */}
        <div 
          className={`md:hidden text-3xl cursor-pointer transition-transform duration-300 ${open ? 'rotate-90' : ''}`} 
          onClick={handleMenuToggle}
        >
          {open ? '✕' : '☰'}
        </div>

        <NavigationLinks />
        
        {/* Login/User Button */}
        <div className="user-menu-container relative">
          {isLoggedIn ? (
            <div className="flex items-center">
              <motion.button
                onClick={handleUserMenuToggle}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-full transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle className="text-lg" />
                <span className="font-medium">{userType === 'admin' ? 'Admin' : 'My Account'}</span>
              </motion.button>
              
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-100 text-sm font-medium text-gray-600">
                    {userType === 'admin' ? 'Admin Panel' : 'My Account'}
                  </div>
                  <ul className="py-2">
                    {userType === 'admin' && (
                      <li 
                        className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm cursor-pointer"
                        onClick={handleDashboardClick}
                      >
                        Dashboard
                      </li>
                    )}
                    <li className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm cursor-pointer">
                      My Orders
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm cursor-pointer">
                      Settings
                    </li>
                    <li 
                      onClick={onLogout}
                      className="px-4 py-2 hover:bg-red-50 text-red-600 text-sm cursor-pointer flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Sign Out
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-6 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/98 rounded-lg shadow-lg overflow-hidden z-50"
        >
          <motion.ul
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex flex-col py-4"
          >
            {/* Use correct paths for mobile menu */}
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0 }}
              className="px-6 py-3 text-gray-700 font-medium hover:bg-white hover:text-pink-500 cursor-pointer transition-all duration-200 border-b border-pink-100"
            >
              <Link to="/">Home</Link>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-6 py-3 text-gray-700 font-medium hover:bg-white hover:text-pink-500 cursor-pointer transition-all duration-200 border-b border-pink-100"
            >
              <Link to="/shop">Shop</Link>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="px-6 py-3 text-gray-700 font-medium hover:bg-white hover:text-pink-500 cursor-pointer transition-all duration-200 border-b border-pink-100"
            >
              <Link to="/about">About Us</Link>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6 py-3 text-gray-700 font-medium hover:bg-white hover:text-pink-500 cursor-pointer transition-all duration-200 border-b border-pink-100"
            >
              <Link to="/contact">Contact</Link>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={isLoggedIn ? undefined : handleLoginClick}
              className="px-6 py-3 text-pink-600 font-medium hover:bg-pink-50 cursor-pointer transition-all duration-200 border-b-0"
            >
              {isLoggedIn ? (
                <span>My Account</span>
              ) : (
                <span>Login / Sign Up</span>
              )}
            </motion.li>
          </motion.ul>
        </motion.div>
      )}
    </nav>
  );
}

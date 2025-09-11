// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logoImage from '../assets/Pawsitivity_logo.png';
import { Link, useNavigate } from 'react-router-dom';

// Memoized navigation links to prevent re-renders
const NavigationLinks = React.memo(() => (
    <ul className="hidden gap-6 font-semibold text-gray-700 md:flex">
        <li className="cursor-pointer hover:text-pink-500">
            <Link to="/">Home</Link>
        </li>
        <li className="cursor-pointer hover:text-pink-500">
            <Link to="/shop">Shop</Link>
        </li>
        <li className="cursor-pointer hover:text-pink-500">
            <Link to="/about">About Us</Link>
        </li>
        <li className="cursor-pointer hover:text-pink-500">
            <Link to="/contact">Contact</Link>
        </li>
        <li className="cursor-pointer hover:text-pink-500">
            <Link to="/media">Media</Link>
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
    <nav className="relative z-50 bg-black shadow-md backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-1 bg-white ">
        <img 
          src={logoImage} 
          alt="Pawsitivity Logo" 
          className="w-auto h-16 transition-opacity duration-200 cursor-pointer hover:opacity-80"
          onClick={handleLogoClick}
          loading="eager" 
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
        <div className="relative user-menu-container">
            {isLoggedIn ? (
              <div className="flex items-center">
                <motion.button
                  onClick={handleUserMenuToggle}
                  className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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
                    className="absolute right-0 z-50 w-48 mt-2 overflow-hidden bg-white rounded-lg shadow-xl top-full"
                  >
                    <div className="p-3 text-sm font-medium text-gray-600 border-b border-gray-100">
                      {userType === 'admin' ? 'Admin Panel' : 'My Account'}
                    </div>
                    <ul className="py-2">
                      {userType === 'admin' && (
                        <li 
                          className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                          onClick={handleDashboardClick}
                        >
                          Dashboard
                        </li>
                      )}
                      <li className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                        My Orders
                      </li>
                      <li className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                        Settings
                      </li>
                      <li 
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50"
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
                className="px-6 py-2 font-medium text-white transition-all rounded-full shadow-md bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:shadow-lg"
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
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg shadow-lg md:hidden top-full bg-white/98"
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
              className="px-6 py-3 font-medium text-gray-700 transition-all duration-200 border-b border-pink-100 cursor-pointer hover:bg-white hover:text-pink-500"
            >
              <Link to="/">Home</Link>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-6 py-3 font-medium text-gray-700 transition-all duration-200 border-b border-pink-100 cursor-pointer hover:bg-white hover:text-pink-500"
            >
              <Link to="/shop">Shop</Link>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="px-6 py-3 font-medium text-gray-700 transition-all duration-200 border-b border-pink-100 cursor-pointer hover:bg-white hover:text-pink-500"
            >
              <Link to="/about">About Us</Link>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6 py-3 font-medium text-gray-700 transition-all duration-200 border-b border-pink-100 cursor-pointer hover:bg-white hover:text-pink-500"
            >
              <Link to="/contact">Contact</Link>
            </motion.li>
              {isLoggedIn ? (
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="px-6 py-3 font-medium text-pink-600 transition-all duration-200 border-b-0 cursor-pointer hover:bg-pink-50"
                >
                  <span>My Account</span>
                </motion.li>
              ) : (
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleLoginClick}
                  className="px-6 py-3 font-medium text-pink-600 transition-all duration-200 border-b-0 cursor-pointer hover:bg-pink-50"
                >
                  Login
                </motion.li>
              )}
          </motion.ul>
        </motion.div>
      )}
    </nav>
  );
}

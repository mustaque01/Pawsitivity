// src/components/Navbar.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import logoImage from '../assets/Pawsitivity_logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow-md px-6 py-4 z-50">
      <div className="flex justify-between items-center">
        <img 
          src={logoImage} 
          alt="Pawsitivity Logo" 
          className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />

        {/* Hamburger */}
        <div 
          className={`md:hidden text-3xl cursor-pointer transition-transform duration-300 ${open ? 'rotate-90' : ''}`} 
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </div>

        {/* Links Desktop */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-semibold">
          <li className="hover:text-pink-500 cursor-pointer">Home</li>
          <li className="hover:text-pink-500 cursor-pointer">Shop</li>
          <li className="hover:text-pink-500 cursor-pointer">About Us</li>
          <li className="hover:text-pink-500 cursor-pointer">Impact</li>
          <li className="hover:text-pink-500 cursor-pointer">Contact</li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden mt-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg shadow-lg overflow-hidden"
        >
          <motion.ul
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex flex-col py-4"
          >
            {["Home", "Shop", "About Us", "Impact", "Contact"].map((item, idx) => (
              <motion.li 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="px-6 py-3 text-gray-700 font-medium hover:bg-white hover:text-pink-500 cursor-pointer transition-all duration-200 border-b border-pink-100 last:border-b-0"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </nav>
  );
}

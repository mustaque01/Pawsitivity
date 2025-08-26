import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// Dummy products data
const initialProducts = [
  {
    id: 1,
    name: 'Reflective Dog Collar - Small',
    category: 'Collars',
    price: 599,
    inventory: 45,
    image: '/src/assets/New collars QR code/pawelite multicolor.jpg',
  },
  {
    id: 2,
    name: 'Reflective Dog Collar - Medium',
    category: 'Collars',
    price: 699,
    inventory: 32,
    image: '/src/assets/New collars QR code/pawelite navy blue.jpg',
  },
  {
    id: 3,
    name: 'Anti-Theft QR Collar - Black',
    category: 'Collars',
    price: 899,
    inventory: 28,
    image: '/src/assets/New collars QR code/anti theft black.jpg',
  },
  {
    id: 4,
    name: 'Premium Pawelite Collar - Pink',
    category: 'Collars',
    price: 749,
    inventory: 35,
    image: '/src/assets/New collars QR code/pawelite pink.jpg',
  },
  {
    id: 5,
    name: 'Anti-Theft Multi-Color Collar',
    category: 'Collars',
    price: 799,
    inventory: 22,
    image: '/src/assets/New collars QR code/anit theft multicolor.jpg',
  },
];

export default function AdminDashboard() {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('products');

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.userType !== 'admin')) {
      navigate('/admin/login');
    }
  }, [loading, isLoggedIn, user, navigate]);

  useEffect(() => {
    // Load products from localStorage if available
    const storedProducts = localStorage.getItem('pawsitivity_products');
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (error) {
        console.error('Error loading products', error);
      }
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pawsitivity_products', JSON.stringify(products));
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-yellow-600 rounded-full border-t-transparent animate-spin"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Only check authentication after loading is complete
  if (!isLoggedIn || user?.userType !== 'admin') {
    return null; // Don't render anything while redirecting
  }

  const handleAddProduct = () => {
    setSelectedProduct({
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: '',
      category: '',
      price: 0,
      inventory: 0,
      image: null,
    });
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (selectedProduct.id) {
      // Update existing product
      setProducts(products.map(product =>
        product.id === selectedProduct.id ? selectedProduct : product
      ));
    } else {
      // Add new product
      setProducts([...products, selectedProduct]);
    }

    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: name === 'price' || name === 'inventory' ? Number(value) : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProduct({
        ...selectedProduct,
        image: URL.createObjectURL(file), // Preview the image
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="py-6 text-white shadow-lg bg-gradient-to-r from-yellow-600 to-orange-700">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 transition-colors rounded-full bg-white/10 hover:bg-white/20"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-yellow-200">Welcome back, {user?.firstName || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 font-medium text-white transition-colors rounded-lg bg-white/10 hover:bg-white/20"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-200">
          <button
            className={`pb-4 px-6 font-medium transition-colors ${currentTab === 'products'
              ? 'text-yellow-700 border-b-2 border-yellow-700'
              : 'text-gray-500 hover:text-yellow-700'
              }`}
            onClick={() => setCurrentTab('products')}
          >
            Products
          </button>
          <button
            className={`pb-4 px-6 font-medium transition-colors ${currentTab === 'orders'
              ? 'text-yellow-700 border-b-2 border-yellow-700'
              : 'text-gray-500 hover:text-yellow-700'
              }`}
            onClick={() => setCurrentTab('orders')}
          >
            Orders
          </button>
          <button
            className={`pb-4 px-6 font-medium transition-colors ${currentTab === 'customers'
              ? 'text-yellow-700 border-b-2 border-yellow-700'
              : 'text-gray-500 hover:text-yellow-700'
              }`}
            onClick={() => setCurrentTab('customers')}
          >
            Customers
          </button>
          <button
            className={`pb-4 px-6 font-medium transition-colors ${currentTab === 'analytics'
              ? 'text-yellow-700 border-b-2 border-yellow-700'
              : 'text-gray-500 hover:text-yellow-700'
              }`}
            onClick={() => setCurrentTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* Products Tab Content */}
        {currentTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-yellow-600 rounded-lg hover:bg-yellow-700"
                >
                  <FaPlus />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Inventory
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.inventory}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="mr-4 text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs */}
        {currentTab === 'orders' && (
          <div className="p-6 py-16 text-center bg-white rounded-lg shadow-md">
            <h3 className="mb-2 text-xl font-medium text-gray-700">Orders Dashboard Coming Soon</h3>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        )}

        {currentTab === 'customers' && (
          <div className="p-6 py-16 text-center bg-white rounded-lg shadow-md">
            <h3 className="mb-2 text-xl font-medium text-gray-700">Customer Management Coming Soon</h3>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        )}

        {currentTab === 'analytics' && (
          <div className="p-6 py-16 text-center bg-white rounded-lg shadow-md">
            <h3 className="mb-2 text-xl font-medium text-gray-700">Analytics Dashboard Coming Soon</h3>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={selectedProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={selectedProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Collars">Collars</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Trackers">Trackers</option>
                    <option value="Food">Food</option>
                    <option value="Toys">Toys</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block mb-1 text-sm font-medium text-gray-700">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={selectedProduct.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="inventory" className="block mb-1 text-sm font-medium text-gray-700">
                      Inventory
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      name="inventory"
                      min="0"
                      value={selectedProduct.inventory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  {selectedProduct.image && (
                    <div className="mt-2">
                      <img
                        src={selectedProduct.image}
                        alt="Product preview"
                        className="object-contain w-auto h-24 border rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex pt-4 space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
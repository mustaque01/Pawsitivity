import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft, FaTimes, FaUpload, FaImage } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// Enhanced products data with complete structure
const initialProducts = [
  {
    id: 1,
    name: 'Reflective Dog Collar - Small',
    author: 'Pawsitivity',
    rating: 4.5,
    reviewCount: 128,
    format: 'Single Collar',
    category: 'Dogs',
    price: 599,
    stockCount: 45,
    images: ['/src/assets/New collars QR code/pawelite multicolor.jpg'],
    inStock: true,
    description: 'High-visibility reflective collar designed for small dogs with integrated QR code technology.',
    features: [
      'Reflective material for night visibility',
      'QR code for pet identification',
      'Adjustable size',
      'Comfortable padding',
      'Water-resistant'
    ],
    specifications: {
      'Material': 'Nylon with reflective strips',
      'Size Range': '20-30cm',
      'Weight': '45g',
      'Color Options': 'Multi-color',
      'Closure Type': 'Quick-release buckle'
    }
  }
];

// Initial categories
const initialCategories = ['Dogs', 'Cats', 'Cattle', 'Birds', 'Accessories', 'Trackers'];

export default function AdminDashboard() {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('products');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  // Add state to track specification entries with stable IDs
  const [specificationEntries, setSpecificationEntries] = useState([]);

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

  // Initialize specification entries when product is selected
  useEffect(() => {
    if (selectedProduct && selectedProduct.specifications) {
      const entries = Object.entries(selectedProduct.specifications).map(([key, value], index) => ({
        id: `spec-${Date.now()}-${index}`, // Stable unique ID
        key,
        value
      }));
      setSpecificationEntries(entries);
    } else if (selectedProduct) {
      setSpecificationEntries([]);
    }
  }, [selectedProduct?.id]); // Only re-run when product ID changes

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

  const emptyProduct = {
    id: null,
    name: '',
    author: 'Pawsitivity',
    rating: 5,
    reviewCount: 0,
    format: 'Single Collar',
    category: '',
    price: 0,
    stockCount: 0,
    images: [],
    inStock: true,
    description: '',
    features: [''],
    specifications: {}
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  // Remove image from selection
  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the removed URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct({
      ...emptyProduct,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct({...product});
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    // Convert specification entries back to object
    const specifications = {};
    specificationEntries.forEach(entry => {
      if (entry.key.trim() && entry.value.trim()) {
        specifications[entry.key.trim()] = entry.value.trim();
      }
    });
    
    const imageUrls = selectedImages.length > 0 
      ? imagePreviewUrls 
      : selectedProduct.images || [];
    
    const productToSave = {
      ...selectedProduct,
      images: imageUrls,
      inStock: selectedProduct.stockCount > 0,
      features: selectedProduct.features.filter(f => f.trim() !== ''),
      specifications
    };

    if (products.find(p => p.id === selectedProduct.id)) {
      setProducts(products.map(product =>
        product.id === selectedProduct.id ? productToSave : product
      ));
    } else {
      setProducts([...products, productToSave]);
    }

    setIsFormOpen(false);
    setSelectedProduct(null);
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setSpecificationEntries([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    if (type === 'number') {
      processedValue = Number(value);
    } else if (type === 'checkbox') {
      processedValue = checked;
    }

    setSelectedProduct({
      ...selectedProduct,
      [name]: processedValue,
    });
  };

  const handleArrayInputChange = (index, value, field) => {
    const updatedArray = [...selectedProduct[field]];
    updatedArray[index] = value;
    setSelectedProduct({
      ...selectedProduct,
      [field]: updatedArray
    });
  };

  const addArrayItem = (field) => {
    setSelectedProduct({
      ...selectedProduct,
      [field]: [...selectedProduct[field], '']
    });
  };

  const removeArrayItem = (index, field) => {
    const updatedArray = selectedProduct[field].filter((_, i) => i !== index);
    setSelectedProduct({
      ...selectedProduct,
      [field]: updatedArray
    });
  };

  const handleSpecificationChange = (key, value) => {
    setSelectedProduct({
      ...selectedProduct,
      specifications: {
        ...selectedProduct.specifications,
        [key]: value
      }
    });
  };

  const handleSpecificationKeyChange = (oldKey, newKey) => {
    if (oldKey === newKey) return; // No change needed
    
    const newSpecs = { ...selectedProduct.specifications };
    const value = newSpecs[oldKey];
    delete newSpecs[oldKey];
    newSpecs[newKey] = value;
    
    setSelectedProduct({
      ...selectedProduct,
      specifications: newSpecs
    });
  };

  const addSpecification = () => {
    const newKey = `New Spec ${Object.keys(selectedProduct.specifications).length + 1}`;
    setSelectedProduct({
      ...selectedProduct,
      specifications: {
        ...selectedProduct.specifications,
        [newKey]: ''
      }
    });
  };

  const removeSpecification = (key) => {
    const { [key]: removed, ...rest } = selectedProduct.specifications;
    setSelectedProduct({
      ...selectedProduct,
      specifications: rest
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category management functions
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete the "${categoryToDelete}" category?`)) {
      setCategories(categories.filter(cat => cat !== categoryToDelete));
      // Update products that use this category
      setProducts(products.map(product => 
        product.category === categoryToDelete 
          ? { ...product, category: '' }
          : product
      ));
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleSpecificationEntryChange = (id, field, newValue) => {
    setSpecificationEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: newValue } : entry
      )
    );
  };

  const addSpecificationEntry = () => {
    const newEntry = {
      id: `spec-${Date.now()}-${Math.random()}`,
      key: '',
      value: ''
    };
    setSpecificationEntries(prev => [...prev, newEntry]);
  };

  const removeSpecificationEntry = (id) => {
    setSpecificationEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified header without heavy gradients */}
      <div className="bg-yellow-500 shadow-lg">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-yellow-900 transition-colors rounded-lg hover:bg-yellow-400 hover:text-yellow-800"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-yellow-900 sm:text-3xl">
                  Admin Dashboard
                </h1>
                <p className="text-yellow-800">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/shop')}
                className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base text-yellow-700 transition-all bg-yellow-200 rounded-lg shadow-md hover:bg-yellow-300 hover:shadow-lg"
              >
                View Shop
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base text-yellow-700 transition-all bg-yellow-200 rounded-lg shadow-md hover:bg-yellow-300 hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-2 py-4 mx-auto sm:px-4 sm:py-8">
        {/* Responsive Tabs - horizontal scroll removed */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {['products', 'categories', 'orders', 'customers', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 sm:px-6 sm:py-4 sm:text-base ${
                    currentTab === tab
                      ? 'text-yellow-700 border-yellow-500 bg-yellow-50'
                      : 'text-gray-500 hover:text-yellow-700 border-transparent hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Tab Content */}
        {currentTab === 'products' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col items-start justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Product Management</h2>
                <p className="text-sm text-gray-600 sm:text-base">Manage your product catalog</p>
              </div>
              <div className="flex flex-col w-full space-y-3 sm:flex-row sm:w-auto sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full py-2 pl-10 pr-4 text-sm border-2 border-gray-300 rounded-lg sm:w-auto sm:py-3 sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm text-white transition-all bg-yellow-600 rounded-lg sm:w-auto sm:px-6 sm:py-3 sm:text-base hover:bg-yellow-700 shadow-md hover:shadow-lg"
                >
                  <FaPlus />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Mobile Cards - improved responsive design */}
            <div className="block lg:hidden">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 overflow-hidden bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{product.name}</h3>
                        <p className="text-xs text-gray-600 sm:text-sm">{product.category}</p>
                        <p className="text-lg font-bold text-yellow-600 sm:text-xl">₹{product.price}</p>
                        <p className="text-xs text-gray-500 sm:text-sm">Stock: <span className="font-medium">{product.stockCount}</span></p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full p-8 text-center bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="text-gray-400 mb-3">
                      <FaSearch className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Table - improved */}
            <div className="hidden overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 overflow-hidden bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{product.stockCount}</div>
                          <div className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">⭐ {product.rating}</div>
                          <div className="text-xs text-gray-500">({product.reviewCount} reviews)</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="hidden lg:block p-12 py-20 text-center bg-gray-50 border border-gray-200 rounded-xl">
                <div className="text-gray-400 mb-4">
                  <FaSearch className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab Content - simplified */}
        {currentTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col items-start justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Category Management</h2>
                <p className="text-sm text-gray-600 sm:text-base">Organize your product categories</p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm text-white transition-all bg-yellow-600 rounded-lg sm:w-auto sm:px-6 sm:py-3 sm:text-base hover:bg-yellow-700 shadow-md hover:shadow-lg"
              >
                <FaPlus />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div key={category} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{category}</h3>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{products.filter(p => p.category === category).length}</span> products
                    </p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-4 text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs content - simplified */}
        {['orders', 'customers', 'analytics'].map((tab) => (
          currentTab === tab && (
            <div key={tab} className="p-8 text-center bg-white rounded-lg shadow-lg border border-gray-200 sm:p-12 sm:py-20">
              <div className="text-gray-300 mb-6">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center sm:w-20 sm:h-20">
                  <span className="text-2xl sm:text-3xl">🚧</span>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-700 sm:text-2xl">{tab.charAt(0).toUpperCase() + tab.slice(1)} Dashboard Coming Soon</h3>
              <p className="text-gray-500 text-base sm:text-lg">This feature is currently under development.</p>
            </div>
          )
        ))}
      </div>

      {/* Enhanced Product Form Modal - improved responsive design */}
      {isFormOpen && selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/70 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-gray-200 sm:rounded-2xl"
          >
            {/* Modal Header - simplified */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 sm:text-2xl">
                {selectedProduct.id && products.find(p => p.id === selectedProduct.id) ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-gray-500 bg-white rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body - improved responsive design */}
            <div className="overflow-y-auto max-h-[calc(95vh-120px)] bg-white">
              <form onSubmit={handleSaveProduct} className="p-4 space-y-6 sm:p-8 sm:space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedProduct.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={selectedProduct.author}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Category *</label>
                    <select
                      name="category"
                      value={selectedProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Format</label>
                    <input
                      type="text"
                      name="format"
                      value={selectedProduct.format}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={selectedProduct.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Stock Count *</label>
                    <input
                      type="number"
                      name="stockCount"
                      min="0"
                      value={selectedProduct.stockCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={selectedProduct.rating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Review Count</label>
                    <input
                      type="number"
                      name="reviewCount"
                      min="0"
                      value={selectedProduct.reviewCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Enhanced Image Upload Section */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Product Images</label>
                  
                  {/* Image Upload Area */}
                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-300 border-dashed rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 mb-4 text-yellow-500" />
                        <p className="mb-2 text-sm text-yellow-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-yellow-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Existing Images (for edit mode) */}
                  {selectedProduct.images && selectedProduct.images.length > 0 && imagePreviewUrls.length === 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {selectedProduct.images.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            Current
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Features Section */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Features</label>
                  <div className="space-y-2">
                    {selectedProduct.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleArrayInputChange(index, e.target.value, 'features')}
                          className="flex-1 px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="Enter feature"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'features')}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('features')}
                      className="flex items-center px-3 py-2 text-sm text-yellow-700 border border-yellow-300 rounded-md hover:bg-yellow-50"
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Add Feature
                    </button>
                  </div>
                </div>

                {/* Fixed Specifications Section */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Specifications</label>
                  <div className="space-y-3">
                    {specificationEntries.map((entry) => (
                      <div key={entry.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center bg-gray-50 p-3 rounded-lg">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={entry.key}
                            onChange={(e) => handleSpecificationEntryChange(entry.id, 'key', e.target.value)}
                            className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Specification name"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={entry.value}
                            onChange={(e) => handleSpecificationEntryChange(entry.id, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Value"
                          />
                        </div>
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeSpecificationEntry(entry.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {specificationEntries.length === 0 && (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        No specifications added yet. Click "Add Specification" to get started.
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={addSpecificationEntry}
                      className="flex items-center px-4 py-2 text-sm text-yellow-700 border border-yellow-300 rounded-md hover:bg-yellow-50 transition-colors"
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Add Specification
                    </button>
                  </div>
                </div>

                {/* Enhanced Category Selection */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Category *</label>
                  <div className="flex space-x-2">
                    <select
                      name="category"
                      value={selectedProduct.category}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="px-3 py-2 text-yellow-700 border border-yellow-300 rounded-md hover:bg-yellow-50"
                      title="Add new category"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Enhanced Form Actions */}
                <div className="flex flex-col pt-6 space-y-3 border-t border-gray-200 sm:flex-row sm:space-y-0 sm:space-x-4 sm:pt-8">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all sm:px-6 sm:py-3 sm:text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-base font-medium text-white bg-yellow-600 border border-transparent rounded-lg shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all sm:px-6 sm:py-3 sm:text-lg"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Category Management Modal - improved responsive design */}
      {isCategoryModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Add New Category</h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-sm font-bold text-gray-700">Category Name</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    placeholder="Enter category name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 px-4 py-3 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all font-medium"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { useAuth } from "../Auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllProductsByAdmin,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../Apis/product_api";
import { Feather } from "lucide-react";

export default function AdminProduct() {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.detail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch products from backend
  const fetchProductsFromBackend = async () => {
    try {
      setIsLoadingProducts(true);
      const result = await getAllProductsByAdmin();
      if (result.success) {
        setProducts(result.products || []);
        console.log("Fetched products:", result.products);
      } else {
        console.error("Failed to fetch products:", result.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.userType !== "admin")) {
      navigate("/admin/login");
    } else if (isLoggedIn && user?.userType === "admin") {
      fetchProductsFromBackend();
    }
  }, [loading, isLoggedIn, user, navigate]);

  const handleAddProduct = () => {
    setSelectedProduct({
      product: "",
      detail: "",
      category: "",
      price: 0,
      discount: 0,
      quantity: 0,
      promotion: {
        startDate: null,
        endDate: null,
        discountPercentage: 0,
      },
      stock: 0,
      primaryImage: null,
      secondaryImages: [],
      isActive: true,
      rating: 0,
      noOfReviews: 0,
      tags: [],
      features: [],
      specifications: [],
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct({ ...product });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const result = await deleteProduct(id);
        if (result.success) {
          await fetchProductsFromBackend();
          alert("Product deleted successfully!");
        } else {
          alert(`Failed to delete product: ${result.message}`);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Add product data according to the product model
      formData.append("product", selectedProduct.product);
      formData.append("detail", selectedProduct.detail);
      formData.append("category", selectedProduct.category);
      formData.append("price", selectedProduct.price);
      formData.append("quantity", selectedProduct.quantity);
      formData.append("isActive", selectedProduct.isActive);
      formData.append("rating", selectedProduct.rating);
      formData.append("noOfReviews", selectedProduct.noOfReviews);
      // Add tags, features, specifications as arrays (not JSON strings)
      if (selectedProduct.tags && selectedProduct.tags.length > 0) {
        selectedProduct.tags.forEach((tag) => formData.append("tags", tag));
      }
      if (selectedProduct.features && selectedProduct.features.length > 0) {
        selectedProduct.features.forEach((f) => formData.append("features", f));
      }
      if (
        selectedProduct.specifications &&
        selectedProduct.specifications.length > 0
      ) {
        selectedProduct.specifications.forEach((s) =>
          formData.append("specifications", s)
        );
      }
      // Add images: first is primary, rest are secondary
      if (selectedImages.length === 0) {
        alert("At least one image is required.");
        return;
      }
      formData.append("primaryImage", selectedImages[0]);
      for (let i = 1; i < selectedImages.length; i++) {
        formData.append("secondaryImages", selectedImages[i]);
      }
      let result;
      const isEditing = selectedProduct._id;
      if (isEditing) {
        result = await updateProduct(selectedProduct._id, formData);
      } else {
        result = await createProduct(formData);
      }
      if (result.success) {
        await fetchProductsFromBackend();
        alert(
          isEditing
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        setIsFormOpen(false);
        setSelectedProduct(null);
        setSelectedImages([]);
        setImagePreviewUrls([]);
      } else {
        alert(
          `Failed to ${isEditing ? "update" : "create"} product: ${
            result.message
          }`
        );
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (type === "number") {
      processedValue = Number(value);
    } else if (type === "checkbox") {
      processedValue = checked;
    }

    setSelectedProduct({
      ...selectedProduct,
      [name]: processedValue,
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

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
      // This cleanup will run when component unmounts
      // Don't need to include imagePreviewUrls in dependency array
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col items-start justify-between mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Product Management
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            Manage your product catalog
          </p>
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
          <div className="flex space-x-3">
            <button
              onClick={fetchProductsFromBackend}
              disabled={isLoadingProducts}
              className="flex items-center justify-center px-4 py-2 space-x-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg transition-all hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSearch />
              <span>{isLoadingProducts ? "Loading..." : "Refresh"}</span>
            </button>
            <button
              onClick={handleAddProduct}
              className="flex items-center justify-center px-4 py-2 space-x-2 text-sm text-white transition-all bg-yellow-600 rounded-lg hover:bg-yellow-700 shadow-md hover:shadow-lg"
            >
              <FaPlus />
              <span>Add Product</span>
            </button>
            <Link
              to="/admin/add-offer"
              className="flex items-center justify-center px-4 py-2 space-x-2 text-sm text-white transition-all bg-yellow-600 rounded-lg hover:bg-yellow-700 shadow-md hover:shadow-lg"
            >
              <FaPlus />
              <span>Add Offer</span>
            </Link>
          </div>
        </div>
      </div>
      {isLoadingProducts ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-16 h-16 overflow-hidden bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0">
                      {product.primaryImage ? (
                        <img
                          src={product.primaryImage.url || product.primaryImage}
                          alt={product.product}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.product}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {product.user?.firstName} {product.user?.lastName}
                      </p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold leading-4 text-yellow-800 bg-yellow-100 rounded-full mt-1">
                        {product.category}
                      </span>
                      {/* Offer Badges */}
                      {product.discount > 0 && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold leading-4 text-green-800 bg-green-100 rounded-full">
                          {product.discount}% OFF
                        </span>
                      )}
                      {product.promotion && product.promotion !== "" && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold leading-4 text-blue-800 bg-blue-100 rounded-full">
                          {typeof product.promotion === "string"
                            ? product.promotion
                            : product.promotion.type}
                        </span>
                      )}
                      {product.bogoOffer && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold leading-4 text-purple-800 bg-purple-100 rounded-full">
                          BOGO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">
                        ₹{product.discountedPrice ?? product.price}
                      </p>
                      <p className="text-xs text-gray-500">Price</p>
                      {/* Offer Details */}
                      {product.discount > 0 && (
                        <p className="text-xs text-green-600">
                          Discount: {product.discount}%
                        </p>
                      )}
                      {product.promotion && product.promotion !== "" && (
                        <p className="text-xs text-blue-600">
                          Promotion:{" "}
                          {typeof product.promotion === "string"
                            ? product.promotion
                            : product.promotion.type}
                        </p>
                      )}
                      {product.bogoOffer && (
                        <p className="text-xs text-purple-600">
                          BOGO Offer Active
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.quantity ?? product.stock}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          product.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.isActive ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        ⭐ {product.rating || 0}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.noOfReviews || 0} reviews)
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full p-8 text-center bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="text-gray-400 mb-3">
                    <FaSearch className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or add a new product
                  </p>
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
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 overflow-hidden bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0">
                            {product.primaryImage ? (
                              <img
                                src={
                                  product.primaryImage.url ||
                                  product.primaryImage
                                }
                                alt={product.product}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.product}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.user?.firstName} {product.user?.lastName}
                            </div>
                            {/* Offer Badges */}
                            <div className="mt-1 flex flex-wrap gap-1">
                              {product.discount > 0 && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold leading-4 text-green-800 bg-green-100 rounded-full">
                                  {product.discount}% OFF
                                </span>
                              )}
                              {product.promotion &&
                                product.promotion !== "" && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold leading-4 text-blue-800 bg-blue-100 rounded-full">
                                    {typeof product.promotion === "string"
                                      ? product.promotion
                                      : product.promotion.type}
                                  </span>
                                )}
                              {product.bogoOffer && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold leading-4 text-purple-800 bg-purple-100 rounded-full">
                                  BOGO
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          ₹{product.discountedPrice ?? product.price}
                        </div>
                        {/* Offer Details */}
                        {product.discount > 0 && (
                          <div className="text-xs text-green-600">
                            Discount: {product.discount}%
                          </div>
                        )}
                        {product.promotion && product.promotion !== "" && (
                          <div className="text-xs text-blue-600">
                            Promotion:{" "}
                            {typeof product.promotion === "string"
                              ? product.promotion
                              : product.promotion.type}
                          </div>
                        )}
                        {product.bogoOffer && (
                          <div className="text-xs text-purple-600">
                            BOGO Offer Active
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {product.quantity ?? product.stock}
                        </div>
                        <div
                          className={`text-xs font-medium ${
                            product.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {product.isActive ? "In Stock" : "Out of Stock"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ⭐ {product.rating || 0}
                        </div>
                        <div className="text-xs text-gray-500">
                          ({product.noOfReviews || 0} reviews)
                        </div>
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
                            onClick={() => handleDeleteProduct(product._id)}
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
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </>
      )}

      {/* Add new product form */}
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
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden border border-gray-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                {selectedProduct._id ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-gray-500 bg-white rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(95vh-120px)] bg-white">
              <form
                onSubmit={handleSaveProduct}
                className="p-4 space-y-6 sm:p-6"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="product"
                      value={selectedProduct.product}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={selectedProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Dogs">Dogs</option>
                      <option value="Cats">Cats</option>
                      <option value="Cattle">Cattle</option>
                      <option value="Birds">Birds</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Trackers">Trackers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      max="100"
                      step="0.01"
                      value={selectedProduct.discount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Promotion
                    </label>
                    <select
                      name="promotion"
                      value={selectedProduct.promotion || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">None</option>
                      <option value="BOGO">Buy One Get One</option>
                      <option value="FLASH_SALE">Flash Sale</option>
                      <option value="SEASONAL">Seasonal</option>
                      <option value="CLEARANCE">Clearance</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      value={selectedProduct.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Product Details
                  </label>
                  <textarea
                    name="detail"
                    value={selectedProduct.detail}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter product description..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Product Images
                  </label>
                  <div className="mb-2 text-xs text-gray-500">
                    First image will be used as <b>Primary Image</b>. Others
                    will be <b>Secondary Images</b>.
                  </div>
                  {/* Image Upload Area */}
                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-300 border-dashed rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 mb-4 text-yellow-500" />
                        <p className="mb-2 text-sm text-yellow-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-yellow-500">
                          PNG, JPG, GIF up to 10MB each
                        </p>
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
                  {/* Image Previews with Primary/Secondary labels */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <span
                            className={`absolute top-1 left-1 px-2 py-0.5 text-xs rounded bg-black/70 text-white ${
                              index === 0 ? "font-bold" : ""
                            }`}
                          >
                            {index === 0 ? "Primary" : "Secondary"}
                          </span>
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
                  {selectedProduct.image &&
                    selectedProduct.image.length > 0 &&
                    imagePreviewUrls.length === 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {selectedProduct.image.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img.url}
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

                {/* Tags, Features, Specifications */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Tags */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={
                        selectedProduct.tags
                          ? selectedProduct.tags.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g. eco-friendly, durable, waterproof"
                    />
                  </div>
                  {/* Features */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Features (comma separated)
                    </label>
                    <input
                      type="text"
                      name="features"
                      value={
                        selectedProduct.features
                          ? selectedProduct.features.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          features: e.target.value
                            .split(",")
                            .map((f) => f.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g. lightweight, washable, adjustable"
                    />
                  </div>
                  {/* Specifications */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Specifications (comma separated)
                    </label>
                    <input
                      type="text"
                      name="specifications"
                      value={
                        selectedProduct.specifications
                          ? selectedProduct.specifications.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          specifications: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g. size: M, color: red, material: nylon"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col pt-6 space-y-3 border-t border-gray-200 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-base font-medium text-white bg-yellow-600 border border-transparent rounded-lg shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  >
                    {selectedProduct._id ? "Update Product" : "Create Product"}
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

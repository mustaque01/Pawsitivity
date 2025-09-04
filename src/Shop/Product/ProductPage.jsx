import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaStar,
  FaCheck,
  FaTruck,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";
import { getProductById } from "../../Apis/auth"; // Updated import

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("pawsitivity_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getProductById(id);

        if (response.success) {
          setProduct(response.product);
          setSelectedImage(0);
        } else {
          setError(response.message || "Failed to load product");
        }
      } catch (err) {
        setError("Something went wrong while loading the product");
        console.error("Product loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }

    // Load cart from localStorage
    const syncCart = () => {
      try {
        const stored = localStorage.getItem("pawsitivity_cart");
        setCart(stored ? JSON.parse(stored) : []);
      } catch {
        setCart([]);
      }
    };
    window.addEventListener("pawsitivity_cart_updated", syncCart);
    syncCart();
    return () =>
      window.removeEventListener("pawsitivity_cart_updated", syncCart);
  }, [id]);

  // Sync cart state with localStorage whenever cart changes elsewhere
  useEffect(() => {
    const syncCart = () => {
      try {
        const stored = localStorage.getItem("pawsitivity_cart");
        setCart(stored ? JSON.parse(stored) : []);
      } catch {
        setCart([]);
      }
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  // Get quantity from cart for this product
  const cartProduct = cart.find((item) => item._id === product?._id);
  useEffect(() => {
    // If product is in cart, sync quantity state to cart quantity
    if (cartProduct) {
      setQuantity(cartProduct.quantity);
    } else {
      setQuantity(1);
    }
    // eslint-disable-next-line
  }, [cartProduct?.quantity, product?._id]);

  const handleAddToCart = () => {
    if (!product) return;

    const productId = product._id;
    const existingIndex = cart.findIndex((item) => item._id === productId);
    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: quantity } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        },
      ];
    }

    setCart(updatedCart);
    localStorage.setItem("pawsitivity_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("pawsitivity_cart_updated"));
    alert(`${product.product} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/address");
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProductById(id);

      if (response.success) {
        setProduct(response.product);
        setSelectedImage(0);
      } else {
        setError(response.message || "Failed to load product");
      }
    } catch (err) {
      setError("Something went wrong while loading the product");
      console.error("Product loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? "Error Loading Product" : "Product Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {error && (
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => navigate("/shop")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cart count for icon
  const cartCount = cart.length;

  // Map your backend data structure to display variables
  const productName = product.product || product.name || product.title;
  const productImage = product.image?.[0]?.url || product.image?.[0] || "/api/placeholder/400/400";
  const productImages = Array.isArray(product.image) 
    ? product.image.map(img => img?.url || img) 
    : (product.image ? [product.image?.url || product.image] : []);
  const productPrice = product.discountedPrice || product.price;
  const originalPrice = product.price;
  const productDescription = product.detail || product.description;
  const productRating = product.rating || 0;
  const productReviewCount = product.noOfReviews || 0;
  const productStock = product.quantity || product.stock || 0; // Fixed: quantity first, then stock
  const productCategory = product.category || "Pet Products";
  const productDiscount = product.discount || 0;
  const productPromotion = product.promotion || "NONE";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-orange-600"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/shop")}
            className="hover:text-orange-600"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[120px] sm:max-w-xs">
            {productName}
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-4 sm:mb-6"
        >
          <FaArrowLeft />
          <span>Back to Products</span>
        </button>

        {/* Cart Button */}
        <button
          onClick={() => navigate("/cart")}
          className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 hover:bg-orange-700 transition"
          aria-label="Go to cart"
        >
          <FaShoppingCart className="text-2xl" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
              {cartCount}
            </span>
          )}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-md mx-auto">
              <img
                src={
                  productImages.length > 0
                    ? productImages[selectedImage]
                    : productImage
                }
                alt={productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/400";
                }}
              />
            </div>
            {productImages && productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto justify-center">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/80/80";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 flex flex-col">
            <div>
              <h1
                className="font-bold text-gray-900 mb-2 break-words leading-tight"
                style={{
                  fontSize: "2rem",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  lineHeight: "1.3",
                }}
              >
                {productName}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Category: {productCategory}
              </p>
              {productPromotion && productPromotion !== "NONE" && (
                <p className="text-orange-600 text-sm sm:text-base font-medium">
                  🎉 {productPromotion}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(productRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-xs sm:text-sm">
                {productRating}/5 ({productReviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                ₹{productPrice}
              </span>
              {productDiscount > 0 && originalPrice > productPrice && (
                <>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                    {productDiscount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {productStock > 0 ? (
                <>
                  <FaCheck className="text-green-500" />
                  <span className="text-green-600 font-medium text-sm sm:text-base">
                    In Stock ({productStock} available)
                  </span>
                </>
              ) : (
                <span className="text-red-600 font-medium text-sm sm:text-base">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Details Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
              <div className="border-b border-gray-200">
                <nav className="flex flex-wrap space-x-4 sm:space-x-8 px-2 sm:px-6">
                  {["description", "specifications", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 ${
                        activeTab === tab
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-4 sm:p-6">
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {productDescription}
                    </p>
                    {productPromotion && productPromotion !== "NONE" && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-1">
                          Special Promotion:
                        </h4>
                        <p className="text-orange-700 text-sm">
                          {productPromotion}
                        </p>
                      </div>
                    )}
                    {product.features && product.features.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <FaCheck className="text-blue-600 mt-1 flex-shrink-0" />
                              <span className="text-blue-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "specifications" && (
                  <div className="space-y-4">
                    {/* Display specifications as array */}
                    {product.specifications && product.specifications.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3">Product Specifications:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {product.specifications.map((spec, index) => (
                            <div key={index} className="flex items-start space-x-2 py-2 px-3 bg-gray-50 rounded-lg">
                              <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No specifications available for this product.</p>
                      </div>
                    )}

                    {/* Display tags if available */}
                    {/* {product.tags && product.tags.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                              #{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )} */}

                    {/* Display benefits if available */}
                    {product.benefits && product.benefits.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3">Benefits:</h4>
                        <div className="space-y-2">
                          {product.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {productReviewCount > 0
                        ? `${productReviewCount} customer reviews`
                        : "No reviews yet"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {productReviewCount === 0
                        ? "Be the first to review this product!"
                        : "Reviews feature coming soon..."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center space-x-6 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <FaTruck className="text-green-500" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaLock className="text-blue-500" />
                <span className="text-sm text-gray-600">10-Day Returns</span>
              </div>
            </div>

            {/* Actions: Quantity, Add to Cart, Buy Now, Heart */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-sm sm:text-base">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={productStock === 0}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(productStock, quantity + 1))
                    }
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={productStock === 0}
                  >
                    +
                  </button>
                </div>
                {/* Heart button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`ml-auto px-2 py-2 rounded-full border transition-colors ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  } ${"sm:ml-4"} flex items-center`}
                  style={{
                    fontSize: "1.1rem",
                    minWidth: 36,
                    minHeight: 36,
                  }}
                  aria-label="Add to wishlist"
                >
                  <FaHeart className={isWishlisted ? "text-red-500" : ""} />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={productStock === 0}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base ${
                    productStock === 0
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  <FaShoppingCart />
                  <span>
                    {productStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={productStock === 0}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    productStock === 0
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {productStock === 0 ? "Out of Stock" : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts, getProductById } from '../Apis/auth'; // Import both API functions
import { FaShoppingCart, FaTimes, FaStar } from "react-icons/fa";

// Enhanced Star Rating Component with memoization
const StarRating = React.memo(({ rating, reviewCount }) => (
    <div className="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'text-orange-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-1 text-xs text-orange-600 sm:text-sm">({rating})</span>
        </div>
        <span className="text-xs text-blue-600 hover:text-orange-700 sm:text-sm">{reviewCount} reviews</span>
    </div>
));

// Optimized Product Card with sleeker buttons
const ProductCard = React.memo(({ product, onAddToCart, cart, onQuantityChange, onRemoveFromCart, onViewDetails }) => {
    const navigate = useNavigate();

    // Handle different ID formats (id vs _id)
    const productId = product._id || product.id;
    const cartItem = cart.find(item => (item._id || item.id) === productId);
    const isInCart = !!cartItem;

    // Map backend product data to display format
    const productName = product.product || product.name || product.title;
    const productPrice = product.discountedPrice || product.price;
    const originalPrice = product.price;
    const productImage = product.image?.[0]?.url || product.image?.[0] || '/api/placeholder/300/300';
    const productRating = product.rating || 0;
    const productReviewCount = product.noOfReviews || 0;
    const productCategory = product.category || 'Pet Products';
    const productDiscount = product.discount || 0;

    const handleProductClick = useCallback(() => {
        navigate(`/product/${productId}`);
    }, [navigate, productId]);

    const handleViewDetails = useCallback((e) => {
        e.stopPropagation();
        onViewDetails(productId);
    }, [onViewDetails, productId]);

    const handleAddToCartClick = useCallback((e) => {
        e.stopPropagation();
        if (!isInCart) {
            onAddToCart(product);
        }
    }, [onAddToCart, product, isInCart]);

    // New: Remove from cart when quantity is 1 and user clicks '-'
    const handleDecrease = (e) => {
        e.stopPropagation();
        if (cartItem.quantity > 1) {
            onQuantityChange(productId, cartItem.quantity - 1);
        } else {
            onRemoveFromCart(productId);
        }
    };

    // Quantity controls for products already in cart
    return (
        <article className="relative p-4 transition-all duration-200 bg-white border rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1">
            {/* Discount Badge */}
            {productDiscount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                    {productDiscount}% OFF
                </div>
            )}

            {/* Product Image */}
            <div className="mb-4 cursor-pointer" onClick={handleProductClick}>
                <img 
                    src={productImage} 
                    alt={productName}
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="300"
                    className="object-cover w-full h-48 rounded-lg sm:h-56 lg:h-64" 
                    style={{ aspectRatio: '1/1' }}
                    onError={(e) => {
                        e.target.src = '/api/placeholder/300/300';
                    }}
                />
            </div>
            
            {/* Product Details */}
            <div className="space-y-3">
                <h3 
                    className="text-sm font-semibold text-gray-800 cursor-pointer sm:text-base hover:text-orange-700 line-clamp-2 min-h-[2.5rem]"
                    onClick={handleProductClick}
                >
                    {productName}
                </h3>
                <p className="text-xs text-gray-500 sm:text-sm">{productCategory}</p>
                <StarRating rating={productRating} reviewCount={productReviewCount} />
                
                {/* Price Section */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-red-700 sm:text-lg">₹{productPrice}</span>
                        {originalPrice > productPrice && (
                            <span className="text-xs text-gray-500 line-through">₹{originalPrice}</span>
                        )}
                    </div>
                </div>
                
                {/* Sleek Buttons */}
                <div className="flex items-center justify-between mt-2 gap-2">
                    <button
                        onClick={handleViewDetails}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-all duration-150 shadow-sm"
                        aria-label={`View details for ${productName}`}
                    >
                        Details
                    </button>
                    
                    <div className="flex gap-1 items-center">
                        {isInCart ? (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleDecrease}
                                    className="px-2 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs"
                                    aria-label="Decrease quantity"
                                >-</button>
                                <span className="px-2 text-xs">{cartItem.quantity}</span>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        onQuantityChange(productId, cartItem.quantity + 1);
                                    }}
                                    className="px-2 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs"
                                    aria-label="Increase quantity"
                                >+</button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCartClick}
                                className="px-3 py-1 text-xs font-medium rounded-md border transition-all duration-150 shadow-sm bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                                aria-label={`Add ${productName} to cart`}
                            >
                                <FaShoppingCart className="inline-block mr-1 -mt-0.5" /> Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
});

// Memoized Mobile Category Selector
const MobileCategorySelector = React.memo(({ categories, activeCategory, setActiveCategory }) => (
    <div className="mb-6 lg:hidden">
        <label htmlFor="category-select" className="sr-only">Select category</label>
        <select
            id="category-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-4 py-2 text-lg font-semibold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
            {categories.map(category => (
                <option key={category} value={category}>{category}</option>
            ))}
        </select>
    </div>
));

// Notification component with "View Cart" button
const CartNotification = React.memo(({ show, onViewCart }) => {
    if (!show) return null;
    return (
        <div
            className="fixed z-50 px-6 py-4 text-white rounded-xl shadow-2xl top-24 right-4 flex items-center gap-4 animate-fade-in-up"
            style={{
                minWidth: 220,
                background: "linear-gradient(90deg, #FFA500 0%, #FFB300 100%)", // orange-yellow gradient
                color: "#fff",
                fontWeight: 600
            }}
        >
            <span className="font-semibold">Added to cart!</span>
            <button
                onClick={onViewCart}
                className="ml-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-white shadow transition"
                style={{
                    background: "#FF5C00",
                    color: "#fff"
                }}
            >
                View Cart
            </button>
        </div>
    );
});

// Loading component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-12">
        <p className="text-red-600 mb-4">{message}</p>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
            Try Again
        </button>
    </div>
);

// Product Details Modal Component
const ProductDetailsModal = ({ isOpen, onClose, productId, onAddToCart }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await getProductById(productId);
                
                if (response.success) {
                    setProduct(response.product);
                } else {
                    setError(response.message || 'Failed to load product details');
                }
            } catch (err) {
                setError('Something went wrong while loading product details');
                console.error('Product details loading error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && productId) {
            fetchProductDetails();
        }
    }, [isOpen, productId]);

    const retryFetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getProductById(productId);
            
            if (response.success) {
                setProduct(response.product);
            } else {
                setError(response.message || 'Failed to load product details');
            }
        } catch (err) {
            setError('Something went wrong while loading product details');
            console.error('Product details loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            onAddToCart({ ...product, quantity });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close modal"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={retryFetchProductDetails}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : product ? (
                        <div className="space-y-6">
                            {/* Product Image */}
                            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg max-w-md mx-auto">
                                <img
                                    src={product.image?.[0]?.url || product.image?.[0] || '/api/placeholder/400/400'}
                                    alt={product.product || product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/api/placeholder/400/400';
                                    }}
                                />
                            </div>

                            {/* Product Info */}
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {product.product || product.name || product.title}
                                </h3>
                                
                                <p className="text-gray-600">
                                    {product.detail || product.description}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < Math.floor(product.rating || 0)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600 text-sm">
                                        ({product.rating || 0}/5) • {product.noOfReviews || 0} reviews
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-center space-x-3">
                                    <span className="text-3xl font-bold text-orange-600">
                                        ₹{product.discountedPrice || product.price}
                                    </span>
                                    {product.price > (product.discountedPrice || product.price) && (
                                        <>
                                            <span className="text-xl text-gray-500 line-through">
                                                ₹{product.price}
                                            </span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                                {product.discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Category and Stock */}
                                <div className="flex justify-center space-x-6 text-sm text-gray-600">
                                    <span>Category: {product.category}</span>
                                    <span>Stock: {product.quantity || product.stock} available</span>
                                </div>

                                {/* Display features if available */}
                                {product.features && product.features.length > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg text-left">
                                        <h4 className="font-semibold text-blue-800 mb-2">Key Features:</h4>
                                        <ul className="space-y-1">
                                            {product.features.slice(0, 3).map((feature, index) => (
                                                <li key={index} className="flex items-start space-x-2 text-xs">
                                                    <span className="text-blue-600 mt-1">•</span>
                                                    <span className="text-blue-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Display tags if available */}
                                {product.tags && product.tags.length > 0 && (
                                    <div>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {product.tags.slice(0, 4).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity Selector */}
                                <div className="flex items-center justify-center space-x-4">
                                    <span className="font-medium">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.quantity || 10, quantity + 1))}
                                            className="px-3 py-2 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FaShoppingCart />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Product not found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main BestsellersPage Component ---
export default function BestsellersPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on mount
        try {
            const stored = localStorage.getItem("pawsitivity_cart");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const notificationTimeout = useRef(null);

    const navigate = useNavigate();

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await getAllProducts();
                
                if (response.success) {
                    setProducts(response.products || response.data || []);
                } else {
                    setError(response.message || 'Failed to load products');
                }
            } catch (err) {
                setError('Something went wrong while loading products');
                console.error('Products loading error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get unique categories from products
    const categories = useMemo(() => {
        if (!products.length) return ['All'];
        const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];
        return ['All', ...uniqueCategories];
    }, [products]);

    // Filter products by category
    const displayedProducts = useMemo(() => {
        if (activeCategory === 'All') {
            return products;
        }
        return products.filter(product => product.category === activeCategory);
    }, [products, activeCategory]);

    // Sync cart state with localStorage and listen for cart updates
    useEffect(() => {
        const syncCart = () => {
            try {
                const stored = localStorage.getItem("pawsitivity_cart");
                setCart(stored ? JSON.parse(stored) : []);
            } catch {
                setCart([]);
            }
        };
        window.addEventListener("pawsitivity_cart_updated", syncCart);
        // Also sync on mount in case localStorage changed elsewhere
        syncCart();
        return () => window.removeEventListener("pawsitivity_cart_updated", syncCart);
    }, []);

    // Optimized add to cart handler with useCallback
    const handleAddToCart = useCallback((product) => {
        setCart(prevCart => {
            const productId = product._id || product.id;
            if (prevCart.some(item => (item._id || item.id) === productId)) return prevCart;
            const updatedCart = [...prevCart, { ...product, quantity: 1, addedAt: new Date().toISOString() }];
            localStorage.setItem("pawsitivity_cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("pawsitivity_cart_updated"));
            return updatedCart;
        });
        setShowCartNotification(true);
        if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
        notificationTimeout.current = setTimeout(() => setShowCartNotification(false), 3500);
        return () => clearTimeout(notificationTimeout.current);
    }, []);

    // Memoize category change handler
    const handleCategoryChange = useCallback((category) => {
        setActiveCategory(category);
    }, []);

    // Add quantity change handler for cart items
    const handleQuantityChange = useCallback((productId, newQuantity) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                const itemId = item._id || item.id;
                return itemId === productId
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item;
            });
            localStorage.setItem("pawsitivity_cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("pawsitivity_cart_updated"));
            return updatedCart;
        });
    }, []);

    // Remove product from cart by id
    const handleRemoveFromCart = useCallback((productId) => {
        setCart(prevCart => {
            const updatedCart = prevCart.filter(item => {
                const itemId = item._id || item.id;
                return itemId !== productId;
            });
            localStorage.setItem("pawsitivity_cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("pawsitivity_cart_updated"));
            return updatedCart;
        });
    }, []);

    // Handler for "View Cart" button in notification
    const handleViewCart = useCallback(() => {
        setShowCartNotification(false);
        navigate('/cart');
    }, [navigate]);

    // Retry function for error state
    const handleRetry = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getAllProducts();
            
            if (response.success) {
                setProducts(response.products || response.data || []);
            } else {
                setError(response.message || 'Failed to load products');
            }
        } catch (err) {
            setError('Something went wrong while loading products');
            console.error('Products loading error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cart item count
    const cartCount = cart.length;

    // Modal handlers
    const handleOpenModal = useCallback((productId) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    }, []);

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Floating Cart Button */}
            <button
                onClick={() => navigate('/cart')}
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

            <CartNotification show={showCartNotification} onViewCart={handleViewCart} />

            <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-8">
                {/* Header Section */}
                <header className="mb-6 text-center sm:mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                        Pawsitivity Shop
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        Protecting animals, empowering communities
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
                    
                    {/* Desktop Category Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1" role="navigation" aria-label="Product categories">
                        <div className="sticky top-24">
                            <h2 className="pb-3 mb-4 text-lg font-bold text-gray-900 border-b-2 border-orange-200">
                                Shop by Category
                            </h2>
                            <ul className="space-y-2" role="list">
                                {categories.map(category => (
                                    <li key={category}>
                                        <button 
                                            onClick={() => handleCategoryChange(category)}
                                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                activeCategory === category 
                                                    ? 'bg-orange-500 text-white shadow-md' 
                                                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                            }`}
                                            aria-current={activeCategory === category ? 'page' : undefined}
                                        >
                                            {category}
                                            <span className="float-right text-xs opacity-75">
                                                ({category === 'All' ? products.length : products.filter(p => p.category === category).length})
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Main Products Section */}
                    <section className="lg:col-span-3">
                        <MobileCategorySelector 
                            categories={categories}
                            activeCategory={activeCategory}
                            setActiveCategory={handleCategoryChange}
                        />

                        {/* Category Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                {activeCategory === 'All' ? 'All Products' : `${activeCategory} Products`}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {loading ? 'Loading...' : `${displayedProducts.length} products available`}
                            </p>
                        </div>

                        {/* Loading, Error, or Products Grid */}
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <ErrorMessage message={error} onRetry={handleRetry} />
                        ) : displayedProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No products found in this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 xl:grid-cols-3 sm:gap-6" role="list">
                                {displayedProducts.map(product => (
                                    <ProductCard 
                                        key={product._id || product.id} 
                                        product={product} 
                                        onAddToCart={handleAddToCart}
                                        cart={cart}
                                        onQuantityChange={handleQuantityChange}
                                        onRemoveFromCart={handleRemoveFromCart}
                                        onViewDetails={handleOpenModal}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Optimized Footer */}
            <footer className="mt-12 bg-gray-800">
                <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            © 2025 Pawsitivity. Making roads safer for animals, one collar at a time.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Product Details Modal */}
            <ProductDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productId={selectedProductId}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}

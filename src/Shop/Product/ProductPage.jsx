import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaShare, FaStar, FaCheck, FaTruck, FaLock, FaArrowLeft } from 'react-icons/fa';
import { getProductById } from '../../data/products';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
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
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const foundProduct = getProductById(id);
            
            setProduct(foundProduct);
            setLoading(false);
            
            // Reset image selection when product changes
            setSelectedImage(0);
        };

        loadProduct();
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('pawsitivity_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

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
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        
        const cartItem = {
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString()
        };
        
        const updatedCart = [...cart, cartItem];
        setCart(updatedCart);
        localStorage.setItem('pawsitivity_cart', JSON.stringify(updatedCart));
        // Notify other tabs/pages
        window.dispatchEvent(new Event("pawsitivity_cart_updated"));
        // Show success notification
        alert(`${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/address'); // Change from '/checkout' to '/address'
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

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    // Cart count for icon
    const cartCount = cart.length;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    <button onClick={() => navigate('/')} className="hover:text-orange-600">Home</button>
                    <span>/</span>
                    <button onClick={() => navigate('/shop')} className="hover:text-orange-600">Shop</button>
                    <span>/</span>
                    <span className="text-gray-900 truncate max-w-[120px] sm:max-w-xs">{product.name}</span>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-4 sm:mb-6"
                >
                    <FaArrowLeft />
                    <span>Back to Products</span>
                </button>

                {/* Cart Button (always visible, not dependent on login) */}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-md mx-auto">
                            <img
                                src={product.images ? product.images[selectedImage] : product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto justify-center">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${
                                            selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1
                                className="font-bold text-gray-900 mb-2 break-words leading-tight"
                                style={{
                                    fontSize: '2rem', // force 16px on all screens
                                    maxWidth: '100%',
                                    wordBreak: 'break-word',
                                    lineHeight: '1.3',
                                }}
                            >
                                {product.name}
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">by {product.author}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-gray-600 text-xs sm:text-sm">({product.reviewCount} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl sm:text-3xl font-bold text-orange-600">₹{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-lg sm:text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                            )}
                            {product.originalPrice && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                                    Save ₹{product.originalPrice - product.price}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center space-x-2">
                            <FaCheck className="text-green-500" />
                            <span className="text-green-600 font-medium text-sm sm:text-base">
                                In Stock ({product.stockCount} available)
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4">
                            <span className="font-medium text-sm sm:text-base">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                    className="px-3 py-2 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                            >
                                <FaShoppingCart />
                                <span>Add to Cart</span>
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`px-4 py-3 rounded-lg border transition-colors ${
                                    isWishlisted ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <FaHeart className={isWishlisted ? 'text-red-500' : ''} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-3 text-base sm:text-lg">Key Features:</h3>
                            <ul className="space-y-2">
                                {product.features?.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center space-x-6 pt-6 border-t">
                            <div className="flex items-center space-x-2">
                                <FaTruck className="text-green-500" />
                                <span className="text-sm text-gray-600">Free Shipping</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaLock className="text-blue-500" />
                                <span className="text-sm text-gray-600">30-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex flex-wrap space-x-4 sm:space-x-8 px-2 sm:px-6">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 ${
                                        activeTab === tab
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-4 sm:p-6">
                        {activeTab === 'description' && (
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{product.description}</p>
                                {product.benefits && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Benefits:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            {product.benefits.map((benefit, index) => (
                                                <li key={index}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="space-y-4">
                                {product.specifications && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="font-medium text-gray-700">{key}:</span>
                                                <span className="text-gray-600">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Customer reviews will be displayed here.</p>
                                <p className="text-sm text-gray-400 mt-2">Feature coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;

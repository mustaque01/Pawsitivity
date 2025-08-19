import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryProducts, getProductsByCategory } from '../data/products';

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

// Optimized Product Card with lazy loading and proper image sizing
const ProductCard = React.memo(({ product, onAddToCart }) => {
    const navigate = useNavigate();
    
    const handleProductClick = useCallback(() => {
        navigate(`/product/${product.id}`);
    }, [navigate, product.id]);

    const handleAddToCartClick = useCallback((e) => {
        e.stopPropagation();
        onAddToCart(product);
    }, [onAddToCart, product]);

    return (
        <article className="relative p-4 transition-all duration-200 bg-white border rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1">
            {/* Optimized Product Image with proper sizing and lazy loading */}
            <div className="mb-4 cursor-pointer" onClick={handleProductClick}>
                <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="300"
                    className="object-cover w-full h-48 rounded-lg sm:h-56 lg:h-64" 
                    style={{ aspectRatio: '1/1' }}
                />
            </div>
            
            {/* Product Details */}
            <div className="space-y-3">
                <h3 
                    className="text-sm font-semibold text-gray-800 cursor-pointer sm:text-base hover:text-orange-700 line-clamp-2 min-h-[2.5rem]"
                    onClick={handleProductClick}
                >
                    {product.name}
                </h3>
                
                <p className="text-xs text-gray-500 sm:text-sm">by {product.author}</p>
                
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 sm:text-sm">{product.format}</span>
                </div>
                
                <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:justify-between">
                    <span className="text-lg font-bold text-red-700 sm:text-xl">₹{product.price}.00</span>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleProductClick}
                            className="px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 sm:text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                            aria-label={`View details for ${product.name}`}
                        >
                            View Details
                        </button>
                        <button
                            onClick={handleAddToCartClick}
                            className="px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 sm:text-sm bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md"
                            aria-label={`Add ${product.name} to cart`}
                        >
                            Add to Cart
                        </button>
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

// Notification component
const CartNotification = React.memo(({ show }) => {
    if (!show) return null;
    
    return (
        <div className="fixed z-50 px-4 py-2 text-white transition-all duration-300 bg-green-500 rounded-lg shadow-lg top-20 right-4" role="alert">
            ✓ Added to cart!
        </div>
    );
});

// --- Main BestsellersPage Component ---
export default function BestsellersPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [showCartNotification, setShowCartNotification] = useState(false);

    // Memoize categories to prevent re-computation
    const categories = useMemo(() => ['All', ...Object.keys(categoryProducts)], []);

    // Memoize displayed products
    const displayedProducts = useMemo(() => 
        getProductsByCategory(activeCategory), 
        [activeCategory]
    );

    // Optimized add to cart handler with useCallback
    const handleAddToCart = useCallback((product) => {
        setCart(prevCart => [...prevCart, product]);
        setShowCartNotification(true);
        
        // Clear notification after 3 seconds
        const timer = setTimeout(() => setShowCartNotification(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Memoize category change handler
    const handleCategoryChange = useCallback((category) => {
        setActiveCategory(category);
    }, []);

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            <CartNotification show={showCartNotification} />

            <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-8">
                {/* Header Section */}
                <header className="mb-6 text-center sm:mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                        Pawsitivity Shop
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        Protecting animals, empowering communities
                    </p>
                    {cart.length > 0 && (
                        <div className="inline-flex items-center px-3 py-1 mt-2 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full">
                            🛒 {cart.length} items in cart
                        </div>
                    )}
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
                                                ({category === 'All' ? Object.values(categoryProducts).flat().length : categoryProducts[category]?.length || 0})
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
                                Bestsellers in {activeCategory}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {displayedProducts.length} products available
                            </p>
                        </div>

                        {/* Optimized Products Grid */}
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 xl:grid-cols-3 sm:gap-6" role="list">
                            {displayedProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Optimized Footer */}
            <footer className="mt-12 bg-gray-800">
                <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            © 2024 Pawsitivity. Making roads safer for animals, one collar at a time.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

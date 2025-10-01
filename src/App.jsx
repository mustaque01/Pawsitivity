// React and Router imports
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Styles
import './App.css'

// Core Components
import Navbar from './Components/Navbar'
import Footer from './Components/Footer/Footer'
import OfferSlider from './Components/OfferSlider'

// Home Page Components
import HeroCarousel from './Components/HeroCarousel'
import AnimatedHeader from './Components/AnimatedHeader'
import Collaborators from './Components/Collaborators'
import TestimonialsCarousel from './Components/TestimonialsCarousel'
import CustomerStoriesMasterFixed from './Components/CustomerStoriesMasterFixed'
import Stats from './Components/Stats Page/Stats'
import EmpoweringSection from './empowering section/EmpoweringSection'

// Static Pages
import ContactUs from './Components/contactus'
import MediaPage from './Components/MediaPage'
import AboutUs from './Components/Aboutus/Aboutus'

// Auth Components
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup'
import AdminLogin from './Components/Auth/AdminLogin'
import { AuthProvider, useAuth } from './Components/Auth/AuthContext'

// Shop Components
import AdminDashboard from './Components/Admin/AdminDashboard'
import BestsellersPage from './Shop/BestsellersPage'
import ProductPage from './Shop/Product/ProductPage'
import CartPage from './Shop/CartPage'
import AddressPage from './Shop/AddressPage'
import CheckoutPage from './Shop/CheckoutPage'
import Order from './Shop/OrderPage'
import TrackingPage from './Components/TrackingPage'

// Admin Components
import AdminShipments from './Components/Admin/AdminShipments'
import AddOfferPage from './Components/Admin/AddOfferPage'

// Context Providers
import { CartProvider } from './Context/CartContext';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
            <p className="mb-4 text-gray-600">We're sorry for the inconvenience. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected route component
const ProtectedRoute = ({ children, isLoggedIn, userType, requiredUserType, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Home page component
const HomePage = () => {
  return (
    <div className="home-page">
      {/* Offer Slider - Always visible at top */}
      <OfferSlider />
      <HeroCarousel />
      <AnimatedHeader />
      <Stats />
      <Collaborators />
      <CustomerStoriesMasterFixed />
      <TestimonialsCarousel />
      <EmpoweringSection />
    </div>
  );
};

// Layout wrapper for pages with footer
const LayoutWithFooter = ({ children }) => (
  <>
    {children}
    <Footer />
  </>
);

// 404 Not Found Component
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="mb-4 text-6xl font-bold text-orange-500">404</h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="mb-6 text-gray-600">The page you're looking for doesn't exist.</p>
      <a 
        href="/" 
        className="inline-block px-6 py-3 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
      >
        Go Home
      </a>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const { isLoggedIn, userType, logout, loading } = useAuth();

  // Check if we're on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <div className="App">
        {/* Only show main navbar for non-admin routes */}
        {!isAdminRoute && (
          <Navbar 
            isLoggedIn={isLoggedIn} 
            userType={userType}
            onLogout={logout}
          />
        )}
        <Routes>
          {/* Auth routes with no navbar or footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Regular routes with footer */}
          <Route path="/" element={<LayoutWithFooter><HomePage /></LayoutWithFooter>} />
          <Route path="/shop" element={<LayoutWithFooter><BestsellersPage /></LayoutWithFooter>} />
          <Route path="/product/:id" element={<LayoutWithFooter><ProductPage /></LayoutWithFooter>} />
          <Route path="/about" element={<LayoutWithFooter><AboutUs /></LayoutWithFooter>} />
          <Route path="/contact" element={<LayoutWithFooter><ContactUs /></LayoutWithFooter>} />
          <Route path="/media" element={<LayoutWithFooter><MediaPage /></LayoutWithFooter>} />
          <Route path="/address" element={<LayoutWithFooter><AddressPage /></LayoutWithFooter>} />
          <Route path="/checkout" element={<LayoutWithFooter><CheckoutPage /></LayoutWithFooter>} />
          <Route path="/Order" element={<LayoutWithFooter><Order /></LayoutWithFooter>} />
          <Route path="/track" element={<LayoutWithFooter><TrackingPage /></LayoutWithFooter>} />
          <Route path="/track/:orderId" element={<LayoutWithFooter><TrackingPage /></LayoutWithFooter>} />
          
          {/* Admin routes that need protection */}
          <Route 
            path="/admin/add-offer" 
            element={
              <ProtectedRoute 
                isLoggedIn={isLoggedIn} 
                userType={userType} 
                requiredUserType="admin" 
                loading={loading}
              >
                <LayoutWithFooter><AddOfferPage /></LayoutWithFooter>
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/admin/shipments" 
            element={
              <ProtectedRoute 
                isLoggedIn={isLoggedIn} 
                userType={userType} 
                requiredUserType="admin" 
                loading={loading}
              >
                <LayoutWithFooter><AdminShipments /></LayoutWithFooter>
              </ProtectedRoute>
            }
          />
          
          {/* Cart route (no footer for better UX) */}
          <Route path="/cart" element={<CartPage />} />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute 
                isLoggedIn={isLoggedIn} 
                userType={userType} 
                requiredUserType="admin" 
                loading={loading}
              >
                <LayoutWithFooter><AdminDashboard /></LayoutWithFooter>
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found Route */}
          <Route path="*" element={<LayoutWithFooter><NotFound /></LayoutWithFooter>} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

function MainApp() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider> {/* Moved CartProvider here */}
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return (
    <MainApp />
  );
}

export default App;
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import HeroCarousel from './Components/HeroCarousel'
import AnimatedHeader from './Components/AnimatedHeader'
import Collaborators from './Components/Collaborators'
import TestimonialsCarousel from './Components/TestimonialsCarousel'
import CustomerStoriesMasterFixed from './Components/CustomerStoriesMasterFixed'
import Stats from './Components/Stats Page/Stats'
import Footer from './Components/Footer/Footer'
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup'
import AdminLogin from './Components/Auth/AdminLogin'
import { AuthProvider, useAuth } from './Components/Auth/AuthContext'
import AdminDashboard from './Components/Admin/AdminDashboard'
import EmpoweringSection from './empowering section/EmpoweringSection'
import ContactUs from './Components/contactus';
import BestsellersPage from './Shop/BestsellersPage';
import AboutUs from './Components/Aboutus/Aboutus'
import ProductPage from './Shop/Product/ProductPage'
import CartPage from './Shop/CartPage';
import AddressPage from './Shop/AddressPage';
import CheckoutPage from './Shop/CheckoutPage';

// Protected route component
const ProtectedRoute = ({ children, isLoggedIn, userType, requiredUserType, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
    <>
      <HeroCarousel />
      <AnimatedHeader />
      <Stats/>
      <Collaborators />
      <CustomerStoriesMasterFixed />
      <TestimonialsCarousel />
      <EmpoweringSection />
    </>
  );
};

function AppContent() {
  const location = useLocation();
  const { isLoggedIn, userType, logout, loading } = useAuth();

  // Check if we're on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
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

        {/* Regular routes with navbar and footer */}
        <Route 
          path="/" 
          element={
            <>
              <HomePage />
              <Footer />
            </>
          } 
        />
        <Route 
          path="/shop"
          element={
            <>
              <BestsellersPage />
              <Footer />
            </>
          }
        />
        <Route 
          path="/product/:id" 
          element={
            <>
              <ProductPage />
              <Footer />
            </>
          }
        />
        <Route 
          path="/about" 
          element={
            <>
              <AboutUs />
              <Footer />
            </>
          }
        />
        <Route 
          path="/contact" 
          element={
            <>
              <ContactUs /> 
              <Footer />
            </>
          }
        />
        <Route 
          path="/cart" 
          element={
            <>
              <CartPage />
              <Footer />
            </>
          }
        />
        <Route 
          path="/address" 
          element={
            <>
              <AddressPage />
              <Footer />
            </>
          }
        />
        <Route 
          path="/checkout" 
          element={
            <>
              <CheckoutPage />
              <Footer />
            </>
          }
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute 
              isLoggedIn={isLoggedIn} 
              userType={userType} 
              requiredUserType="admin" 
              loading={loading}
            >
              <AdminDashboard />
              <Footer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
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
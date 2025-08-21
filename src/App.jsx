import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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

function MainApp() {
  const { isLoggedIn, userType, logout, loading } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="app">
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
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
                <HomePage />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/shop" 
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
                <BestsellersPage />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
                <ProductPage />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/about" 
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
                <AboutUs />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
                <ContactUs />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
                <CartPage />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/address" 
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
                <AddressPage />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
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
                <Navbar 
                  isLoggedIn={isLoggedIn} 
                  userType={userType} 
                  onLogout={handleLogout}
                />
                <AdminDashboard />
                <Footer />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default App
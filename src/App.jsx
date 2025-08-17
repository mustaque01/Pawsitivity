import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import HeroCarousel from './Components/HeroCarousel'
import AnimatedHeader from './Components/AnimatedHeader'
import Collaborators from './Components/Collaborators'
import TestimonialsCarousel from './Components/TestimonialsCarousel'
import CustomerStoriesMasterFixed from './Components/CustomerStoriesMasterFixed'
import Stats from './Components/Stats'
import Footer from './Components/Footer/Footer'
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup'
import AdminLogin from './Components/Auth/AdminLogin'
import { AuthProvider, useAuth } from './Components/Auth/AuthContext'
import AdminDashboard from './Components/Admin/AdminDashboard'

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
          <Route 
            path="/login" 
            element={<Login />} 
          />
          <Route 
            path="/signup" 
            element={<Signup />} 
          />
          <Route 
            path="/admin/login" 
            element={<AdminLogin />} 
          />
          
          {/* Regular routes with navbar and footer */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar 
                  isLoggedIn={isLoggedIn} 
                  userType={userType} 
                  onLogout={handleLogout}
                />
                <HomePage />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/shop" 
            element={
              <>
                <Navbar 
                  isLoggedIn={isLoggedIn} 
                  userType={userType} 
                  onLogout={handleLogout}
                />
                <div className="container mx-auto py-8">Shop Page</div>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/about" 
            element={
              <>
                <Navbar 
                  isLoggedIn={isLoggedIn} 
                  userType={userType} 
                  onLogout={handleLogout}
                />
                <div className="container mx-auto py-8">About Us Page</div>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <>
                <Navbar 
                  isLoggedIn={isLoggedIn} 
                  userType={userType} 
                  onLogout={handleLogout}
                />
                <div className="container mx-auto py-8">Contact Page</div>
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
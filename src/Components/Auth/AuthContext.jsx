import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userType: null,
    user: null,
    loading: true, // Start with loading as true
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setAuthState({
          isLoggedIn: userData.isAuthenticated,
          userType: userData.userType,
          user: userData,
          loading: false, // Set loading to false after loading user data
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('user');
        setAuthState((prevState) => ({
          ...prevState,
          loading: false, // Ensure loading is false even if there's an error
        }));
      }
    } else {
      setAuthState((prevState) => ({
        ...prevState,
        loading: false, // No user data, set loading to false
      }));
    }
  }, []);




  // Login function
  const login = (userData) => {
    const userWithAuth = {
      ...userData,
      isAuthenticated: true,
    };

    localStorage.setItem('user', JSON.stringify(userWithAuth));

    setAuthState({
      isLoggedIn: true,
      userType: userData.userType,
      user: userWithAuth,
      loading: false,
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');

    setAuthState({
      isLoggedIn: false,
      userType: null,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
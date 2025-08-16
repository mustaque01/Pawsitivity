import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { signup } from '../../Apis/auth'; 

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with one uppercase letter and one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // ✅ Call backend signup API
      const result = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        // ✅ Save user in AuthContext
        login({
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          userType: result.user.role || 'user',
          isAuthenticated: true
        });

        navigate('/'); // redirect on success
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.', error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 flex items-center justify-center p-4 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm lg:max-w-4xl flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Left Panel - Welcome Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 lg:p-10 text-white flex-col justify-center items-center order-2 lg:order-1">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Hello, Friend!</h2>
          <p className="mb-4 lg:mb-6 text-center text-xs lg:text-sm">Enter your personal details and start your journey with us</p>
          <button
            onClick={() => navigate('/login')}
            className="border border-white px-4 lg:px-6 py-2 rounded-full font-medium hover:bg-white hover:text-yellow-600 transition text-sm lg:text-base"
          >
            SIGN IN
          </button>

          {/* Admin Portal Link */}
          <div className="mt-4 lg:mt-6 text-center">
            <p className="text-yellow-100 text-xs mb-2">Are you an admin?</p>
            <button
              onClick={() => navigate('/admin/login')}
              className="text-white underline hover:text-yellow-200 text-xs lg:text-sm font-medium transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 order-1 lg:order-2">
          <h2 className="text-xl lg:text-2xl font-bold text-yellow-600 text-center mb-4 lg:mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            {/* Name Fields */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm lg:text-base ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.firstName && <p className="text-red-500 text-xs lg:text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm lg:text-base ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.lastName && <p className="text-red-500 text-xs lg:text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm lg:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.email && <p className="text-red-500 text-xs lg:text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm lg:text-base ${errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 lg:top-3.5 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && <p className="text-red-500 text-xs lg:text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm lg:text-base ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 lg:top-3.5 text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-xs lg:text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-3 w-3 lg:h-4 lg:w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="text-xs lg:text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-yellow-600 hover:text-yellow-700 underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-yellow-600 hover:text-yellow-700 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs lg:text-sm mt-1">{errors.agreeToTerms}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && <p className="text-red-500 text-sm mt-1">{errors.submit}</p>}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${isLoading
                  ? 'bg-yellow-300 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 shadow-md'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          {/* Social Signup */}
          <div className="my-6 text-center text-gray-500">Or continue with</div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleSocialSignup('google')}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              <FaGoogle className="text-red-500" />
            </button>
            <button
              onClick={() => handleSocialSignup('facebook')}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              <FaFacebook className="text-blue-600" />
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              Already have an account?{' '}
              <button
                className="text-yellow-600 font-semibold hover:underline"
                onClick={() => navigate('/login')}
              >
                Login here
              </button>
            </div>
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Back to Home
              </button>
            </div>
            <div className="lg:hidden text-center mt-4">
              <button
                onClick={() => navigate('/admin/login')}
                className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
              >
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

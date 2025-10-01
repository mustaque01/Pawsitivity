import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../../Apis/auth";
export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // Call backend API
      const res = await loginAPI(formData);

      if (res.success) {
        // Store full user object in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({ ...res.user, isAuthenticated: true })
        );
        navigate("/");
      } else {
        setErrors({ submit: res.message || "Invalid credentials" });
      }
    } catch (err) {
      setErrors({ submit: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Left Panel */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 lg:p-10 text-amber-800 flex-col justify-center items-center order-2 lg:order-1">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-center">
            Hello, Friend!
          </h2>
          <p className="mb-6 text-center text-sm px-4">
            Enter your personal details and start your journey with us
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="border border-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-yellow-600 transition"
          >
            SIGN UP
          </button>
          <div className="mt-6 text-center">
            <p className="text-amber-800 text-xs mb-2">Are you an admin?</p>
            <button
              onClick={() => navigate("/admin/login")}
              className="text-amber-800 underline hover:text-yellow-200 text-sm font-medium transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 order-1 lg:order-2">
          <h2 className="text-xl lg:text-2xl font-bold text-yellow-600 text-center mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm lg:text-base ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs lg:text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm lg:text-base ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 lg:top-2.5 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div className="flex justify-between items-center mt-1">
                {errors.password ? (
                  <p className="text-red-500 text-xs lg:text-sm">{errors.password}</p>
                ) : errors.submit ? (
                  <p className="text-red-500 text-xs lg:text-sm">{errors.submit}</p>
                ) : (
                  <span></span>
                )}
                <button
                  type="button"
                  onClick={() => console.log('Forgot password clicked')}
                  className="text-yellow-600 hover:text-yellow-700 text-xs lg:text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs lg:text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            {errors.submit && (
              <p className="text-red-500 text-xs lg:text-sm mt-1">
                {errors.submit}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 lg:py-3 rounded-lg font-semibold text-white transition-all text-sm lg:text-base ${
                isLoading
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 shadow-md"
              }`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>
          <div className="my-4 lg:my-6 text-center text-gray-500 text-sm">
            Or continue with
          </div>
          <div className="flex gap-3 lg:gap-4 justify-center">
            <button
              onClick={() => handleSocialLogin("google")}
              className="p-2 lg:p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaGoogle className="text-red-500 text-sm lg:text-base" />
            </button>
            <button
              onClick={() => handleSocialLogin("facebook")}
              className="p-2 lg:p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaFacebook className="text-blue-600 text-sm lg:text-base" />
            </button>
          </div>
          <div className="mt-6 text-center text-sm">
            Don’t have an account?
            <button
              className="text-yellow-600 font-semibold ml-2 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up here
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Back to Home
            </button>
          </div>
          <div className="lg:hidden text-center mt-4">
            <button
              onClick={() => navigate("/admin/login")}
              className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

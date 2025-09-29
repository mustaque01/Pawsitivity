/**
 * Environment variables utility file
 * This provides a consistent way to access environment variables without worrying about prefixes
 */

// Get an environment variable with fallback
export const getEnv = (key, fallback = '') => {
  // Try different ways to access the variable
  const value = import.meta.env[key] || 
                import.meta.env[`VITE_${key}`] || 
                window.__ENV__?.[key] || 
                fallback;
  
  console.log(`ENV: Getting ${key}, found: ${value || '(not found, using fallback)'}`);
  return value;
};

// Commonly used environment variables
export const ENV = {
  BACKEND_URL: getEnv('BACKEND_URL', 'http://localhost:8000'),
  RAZORPAY_KEY_ID: getEnv('RAZORPAY_KEY_ID', 'rzp_live_RNKrNlZm3s6Kp3'),
  MODE: getEnv('MODE', 'development'),
};

// Add environment variables to window for emergency access
window.__ENV__ = {
  ...ENV,
  // Add any additional variables here
};

export default ENV;
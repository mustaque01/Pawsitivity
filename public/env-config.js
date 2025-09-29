// This script dynamically injects environment variables at runtime
// Allows for configuration without rebuilding the application

(function() {
  // Create a global environment object if it doesn't exist
  window.__ENV__ = window.__ENV__ || {};
  
  // Inject variables that might come from the server
  // These values will be overridden by any env.js values loaded later
  window.__ENV__.RAZORPAY_KEY_ID = 'rzp_live_RNKrNlZm3s6Kp3';
  window.__ENV__.BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : window.location.protocol + '//' + window.location.hostname + ':8000';

  console.log('Environment variables injected at runtime:', window.__ENV__);
})();
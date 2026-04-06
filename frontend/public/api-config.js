/**
 * API Configuration Helper
 * 
 * Usage:
 * - Development: Uses http://localhost:3000 or proxy
 * - Production: Uses VITE_API_URL from environment
 * 
 * Example:
 * fetch(getApiUrl('/recipes'))
 */

const API_URL = typeof __API_URL__ !== 'undefined' ? __API_URL__ : (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://cooksmart-backend-nr48.onrender.com');

/**
 * Get full API URL
 * @param {string} path - API path (e.g., '/recipes', '/auth/login')
 * @returns {string} Full URL
 */
function getApiUrl(path) {
  // If it's a relative path and we're in development, use relative path
  // (Vite proxy will handle it)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return path;
  }
  
  // In production, use full API URL
  return API_URL + path;
}

/**
 * Fetch with API URL prefix
 * @param {string} path - API path
 * @param {object} options - Fetch options
 * @returns {Promise} Fetch response
 */
async function fetchApi(path, options = {}) {
  const url = getApiUrl(path);
  
  // Ensure credentials are sent for cookies (if needed)
  const fetchOptions = {
    ...options,
    credentials: 'include', // For cookies/sessions
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  const response = await fetch(url, fetchOptions);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_URL, getApiUrl, fetchApi };
}

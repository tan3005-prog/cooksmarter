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

const API_URL = typeof __API_URL__ !== 'undefined' && __API_URL__ ? __API_URL__ : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : '');

/**
 * Get full API URL
 * @param {string} path - API path (e.g., '/recipes', '/auth/login')
 * @returns {string} Full URL
 */
function getApiUrl(path) {
  if (typeof path !== 'string') {
    path = String(path);
  }

  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  if (API_URL) {
    return API_URL.replace(/\/$/, '') + path;
  }

  // Use relative API path in development and production behind Vercel rewrites.
  return path;
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

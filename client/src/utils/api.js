import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  withCredentials: false, // Set to false for CORS requests
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Ensure that cookies are not sent and credentials are not included
  // This can help with CORS issues
  xsrfCookieName: null,
  xsrfHeaderName: null,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`Error response from ${error.config.url}:`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error(`No response received for request to ${error.config.url}`);
      console.error('Request details:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

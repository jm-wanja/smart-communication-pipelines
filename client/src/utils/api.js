import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

export default api;

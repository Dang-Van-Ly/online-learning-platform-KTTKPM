import axios from 'axios';

// Base URL for API gateway, defined in .env file as REACT_APP_API_URL
// Example: REACT_APP_API_URL=http://localhost:8080
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  // You can add common headers here if needed
});

export default api;

// src/api/axios.js
import axios from "axios";

// ✅ Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor - Add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor - Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
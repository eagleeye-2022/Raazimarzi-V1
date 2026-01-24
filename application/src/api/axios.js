
import axios from "axios";

// Base URL from environment variable, fallback to localhost for dev
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // optional: fail if request takes too long
});

// Automatically add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: intercept responses to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error or server is down");
    }
    return Promise.reject(error);
  }
);

export default api;

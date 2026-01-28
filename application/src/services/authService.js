// src/services/authService.js
import axios from "axios";

// ✅ FIXED: Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const AUTH_ENDPOINT = `${API_URL}/auth`;

/* ================= SIGNUP ================= */
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_ENDPOINT}/signup`, userData);
    
    if (response.data.success && response.data.token) {
      // Store auth data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

/* ================= LOGIN ================= */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_ENDPOINT}/login`, {
      email,
      password,
    });

    if (response.data.success && response.data.token) {
      // Store auth data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

/* ================= LOGOUT ================= */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
};

/* ================= GET CURRENT USER ================= */
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      return null;
    }

    const response = await axios.get(`${AUTH_ENDPOINT}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      // Update stored user data
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    }

    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    // If token is invalid, clear auth data
    if (error.response?.status === 401) {
      logout();
    }
    return null;
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${AUTH_ENDPOINT}/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send OTP" };
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${AUTH_ENDPOINT}/verify-otp`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "OTP verification failed" };
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await axios.post(`${AUTH_ENDPOINT}/reset-password`, {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Password reset failed" };
  }
};

/* ================= HELPER FUNCTIONS ================= */

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get user from localStorage
export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Get user role
export const getUserRole = () => {
  const user = getStoredUser();
  return user?.role || null;
};

// Check if user has specific role
export const hasRole = (role) => {
  return getUserRole() === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getToken,
  getStoredUser,
  isAuthenticated,
  getUserRole,
  hasRole,
  hasAnyRole,
};
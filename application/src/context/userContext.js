// src/context/userContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../api/axios";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch user data
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // ✅ Updated to use /auth/me endpoint
      const response = await api.get("/auth/me");
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError(err.response?.data?.message || "Failed to fetch user data");
      
      // If unauthorized, clear token
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Refresh user data
  const refreshUser = useCallback(() => {
    return fetchUser();
  }, [fetchUser]);

  // ✅ Update user profile with file upload
  const updateUserProfile = async (formData) => {
    try {
      // ✅ Updated to use /auth/profile endpoint
      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error("Profile update error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile",
      };
    }
  };

  // ✅ Clear user data (for logout)
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // ✅ Helper to get avatar URL with fallback
  const getAvatarUrl = useCallback((avatarUrl) => {
    // If user has uploaded avatar, use it
    if (avatarUrl && avatarUrl !== "") {
      return avatarUrl;
    }
    
    // Otherwise, generate a nice placeholder with user's initials
    const userName = user?.name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=200`;
  }, [user?.name]);

  // ✅ Load user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = {
    user,
    loading,
    error,
    updateUserProfile,
    refreshUser,
    clearUser,
    getAvatarUrl,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
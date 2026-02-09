// src/context/userContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
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
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get("/api/users/me");
      setUser({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        avatar: res.data.avatar || "",
        dob: res.data.dob || "",
        gender: res.data.gender || "",
        city: res.data.city || "",
        state: res.data.state || "",
        country: res.data.country || "India",
        pincode: res.data.pincode || "",
        address: res.data.address || "",
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(err.response?.data?.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (formData) => {
    try {
      const res = await api.put("/api/users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        avatar: res.data.avatar || "",
        dob: res.data.dob || "",
        gender: res.data.gender || "",
        city: res.data.city || "",
        state: res.data.state || "",
        country: res.data.country || "India",
        pincode: res.data.pincode || "",
        address: res.data.address || "",
      });

      return { success: true, message: "Profile updated successfully" };
    } catch (err) {
      console.error("Failed to update user profile:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile",
      };
    }
  };

  // Refresh user data
  const refreshUser = () => {
    fetchUserProfile();
  };

  // Clear user data (for logout)
  const clearUser = () => {
    setUser({
      name: "",
      email: "",
      phone: "",
      avatar: "",
      dob: "",
      gender: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      address: "",
    });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const value = {
    user,
    loading,
    error,
    updateUserProfile,
    refreshUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
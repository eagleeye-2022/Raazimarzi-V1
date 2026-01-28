// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { 
  getCurrentUser, 
  logout as logoutService,
  getStoredUser,
  isAuthenticated
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      // First check if there's a stored user
      const storedUser = getStoredUser();
      
      if (storedUser && isAuthenticated()) {
        setUser(storedUser);
        setIsAuth(true);
        
        // Optionally fetch fresh user data from server
        try {
          const freshUser = await getCurrentUser();
          if (freshUser) {
            setUser(freshUser);
          }
        } catch (error) {
          // If fetching fresh data fails, keep using stored data
          console.warn("Could not fetch fresh user data:", error);
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const loginUser = useCallback((userData) => {
    setUser(userData);
    setIsAuth(true);
  }, []);

  // Logout function
  const logoutUser = useCallback(() => {
    logoutService();
    setUser(null);
    setIsAuth(false);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await getCurrentUser();
      if (freshUser) {
        setUser(freshUser);
        setIsAuth(true);
        return freshUser;
      } else {
        logoutUser();
        return null;
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      logoutUser();
      return null;
    }
  }, [logoutUser]);

  // Check if user has a specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  const value = {
    user,
    loading,
    isAuth,
    loginUser,
    logoutUser,
    refreshUser,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
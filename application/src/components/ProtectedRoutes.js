// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

/**
 * ProtectedRoute component
 * Protects routes that require authentication
 * 
 * Usage:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 * 
 * With role restriction:
 * <Route path="/admin/dashboard" element={
 *   <ProtectedRoute allowedRoles={['admin']}>
 *     <AdminDashboard />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log for debugging
    console.log("ProtectedRoute - Auth Status:", {
      isAuth,
      user: user?.email,
      role: user?.role,
      loading,
    });
  }, [isAuth, user, loading]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        <div>
          <div style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          Loading...
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuth || !user) {
    // Save the current location they were trying to access
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "mediator":
        return <Navigate to="/mediator/dashboard" replace />;
      case "case-manager":
        return <Navigate to="/case-manager/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  // User is authenticated and has proper role - render children
  return children;
};

export default ProtectedRoute;
// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    // redirect to role-appropriate dashboard if unauthorized
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "mediator") return <Navigate to="/mediator/dashboard" replace />;
    if (role === "case_manager") return <Navigate to="/case-manager/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

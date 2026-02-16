// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios"; // production-ready axios instance

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user", // default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Check for redirect query
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // 🔹 POST to backend register route
      const res = await api.post("/user/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      });

      alert(res.data.message || "Registered successfully. Please login.");

      // 🔹 Redirect after registration
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Account</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="mediator">Mediator</option>
          <option value="case-manager">Case Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate(`/login${redirectPath ? `?redirect=${redirectPath}` : ""}`)}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;

// src/pages/Signup.js
import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import signupBg from "../assets/icons/rec.png";
import google from "../assets/icons/google.png";
import linkdin from "../assets/icons/linkdin.png";
import phone from "../assets/icons/phone.png";
import fb from "../assets/icons/fb.png";
import axios from "axios";

// ✅ FIXED: Use correct API URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Read redirect query from website
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  /* ================= SIGNUP (DIRECT - NO OTP) ================= */
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // ✅ FIXED: Changed to /auth/signup
      const res = await axios.post(`${API_URL}/auth/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      });

      if (res.data.success && res.data.token) {
        // Store token and user info
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setMessage("Signup successful! Redirecting...");

        // Redirect after 1 second
        setTimeout(() => {
          if (redirectPath) {
            navigate(redirectPath, { replace: true });
          } else {
            // Redirect based on role
            switch (res.data.user.role) {
              case "admin":
                navigate("/admin/dashboard", { replace: true });
                break;
              case "mediator":
                navigate("/mediator/dashboard", { replace: true });
                break;
              case "case-manager":
                navigate("/case-manager/dashboard", { replace: true });
                break;
              default:
                navigate("/user/dashboard", { replace: true });
            }
          }
        }, 1000);
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* LEFT IMAGE */}
        <div className="login-image">
          <img src={signupBg} alt="Signup" />
        </div>

        {/* RIGHT FORM */}
        <div className="login-form">
          <div className="logo">
            <img src="/logo.png" alt="Raazimarzi" />
            <span>ODR Platform</span>
          </div>

          <h2>Welcome to Raazimarzi</h2>
          <p className="subtitle">Register your account with us!</p>

          {/* Error Message */}
          {error && (
            <div className="error-message" style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="success-message" style={{
              backgroundColor: '#efe',
              color: '#393',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              border: '1px solid #cfc'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number (optional)"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <select 
                name="role" 
                value={form.role} 
                onChange={handleChange}
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="mediator">Mediator</option>
                <option value="case-manager">Case Manager</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Register Now"}
            </button>

            <p className="bottom-text">
              Already have an account?{" "}
              <Link to={`/login${redirectPath ? `?redirect=${redirectPath}` : ""}`}>
                Sign in
              </Link>
            </p>

            <div className="social-row">
              <span><img src={google} alt="Google" /></span>
              <span><img src={linkdin} alt="LinkedIn" /></span>
              <span><img src={phone} alt="Phone" /></span>
              <span><img src={fb} alt="Facebook" /></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
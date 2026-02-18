// src/pages/Signup.js
import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import signupBg from "../assets/icons/rec.png";
import google from "../assets/icons/google.png";
import linkdin from "../assets/icons/linkdin.png";
import phone from "../assets/icons/phone.png";
import fb from "../assets/icons/fb.png";
import api from "../api/axios";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false); // ✅ removed unused showPassword state

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/otp/send-otp", {
        email: form.email,
        type: "signup",
      });

      if (res.data?.success !== false) {
        setOtpSent(true);
        setMessage("OTP sent to your email");
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/otp/verify-otp", {
        email: form.email,
        otp,
        type: "signup",
      });

      if (res.data?.success !== false) {
        setOtpVerified(true);
        setMessage("OTP verified successfully");
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= COMPLETE SIGNUP ================= */
  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/signup", form);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setMessage("Signup successful! Redirecting...");

        setTimeout(() => {
          if (redirectPath) {
            navigate(redirectPath, { replace: true });
          } else {
            navigate("/user/dashboard", { replace: true });
          }
        }, 1000);
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-image">
          <img src={signupBg} alt="Signup" />
        </div>

        <div className="login-form">
          <div className="logo">
            <img src="/logo.png" alt="Raazimarzi" />
            <span>ODR Platform</span>
          </div>

          <h2>Welcome to Raazimarzi</h2>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          {!otpSent && (
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <button disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {otpSent && !otpVerified && (
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {otpVerified && (
            <form onSubmit={handleCompleteSignup}>
              <input name="name" placeholder="Full Name" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
              <input name="phone" placeholder="Phone" onChange={handleChange} />
              <button disabled={loading}>
                {loading ? "Creating..." : "Complete Signup"}
              </button>
            </form>
          )}

          <div className="social-row">
            <img src={google} alt="" />
            <img src={linkdin} alt="" />
            <img src={phone} alt="" />
            <img src={fb} alt="" />
          </div>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
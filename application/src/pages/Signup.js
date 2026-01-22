import React, { useState } from "react";
import "./Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import signupBg from "../assets/icons/rec.png"; 
import google from "../assets/icons/google.png";
import linkdin from "../assets/icons/linkdin.png";
import phone from "../assets/icons/phone.png";
import fb from "../assets/icons/fb.png";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
  });

  const [password, setPassword] = useState(""); // UI ONLY
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // form | otp
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ STEP 1: SEND OTP (unchanged backend)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setMessage("Sending OTP...");
      await axios.post("http://localhost:5000/api/otp/send-otp", {
        ...form,
        type: "signup",
      });
      setStep("otp");
      setMessage("OTP sent to your email!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 2: VERIFY OTP (unchanged backend)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/otp/verify-otp", {
        email: form.email,
        otp,
        type: "signup",
        name: form.name,
        phone: form.phone,
        role: form.role,
        // ❌ password NOT sent
      });

      alert("Signup successful! You can now login.");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
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

          <h2>Welcome to Raazimerzi</h2>
          <p className="subtitle">Register your account with us!</p>

          {step === "form" && (
            <form onSubmit={handleSendOtp}>

              {/* NAME */}
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD (UI ONLY) */}
              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* PHONE */}
              <div className="input-group">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

                  <div className="social-row">
                              <span> <img src={google} alt="G" /></span>
                              <span> <img src={linkdin} alt="L" /></span>
                              <span> <img src={phone} alt="M" /></span>
                              <span> <img src={fb} alt="F" /></span>
                            </div>

              {/* ROLE */}
              <div className="input-group">
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="user">User</option>
                  <option value="mediator">Mediator</option>
                  <option value="case-manager">Case Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Register Now"}
              </button>

              <p className="bottom-text">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <p className="subtitle">
                OTP sent to <b>{form.email}</b>
              </p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <p className="back-link" onClick={() => setStep("form")}>
                ← Change details
              </p>
            </form>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;

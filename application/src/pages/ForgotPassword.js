import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import forgotBg from "../assets/icons/rec.png";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= STEP 1: SEND OTP ================= */
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/otp/send-otp", {
        email,
        type: "forgot-password",
      });

      setMessage("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2: VERIFY OTP ================= */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/otp/verify-otp", {
        email,
        otp,
        type: "forgot-password",
      });

      setMessage("OTP verified. Set new password.");
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 3: RESET PASSWORD ================= */
  const resetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/password/reset", {
        email,
        newPassword,
      });

      alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-image">
          <img src={forgotBg} alt="Forgot Password" />
        </div>

        <div className="login-form">
          <h2>Forgot Password</h2>

          {message && (
            <p className={message.includes("OTP") || message.includes("verified") ? "success" : "error"}>
              {message}
            </p>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={sendOtp}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={verifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={resetPassword}>
              <input
                type="password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="bottom-text">
            <a href="/login">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

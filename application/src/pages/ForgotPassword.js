import React, { useState } from "react";
import "./ForgotPassword.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import loginBg from "../assets/icons/login.png"; // 

const API = "http://localhost:5000/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const startTimer = () => {
    setTimer(179);
    const id = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; }), 1000);
  };
  const fmtTimer = () => `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next);
    if (val && idx < 5) document.getElementById(`fp-otp-${idx + 1}`)?.focus();
  };
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) document.getElementById(`fp-otp-${idx - 1}`)?.focus();
  };

  const sendOtp = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!email.trim()) { setError("Please enter your email"); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      await axios.post(`${API}/otp/send-otp`, { email, type: "forgot-password" });
      setMessage("OTP sent to your email");
      setStep(2);
      startTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpVal = otp.join("");
    if (otpVal.length < 6) { setError("Please enter all 6 digits"); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      await axios.post(`${API}/otp/verify-otp`, { email, otp: otpVal, type: "forgot-password" });
      setMessage("OTP verified. Set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally { setLoading(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      await axios.post(`${API}/password/reset`, { email, newPassword });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">

      {/* BACKGROUND IMAGE */}
      <div className="auth-left">
        <div className="auth-left-image">
          <img src={loginBg} alt="" role="presentation" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-form-container">

          {/* ===== STEP 1: Email ===== */}
          {step === 1 && (
            <>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
                </svg>
              </div>
              <h2 className="auth-title">Forgot Password?</h2>
              <p className="auth-subtitle">Enter your email to receive a password reset code. We'll help you get back to your account securely.</p>
              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}
              <form onSubmit={sendOtp} className="auth-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
                      </svg>
                    </span>
                    <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
                  </div>
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="btn-loader" /> : "Send Reset Code"}
                </button>
                <Link to="/login" className="back-link">← Back to Login</Link>
              </form>
              <div className="support-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                Having trouble? <a href="mailto:support@raazimarzi.com">Contact Support</a>
              </div>
            </>
          )}

          {/* ===== STEP 2: OTP ===== */}
          {step === 2 && (
            <>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="1" /><circle cx="6" cy="12" r="1" /><circle cx="18" cy="12" r="1" />
                </svg>
              </div>
              <h2 className="auth-title">Enter OTP</h2>
              <p className="auth-subtitle">
                We have sent a 6-digit code to your email<br />
                <strong style={{ color: "var(--text-dark)" }}>{email}</strong>
              </p>
              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}
              <form onSubmit={verifyOtp} className="auth-form">
                <div className="otp-row">
                  {otp.map((d, i) => (
                    <input key={i} id={`fp-otp-${i}`} className="otp-box"
                      type="text" inputMode="numeric" maxLength={1}
                      value={d} onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleOtpKeyDown(e, i)} />
                  ))}
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="btn-loader" /> : "Verify OTP"}
                </button>
                <p className="otp-resend">
                  Didn't receive the code?{" "}
                  {timer > 0
                    ? <span className="otp-timer">Resend Code</span>
                    : <span className="otp-resend-link" onClick={sendOtp}>Resend Code</span>}
                </p>
                {timer > 0 && <p className="otp-expires">Expires in {fmtTimer()}</p>}
                <button type="button" className="back-link" onClick={() => setStep(1)}>← Change Email Address</button>
              </form>
              <div className="support-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                Having trouble? <a href="mailto:support@raazimarzi.com">Contact Support</a>
              </div>
            </>
          )}

          {/* ===== STEP 3: New Password ===== */}
          {step === 3 && (
            <>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="auth-title">Reset Password</h2>
              <p className="auth-subtitle">Enter your new password below to regain access to your case files.</p>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={resetPassword} className="auth-form">
                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </span>
                    <input type={showNew ? "text" : "password"} placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    <span className="input-icon-right" onClick={() => setShowNew(!showNew)}>
                      {showNew
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </span>
                    <input type={showConfirm ? "text" : "password"} placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                    <span className="input-icon-right" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                    </span>
                  </div>
                </div>
                <div className="password-hint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <p>Ensure your password is at least 12 characters long and includes a mix of letters, numbers, and symbols.</p>
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="btn-loader" /> : <>Update Password <span className="btn-arrow">→</span></>}
                </button>
                <Link to="/login" className="back-link">← Back to login</Link>
              </form>
              <div className="support-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                Having trouble? <a href="mailto:support@raazimarzi.com">Contact Support</a>
              </div>
            </>
          )}

          {/* ===== STEP 4: Success ===== */}
          {step === 4 && (
            <>
              <div className="success-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h2 className="success-title">Password Changed<br />Successfully</h2>
              <p className="success-desc">Your password has been updated. You can now log in with your new credentials.</p>
              <button className="auth-btn" onClick={() => navigate("/login")}>Back to Login</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
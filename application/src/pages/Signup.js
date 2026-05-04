import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/axios";
import loginBg from "../assets/icons/login.png"; // ← import so bundler resolves the path

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect");

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const startTimer = () => {
    setTimer(179);
    const id = setInterval(() => { setTimer((t) => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; }); }, 1000);
  };
  const fmtTimer = () => `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await api.post("/otp/send-otp", { email: form.email, type: "signup" });
      if (res.data?.success !== false) { setOtpSent(true); setMessage("OTP sent to your email"); startTimer(); }
      else setError(res.data.message || "Failed to send OTP");
    } catch (err) { setError(err.response?.data?.message || "Failed to send OTP"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpVal = otp.join("");
    if (otpVal.length < 6) { setError("Please enter all 6 digits"); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await api.post("/otp/verify-otp", { email: form.email, otp: otpVal, type: "signup" });
      if (res.data?.success !== false) { setOtpVerified(true); setMessage("Email verified successfully!"); }
      else setError(res.data.message || "Invalid OTP");
    } catch (err) { setError(err.response?.data?.message || "OTP verification failed"); }
    finally { setLoading(false); }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await api.post("/auth/signup", { ...form, role: "user" });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Account created! Redirecting...");
        setTimeout(() => navigate(redirectPath || "/user/dashboard", { replace: true }), 1000);
      } else setError(res.data.message || "Signup failed");
    } catch (err) { setError(err.response?.data?.message || "Signup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">

      {/* BACKGROUND IMAGE */}
      <div className="auth-left">
        <div className="auth-left-image">
          <img src={loginBg} alt="" role="presentation" />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">

          {/* ===== STEP 1: Details ===== */}
          {!otpSent && (
            <>
              <h2 className="auth-title">Create an Account</h2>
              <p className="auth-subtitle">Get started with RaaziMarzi</p>
              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
                      </span>
                      <input name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>
                      </span>
                      <input type="email" name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrap has-prefix">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 3.18 2 2 0 0 1 3.96 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </span>
                    <span className="phone-prefix">+91 |</span>
                    <input name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </span>
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                    <span className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                    </span>
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="btn-loader" /> : <>Create Account <span className="btn-arrow">→</span></>}
                </button>
              </form>

              <div className="auth-or"><span>OR CONTINUE WITH</span></div>
              <button className="google-btn">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="mediator-cta">
                <div>
                  <p className="mediator-cta-title">Want to become a mediator?</p>
                  <p className="mediator-cta-desc">Join our network of certified legal professionals.</p>
                </div>
                <Link to="/mediator-signup" className="mediator-cta-btn">Apply as Mediator</Link>
              </div>

              <p className="auth-footer">Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
            </>
          )}

          {/* ===== STEP 2: OTP ===== */}
          {otpSent && !otpVerified && (
            <>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="1" /><circle cx="6" cy="12" r="1" /><circle cx="18" cy="12" r="1" />
                </svg>
              </div>
              <h2 className="auth-title">Enter OTP</h2>
              <p className="auth-subtitle">
                We have sent a 6-digit code to your email<br />
                <strong style={{ color: "var(--text-dark)" }}>{form.email}</strong>
              </p>
              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success">{message}</div>}
              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div className="otp-row">
                  {otp.map((d, i) => (
                    <input key={i} id={`otp-${i}`} className="otp-box"
                      type="text" inputMode="numeric" maxLength={1}
                      value={d} onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)} />
                  ))}
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="btn-loader" /> : "Verify OTP"}
                </button>
                <p className="otp-resend">
                  Didn't receive the code?{" "}
                  {timer > 0
                    ? <span className="otp-timer">Resend in {fmtTimer()}</span>
                    : <span className="otp-resend-link" onClick={handleSendOtp}>Resend Code</span>}
                </p>
                {timer > 0 && <p className="otp-expires">Expires in {fmtTimer()}</p>}
                <button type="button" className="back-link" onClick={() => setOtpSent(false)}>← Change Email Address</button>
              </form>
              <div className="support-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                Having trouble? <a href="mailto:support@raazimarzi.com">Contact Support</a>
              </div>
            </>
          )}

          {/* ===== STEP 3: Complete ===== */}
          {otpVerified && (
            <>
              <div className="success-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h2 className="success-title">Email Verified!</h2>
              {message && <div className="auth-success">{message}</div>}
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleCompleteSignup} className="auth-form" style={{ marginTop: 8 }}>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="btn-loader" /> : <>Complete Registration <span className="btn-arrow">→</span></>}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Signup;
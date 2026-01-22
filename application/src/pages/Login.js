import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import loginBg from "../assets/icons/rec.png";
import google from "../assets/icons/google.png";
import linkdin from "../assets/icons/linkdin.png";
import phone from "../assets/icons/phone.png";
import fb from "../assets/icons/fb.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Read redirect query
  const redirectPath =
    new URLSearchParams(location.search).get("redirect");

  // 🔹 Redirect helper
  const redirectByRole = (role) => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
      return;
    }

    switch (role) {
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
  };

  // 🔹 Auto redirect if already logged in
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) redirectByRole(role);
  }, []);

  // 🔹 PASSWORD LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);

      redirectByRole(res.data.role);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <div className="login-image">
          <img src={loginBg} alt="Login" />
        </div>

        <div className="login-form">
          <div className="logo">
            <img src="/logo.png" alt="Raazimarzi" />
            <span>ODR Platform</span>
          </div>

          <h2>Welcome to Raazimarzi</h2>
          <p className="subtitle">
            Sign in to resolving your disputes online.
          </p>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

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

            <p className="forgot"><Link to="/forgotpassword">Forgot Password?</Link></p>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="bottom-text">
              Don’t have an account? <a href="/signup">Sign Up</a>
            </p>

            <div className="social-row">
              <span><img src={google} alt="G" /></span>
              <span><img src={linkdin} alt="L" /></span>
              <span><img src={phone} alt="M" /></span>
              <span><img src={fb} alt="F" /></span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

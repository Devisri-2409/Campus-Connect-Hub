import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your college email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password
      });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      } else {
        setErrorMessage("Login response did not provide an authentication token.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials and try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Branding Panel */}
        <div className="auth-left">
          <div>
            <Link to="/" className="auth-back-link">
              <FaArrowLeft /> Back to Home
            </Link>

            <div className="auth-left-brand">
              <div className="auth-brand-badge">
                <FaGraduationCap />
              </div>
              <h1>Campus Connect Hub</h1>
            </div>

            <p className="auth-left-tagline">
              Your centralized platform for student collaboration, peer notes,
              and academic networking.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <FaCheckCircle className="auth-feature-check" />
                <span className="auth-feature-text">
                  Access course study circles and branch discussions.
                </span>
              </div>
              <div className="auth-feature-item">
                <FaCheckCircle className="auth-feature-check" />
                <span className="auth-feature-text">
                  Share and download peer-verified lecture notes.
                </span>
              </div>
              <div className="auth-feature-item">
                <FaCheckCircle className="auth-feature-check" />
                <span className="auth-feature-text">
                  Coordinate upcoming review sessions and meetups.
                </span>
              </div>
            </div>
          </div>

          <div className="auth-left-footer">
            Dedicated student collaboration network.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Enter your student credentials to access your workspace.</p>
          </div>

          {errorMessage && (
            <div className="auth-alert auth-alert-error" role="alert">
              <FaExclamationCircle />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert auth-alert-success" role="alert">
              <FaCheckCircle />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin} noValidate>
            {/* Email Field */}
            <div className="auth-field">
              <label htmlFor="login-email">College Email</label>
              <div className="auth-input-group">
                <FaEnvelope className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-group">
                <FaLock className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="auth-options">
              <label className="auth-remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Workspace"}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="auth-switch-prompt">
            Don't have an account yet?
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
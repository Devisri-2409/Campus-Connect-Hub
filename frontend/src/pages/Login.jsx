import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import "../styles/Auth.css";
import students from "../assets/images/students.svg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);

const [loading, setLoading] = useState(false);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();


  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

        const response = await api.post("/auth/login", {

            email,
            password

        });

        localStorage.setItem("token", response.data.token);

        alert("Login Successful 🎉");

        navigate("/dashboard");

    } catch (err) {

        alert(err.response?.data?.message || "Login Failed");

    }

    setLoading(false);

};

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Left Panel */}
        <div className="auth-left">
          <img
            src={students}
            alt="Students"
            className="auth-image"
          />

          <h1>Campus Connect Hub</h1>

          <p>
            Learn together.<br />
            Share notes.<br />
            Build your future.
          </p>
        </div>

        {/* Right Panel */}
        <div className="auth-right">

          <div className="auth-logo">
            <h2>Welcome Back 👋</h2>
            <p>Login to continue your studies.</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>

            {/* Email */}
            <div>
              <label>Email</label>

              <div className="input-group">
                <FaEnvelope className="input-icon" />

                <input
  type="email"
  placeholder="Enter your college email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
              </div>
            </div>

            {/* Password */}
            <div>
              <label>Password</label>

              <div className="input-group">
                <FaLock className="input-icon" />

                <input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

                <span
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="login-options">

              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() =>
                    setRememberMe(!rememberMe)
                  }
                />

                Remember Me
              </label>

              <Link to="#">
                Forgot Password?
              </Link>

            </div>

            {/* Button */}
            <button
              type="submit"
              className="auth-btn"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
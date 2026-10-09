import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaBuilding,
  FaCalendarAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "../styles/Auth.css";

const DEPARTMENT_OPTIONS = [
  { id: 2, name: "Computer Science & Business Systems" },
  { id: 1, name: "Computer Science Engineering" },
  { id: 3, name: "Information Technology" },
  { id: 4, name: "Electronics & Communication" },
  { id: 5, name: "Electrical Engineering" },
  { id: 6, name: "Mechanical Engineering" },
  { id: 7, name: "Civil Engineering" }
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }
    if (!studentId.trim()) {
      setErrorMessage("Please enter your Student ID.");
      return false;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter your college email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!department) {
      setErrorMessage("Please select your academic department.");
      return false;
    }
    if (!year) {
      setErrorMessage("Please select your current year of study.");
      return false;
    }
    if (!password) {
      setErrorMessage("Please create a password.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify and re-enter.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const selectedDept = DEPARTMENT_OPTIONS.find((d) => d.name === department);
      const deptId = selectedDept ? selectedDept.id : 2;

      const response = await api.post("/auth/register", {
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
        role_id: 2,
        department_id: deptId
      });

      const successNotice =
        response.data?.message || "Account created successfully! Redirecting to login...";
      setSuccessMessage(successNotice);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Registration failed. Please check your details and try again.";
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
              Join your campus peer network to share notes, form study groups,
              and coordinate academic projects.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <FaCheckCircle className="auth-feature-check" />
                <span className="auth-feature-text">
                  Department-specific course circles and peer discussions.
                </span>
              </div>
              <div className="auth-feature-item">
                <FaCheckCircle className="auth-feature-check" />
                <span className="auth-feature-text">
                  Organized repository of peer notes and study resources.
                </span>
              </div>
              <div className="auth-feature-item">
                <FaCheckCircle className="auth-feature-check" />
                <span className="auth-feature-text">
                  Interdisciplinary teammate discovery for hackathons.
                </span>
              </div>
            </div>
          </div>

          <div className="auth-left-footer">
            Free student account for campus academic collaboration.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Fill in your details to join your campus collaboration hub.</p>
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

          <form className="auth-form" onSubmit={handleRegister} noValidate>
            {/* Full Name & Student ID */}
            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="reg-fullname">Full Name</label>
                <div className="auth-input-group">
                  <FaUser className="auth-input-icon" />
                  <input
                    id="reg-fullname"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-studentid">Student ID</label>
                <div className="auth-input-group">
                  <FaIdCard className="auth-input-icon" />
                  <input
                    id="reg-studentid"
                    type="text"
                    placeholder="e.g. 21CS045"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="auth-field">
              <label htmlFor="reg-email">College Email</label>
              <div className="auth-input-group">
                <FaEnvelope className="auth-input-icon" />
                <input
                  id="reg-email"
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

            {/* Department & Year */}
            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="reg-dept">Department</label>
                <div className="auth-input-group">
                  <FaBuilding className="auth-input-icon" />
                  <select
                    id="reg-dept"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-year">Year of Study</label>
                <div className="auth-input-group">
                  <FaCalendarAlt className="auth-input-icon" />
                  <select
                    id="reg-year"
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    disabled={loading}
                  >
                    <option value="">Select Year</option>
                    {YEAR_OPTIONS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="reg-password">Password</label>
                <div className="auth-input-group">
                  <FaLock className="auth-input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    autoComplete="new-password"
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

              <div className="auth-field">
                <label htmlFor="reg-confirmpassword">Confirm Password</label>
                <div className="auth-input-group">
                  <FaLock className="auth-input-icon" />
                  <input
                    id="reg-confirmpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="auth-switch-prompt">
            Already have an account?
            <Link to="/login" className="auth-switch-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

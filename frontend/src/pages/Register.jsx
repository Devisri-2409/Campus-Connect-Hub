
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";
import students from "../assets/images/students.svg";
const Register = () => {
  const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
const [studentId, setStudentId] = useState("");
const [email, setEmail] = useState("");
const [department, setDepartment] = useState("");
const [year, setYear] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);

const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Register button clicked");

    //if (!validateForm()) return;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    setLoading(true);

    try {

        const response = await api.post("/auth/register", {

            full_name: fullName,
            email: email,
            password: password,
            role_id: 2,
            department_id: 2

        });

        alert(response.data.message);

        navigate("/login");

    } catch (err) {

       console.log(err);
console.log(err.response);

alert(JSON.stringify(err.response?.data));

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
            <h2>Create Account</h2>
            <p>Join Campus Connect Hub today.</p>
          </div>

          <form
  className="auth-form"
  onSubmit={handleRegister}
>

            <div>
              <label>Full Name</label>
              <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label>Student ID</label>
              <input
                type="text"
                placeholder="Enter your Student ID"
                 value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <label>College Email</label>
              <input
                type="email"
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Department</label>

              <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
>
                <option value="">Select Department</option>
                <option>Computer Science & Business Systems</option>
                <option>Computer Science Engineering</option>
                <option>Information Technology</option>
                <option>Electronics & Communication</option>
                <option>Electrical Engineering</option>
                <option>Mechanical Engineering</option>
                <option>Civil Engineering</option>
              </select>
            </div>

            <div>
              <label>Year</label>

              <select
    value={year}
    onChange={(e) => setYear(e.target.value)}
>
                <option value="">Select Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
    type="submit"
    className="auth-btn"
>
    {loading ? "Creating Account..." : "Create Account"}
</button>

          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;


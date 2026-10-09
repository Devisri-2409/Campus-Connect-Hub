import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaUsers,
  FaBook,
  FaCalendarAlt,
  FaComments,
  FaUserFriends,
  FaUserGraduate,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaCheckCircle,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Study Groups",
      description:
        "Create and join course-specific study groups. Organize collaborative discussions, share resources, and keep your entire study team in sync."
    },
    {
      icon: <FaBook className="feature-icon" />,
      title: "Notes Sharing",
      description:
        "Upload, organize, and access peer-shared lecture notes and revision material tailored to your department and academic semester."
    },
    {
      icon: <FaCalendarAlt className="feature-icon" />,
      title: "Campus Events",
      description:
        "Stay updated on upcoming study sessions, department workshops, coding contests, and campus academic events."
    },
    {
      icon: <FaComments className="feature-icon" />,
      title: "Q&A Discussions",
      description:
        "Post academic questions, discuss challenging course topics, and brainstorm solutions together with students in your branch."
    },
    {
      icon: <FaUserFriends className="feature-icon" />,
      title: "Finding Teammates",
      description:
        "Connect with fellow students across departments to assemble balanced project teams for hackathons, capstones, and course assignments."
    },
    {
      icon: <FaUserGraduate className="feature-icon" />,
      title: "Mentorship",
      description:
        "Connect with experienced senior students for course insights, project guidance, preparation tips, and peer mentorship."
    }
  ];

  return (
    <div className="landing-page">
      {/* Public Navigation Bar */}
      <header className="landing-navbar">
        <div className="landing-nav-container">
          <Link to="/" className="landing-brand">
            <span className="landing-brand-icon">
              <FaGraduationCap />
            </span>
            <span className="landing-brand-text">Campus Connect Hub</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="landing-nav-links">
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => scrollToSection("hero")}
            >
              Home
            </button>
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => scrollToSection("about")}
            >
              About
            </button>
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="landing-nav-actions">
            <Link to="/login" className="btn-landing-secondary">
              <FaSignInAlt className="btn-icon" /> Login
            </Link>
            <Link to="/register" className="btn-landing-primary">
              <FaUserPlus className="btn-icon" /> Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown-menu">
            <button
              type="button"
              className="mobile-nav-link"
              onClick={() => scrollToSection("hero")}
            >
              Home
            </button>
            <button
              type="button"
              className="mobile-nav-link"
              onClick={() => scrollToSection("about")}
            >
              About
            </button>
            <button
              type="button"
              className="mobile-nav-link"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
            <div className="mobile-menu-divider" />
            <Link
              to="/login"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="mobile-nav-link mobile-nav-signup"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="landing-hero-section">
        <div className="landing-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <FaGraduationCap className="badge-icon" /> Student Collaboration Platform
              </div>
              <h1 className="hero-title">
                Your Campus. Your Community. Your Future.
              </h1>
              <p className="hero-description">
                Campus Connect Hub brings college students together to share
                verified study materials, form collaborative study groups,
                coordinate academic events, and build multidisciplinary project
                teams.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn-hero-primary">
                  Get Started <FaArrowRight className="btn-arrow" />
                </Link>
                <button
                  type="button"
                  className="btn-hero-secondary"
                  onClick={() => scrollToSection("features")}
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Illustrative Workspace Preview */}
            <div className="hero-visual">
              <div className="illustrative-preview-card">
                <div className="preview-card-header">
                  <div className="preview-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="preview-header-label">
                    Illustrative Platform Preview
                  </span>
                </div>

                <div className="preview-card-body">
                  <div className="preview-item">
                    <div className="preview-icon-wrapper group-bg">
                      <FaUsers />
                    </div>
                    <div className="preview-item-info">
                      <span className="preview-item-title">
                        Operating Systems Study Circle
                      </span>
                      <span className="preview-item-subtitle">
                        Course Group · 4 Active Members · Weekly Review
                      </span>
                    </div>
                    <span className="preview-item-tag">Active</span>
                  </div>

                  <div className="preview-item">
                    <div className="preview-icon-wrapper note-bg">
                      <FaBook />
                    </div>
                    <div className="preview-item-info">
                      <span className="preview-item-title">
                        Data Structures & Algorithms - Module 3 Notes
                      </span>
                      <span className="preview-item-subtitle">
                        Shared by CSBS Student · Verified Course PDF
                      </span>
                    </div>
                    <span className="preview-item-tag tag-blue">Resource</span>
                  </div>

                  <div className="preview-item">
                    <div className="preview-icon-wrapper session-bg">
                      <FaCalendarAlt />
                    </div>
                    <div className="preview-item-info">
                      <span className="preview-item-title">
                        Mid-Term Prep Session
                      </span>
                      <span className="preview-item-subtitle">
                        Tomorrow at 4:30 PM · Library Conference Room 2
                      </span>
                    </div>
                    <span className="preview-item-tag tag-green">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing-about-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-eyebrow">About The Platform</span>
            <h2 className="section-title">
              Designed for Everyday Student Academic Life
            </h2>
            <p className="section-subtitle">
              Campus Connect Hub solves the challenge of scattered academic
              resources and isolated study efforts by creating an integrated,
              transparent space for peer learning.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">
                <FaCheckCircle />
              </div>
              <h3>Centralized Learning</h3>
              <p>
                Eliminate scattered chat groups and lost files. Find course
                notes, group conversations, and study sessions organized by
                subject and department.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-icon">
                <FaCheckCircle />
              </div>
              <h3>Interdisciplinary Collaboration</h3>
              <p>
                Bridge departmental silos. Easily discover teammates from
                Computer Science, IT, Electronics, Mechanical, and Civil
                branches for hackathons and capstone projects.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-icon">
                <FaCheckCircle />
              </div>
              <h3>Structured Study Networks</h3>
              <p>
                Form focused study circles for specific examinations, coordinate
                discussion agendas, and track scheduled review sessions with
                classmates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-eyebrow">Platform Capabilities</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              Purpose-built tools designed to support your coursework, peer
              networking, and campus teamwork.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-container">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container footer-content">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <FaGraduationCap className="footer-icon" />
              <span>Campus Connect Hub</span>
            </div>
            <p className="footer-desc">
              A collaborative student platform connecting learners across
              departments for shared notes, focused study circles, and campus
              teamwork.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => scrollToSection("hero")}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => scrollToSection("about")}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => scrollToSection("features")}
                >
                  Features
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Account Access</h4>
            <ul>
              <li>
                <Link to="/login" className="footer-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="landing-container">
            <p>
              &copy; {new Date().getFullYear()} Campus Connect Hub. Built for
              student collaboration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


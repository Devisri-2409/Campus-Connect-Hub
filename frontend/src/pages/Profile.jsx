import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Profile.css";

const Profile = () => {
    const [showModal, setShowModal] = useState(false);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [showVerification, setShowVerification] = useState(false);
    const [verificationData, setVerificationData] = useState({
        emailOtp: "",
        phoneOtp: "",
        emailSent: false,
        phoneSent: false
    });

    const getInitials = (name) => {
        if (!name) return "ST";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Validation functions
    const validateEmail = (emailValue) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    };

    const validatePhone = (phoneValue) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phoneValue);
    };

    const validateForm = () => {
        const newErrors = {};

        if (email && !validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (phone && !validatePhone(phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user);
                setPhone(response.data.user.phone || "");
                setEmail(response.data.user.email || "");
                setBio(response.data.user.bio || "");
            } catch (err) {
                console.log(err);
            }
        };

        fetchProfile();
    }, []);

    // Send verification OTP for email
    const sendEmailVerification = async () => {
        if (!email || !validateEmail(email)) {
            setErrors({ email: "Please enter a valid email address" });
            return;
        }

        try {
            await api.post("/auth/send-email-otp", { email });
            setVerificationData((prev) => ({ ...prev, emailSent: true }));
            alert("Verification code sent to your email ✉️");
        } catch (err) {
            alert("Failed to send email verification");
        }
    };

    // Send verification OTP for phone
    const sendPhoneVerification = async () => {
        if (!phone || !validatePhone(phone)) {
            setErrors({ phone: "Please enter a valid 10-digit phone number" });
            return;
        }

        try {
            await api.post("/auth/send-phone-otp", { phone });
            setVerificationData((prev) => ({ ...prev, phoneSent: true }));
            alert("Verification code sent to your phone 📱");
        } catch (err) {
            alert("Failed to send phone verification");
        }
    };

    // Verify email OTP
    const verifyEmailOtp = async () => {
        if (!verificationData.emailOtp) {
            setErrors({ emailOtp: "Please enter verification code" });
            return;
        }

        try {
            await api.post("/auth/verify-email", {
                email,
                otp: verificationData.emailOtp
            });
            setVerificationData((prev) => ({ ...prev, emailOtp: "", emailSent: false }));
            alert("Email verified successfully ✅");
        } catch (err) {
            setErrors({ emailOtp: "Invalid or expired verification code" });
        }
    };

    // Verify phone OTP
    const verifyPhoneOtp = async () => {
        if (!verificationData.phoneOtp) {
            setErrors({ phoneOtp: "Please enter verification code" });
            return;
        }

        try {
            await api.post("/auth/verify-phone", {
                phone,
                otp: verificationData.phoneOtp
            });
            setVerificationData((prev) => ({ ...prev, phoneOtp: "", phoneSent: false }));
            alert("Phone verified successfully ✅");
        } catch (err) {
            setErrors({ phoneOtp: "Invalid or expired verification code" });
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.put(
                "/auth/profile",
                { phone, email, bio },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser((prev) => ({
                ...prev,
                phone,
                email,
                bio
            }));
            setShowModal(false);
            setShowVerification(false);
            alert("Profile Updated Successfully ✅");
        } catch (err) {
            alert("Unable to update profile");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{getInitials(user?.full_name)}</div>
                    <h2>{user?.full_name || "Student"}</h2>
                    <p>{user?.email}</p>
                </div>

                <div className="profile-details">
                    <div className="detail-row">
                        <span>🎓 Department</span>
                        <strong>{user?.department_id === 2 ? "CSBS" : user?.department_id}</strong>
                    </div>

                    <div className="detail-row">
                        <span>📚 Year</span>
                        <strong>{user?.year_of_study || "3rd Year"}</strong>
                    </div>

                    <div className="detail-row">
                        <span>📞 Phone</span>
                        <strong>{user?.phone || "Not Added"}</strong>
                    </div>

                    <div className="detail-row">
                        <span>📧 Email</span>
                        <strong>{user?.email || "Not Added"}</strong>
                    </div>

                    <div className="detail-row">
                        <span>✅ Account</span>
                        <strong>{user?.is_active ? "Active" : "Inactive"}</strong>
                    </div>
                </div>

                <div className="profile-bio">
                    <h3>About Me</h3>
                    <p>{user?.bio || "No bio added yet."}</p>
                </div>

                <button className="edit-profile-btn" onClick={() => setShowModal(true)}>
                    ✏ Edit Profile
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="profile-modal">
                        <h2>{showVerification ? "Verify Contact Info" : "Edit Profile"}</h2>

                        {!showVerification ? (
                            <>
                                {/* Email Field */}
                                <div className="form-group">
                                    <label>📧 Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors({ ...errors, email: "" });
                                        }}
                                    />
                                    {errors.email && <span className="error-msg">{errors.email}</span>}
                                </div>

                                {/* Phone Field */}
                                <div className="form-group">
                                    <label>📱 Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter 10-digit phone number"
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            setErrors({ ...errors, phone: "" });
                                        }}
                                        maxLength="10"
                                    />
                                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                                </div>

                                {/* Bio Field */}
                                <div className="form-group">
                                    <label>✍️ Bio</label>
                                    <textarea
                                        placeholder="Tell us about yourself..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>

                                <div className="modal-buttons">
                                    <button className="cancel-btn" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="save-btn" onClick={() => setShowVerification(true)}>
                                        Next: Verify
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Email Verification */}
                                <div className="verification-section">
                                    <h4>📧 Email Verification</h4>
                                    {!verificationData.emailSent ? (
                                        <button className="verify-btn" onClick={sendEmailVerification}>
                                            Send Verification Code
                                        </button>
                                    ) : (
                                        <div className="otp-input-group">
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                value={verificationData.emailOtp}
                                                onChange={(e) =>
                                                    setVerificationData({
                                                        ...verificationData,
                                                        emailOtp: e.target.value
                                                    })
                                                }
                                                maxLength="6"
                                            />
                                            <button
                                                className="otp-verify-btn"
                                                onClick={verifyEmailOtp}
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    )}
                                    {errors.emailOtp && <span className="error-msg">{errors.emailOtp}</span>}
                                </div>

                                {/* Phone Verification */}
                                <div className="verification-section">
                                    <h4>📱 Phone Verification</h4>
                                    {!verificationData.phoneSent ? (
                                        <button className="verify-btn" onClick={sendPhoneVerification}>
                                            Send Verification Code
                                        </button>
                                    ) : (
                                        <div className="otp-input-group">
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                value={verificationData.phoneOtp}
                                                onChange={(e) =>
                                                    setVerificationData({
                                                        ...verificationData,
                                                        phoneOtp: e.target.value
                                                    })
                                                }
                                                maxLength="6"
                                            />
                                            <button
                                                className="otp-verify-btn"
                                                onClick={verifyPhoneOtp}
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    )}
                                    {errors.phoneOtp && <span className="error-msg">{errors.phoneOtp}</span>}
                                </div>

                                <div className="modal-buttons">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowVerification(false)}
                                    >
                                        Back
                                    </button>
                                    <button className="save-btn" onClick={handleSave}>
                                        Save Changes
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
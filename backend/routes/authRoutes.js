const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    register,
    login,
    getProfile,
    updateProfile,
    sendEmailOTP,
    verifyEmail,
    sendPhoneOTP,
    verifyPhone
} = require("../controllers/authController");


/* ================================
   AUTH ROUTES
================================ */

router.post("/register", register);

router.post("/login", login);


/* ================================
   PROFILE ROUTES
================================ */

router.get("/profile", verifyToken, getProfile);

router.put("/profile", verifyToken, updateProfile);


/* ================================
   EMAIL VERIFICATION
================================ */

router.post(
    "/send-email-otp",
    verifyToken,
    sendEmailOTP
);

router.post(
    "/verify-email",
    verifyToken,
    verifyEmail
);


/* ================================
   PHONE VERIFICATION
================================ */

router.post(
    "/send-phone-otp",
    verifyToken,
    sendPhoneOTP
);

router.post(
    "/verify-phone",
    verifyToken,
    verifyPhone
);


module.exports = router;
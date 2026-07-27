const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    register,
    login,
    getProfile,
    updateProfile
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", verifyToken, getProfile);

router.put("/profile", verifyToken, updateProfile);

module.exports = router;
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createSession,
    getAllSessions,
    deleteSession
} = require("../controllers/sessionController");

// Create Session
router.post("/", verifyToken, createSession);

// Get All Sessions
router.get("/", verifyToken, getAllSessions);

// Delete Session
router.delete("/:id", verifyToken, deleteSession);

module.exports = router;
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { chatWithAssistant } = require("../controllers/assistantController");

router.post("/chat", verifyToken, chatWithAssistant);

module.exports = router;

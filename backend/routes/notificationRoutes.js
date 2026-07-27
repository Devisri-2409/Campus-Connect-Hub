const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    fetchNotifications,
    readNotification
} = require("../controllers/notificationController");

router.get("/", verifyToken, fetchNotifications);

router.put("/:id", verifyToken, readNotification);

module.exports = router;
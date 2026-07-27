const sessionRoutes = require("./routes/sessionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const noteRoutes = require("./routes/noteRoutes");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/notes", noteRoutes);
app.use("/api/sessions", sessionRoutes);
// Routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Campus Connect Hub Backend is Running...");
});
const verifyToken = require("./middleware/authMiddleware");

app.get("/api/profile", verifyToken, (req, res) => {

    res.json({
        success: true,
        message: "Welcome to your profile!",
        user: req.user
    });

});
const studyGroupRoutes = require("./routes/studyGroupRoutes");


app.use("/api/groups", studyGroupRoutes);
const groupMemberRoutes =
require("./routes/groupMemberRoutes");

app.use(
    "/api/groups",
    groupMemberRoutes
);
app.get("/test", (req, res) => {
    res.send("Backend Working");
});
const path = require("path");

app.get("/debug-path", (req, res) => {
    res.send(path.join(__dirname, "uploads"));
});

module.exports = app;
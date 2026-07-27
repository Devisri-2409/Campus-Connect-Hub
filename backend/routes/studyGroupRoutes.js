const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createGroup,
    getAllGroups,
    removeGroup
} = require("../controllers/studyGroupController");

router.post("/", verifyToken, createGroup);

router.get("/", verifyToken, getAllGroups);

router.delete("/:id", verifyToken, removeGroup);

module.exports = router;
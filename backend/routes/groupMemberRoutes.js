const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const controller = require("../controllers/groupMemberController");

router.get(
    "/my",
    (req, res, next) => {
        console.log("My Groups route reached");
        next();
    },
    verifyToken,
    controller.getMyGroups
);
router.post(

    "/:id/join",

    verifyToken,

    controller.joinGroup

);
router.delete(
    "/:id/leave",
    verifyToken,
    controller.leaveGroup
);

module.exports = router;
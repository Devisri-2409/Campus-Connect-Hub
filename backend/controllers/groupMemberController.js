const { createNotification } = require("../models/notificationModel");
const db = require("../config/db");

const groupMemberModel = require("../models/groupMemberModel");

const joinGroup = (req, res) => {

    const groupId = req.params.id;
    const userId = req.user.user_id;

    console.log("Group ID:", groupId);
    console.log("User ID:", userId);

    groupMemberModel.joinGroup(groupId, userId, (err) => {

        if (err) {

            console.log("JOIN ERROR:", err);

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        db.query(
    "SELECT created_by, group_name FROM study_groups WHERE group_id = ?",
    [groupId],
    (err, result) => {

        if (!err && result.length > 0) {

            const owner = result[0];

            if (owner.created_by !== req.user.user_id) {

                createNotification({
                    user_id: owner.created_by,
                    title: "New Group Member",
                    message: req.user.full_name + " joined your group: " + owner.group_name
                }, () => {});

            }

        }

        res.json({
            success: true,
            message: "Joined Successfully 🎉"
        });

    }
);

    });

};

const getMyGroups = (req, res) => {

    console.log("User from JWT:", req.user);

    const userId = req.user.user_id;

 groupMemberModel.getMyGroups(userId, (err, results) => {

    console.log("User ID:", userId);
    console.log("Results:", results);

    if (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch groups"
        });
    }

    res.json({
        success: true,
        groups: results
    });

});

};
const leaveGroup = (req, res) => {

    const groupId = req.params.id;
    const userId = req.user.user_id;

    groupMemberModel.leaveGroup(groupId, userId, (err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Unable to leave group"
            });

        }

        res.json({
            success: true,
            message: "Left Group Successfully"
        });

    });

};
module.exports = {
    joinGroup,
    getMyGroups,
    leaveGroup
};
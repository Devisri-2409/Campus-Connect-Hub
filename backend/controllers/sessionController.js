const sessionModel = require("../models/sessionModel");
const db = require("../config/db");
const { createNotification } = require("../models/notificationModel");

// Create Session
const createSession = (req, res) => {

    const data = {

        title: req.body.title,
        description: req.body.description,
        session_date: req.body.session_date,
        session_time: req.body.session_time,
        location: req.body.location,
        meeting_link:req.body.meeting_link,
        group_id: req.body.group_id,
        created_by: req.user.user_id
    };

    sessionModel.createSession(data, (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Unable to create session"
            });

        }

       db.query(
    "SELECT user_id FROM group_members WHERE group_id = ?",
    [data.group_id],
    (err, members) => {

        if (!err) {

          members.forEach(member => {

    if (member.user_id !== req.user.user_id) {

        createNotification({
            user_id: member.user_id,
            title: "New Study Session",
            message: "A new study session has been scheduled."
        }, () => {});

    }

});

        }

        res.json({
            success: true,
            message: "Study Session Created Successfully 🎉"
        });

    }
);

    });

};
// Get All Sessions
const getAllSessions = (req, res) => {

    sessionModel.getAllSessions((err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Unable to fetch sessions"
            });

        }

        res.json({
            success: true,
            sessions: results
        });

    });

};

// Delete Session
const deleteSession = (req, res) => {

    const sessionId = req.params.id;

    sessionModel.deleteSession(sessionId, (err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Unable to delete session"
            });

        }

        res.json({
            success: true,
            message: "Session Deleted Successfully"
        });

    });

};

module.exports = {
    createSession,
    getAllSessions,
    deleteSession
};
const {
    getNotifications,
    markAsRead
} = require("../models/notificationModel");

const fetchNotifications = (req, res) => {

    const user_id = req.user.user_id;

    getNotifications(user_id, (err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({
            success: true,
            notifications: results
        });

    });

};

const readNotification = (req, res) => {

    const notification_id = req.params.id;

    markAsRead(notification_id, (err) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({
            success: true,
            message: "Notification marked as read"
        });

    });

};

module.exports = {
    fetchNotifications,
    readNotification
};
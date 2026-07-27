const db = require("../config/db");

const createNotification = (data, callback) => {

    const sql = `
        INSERT INTO notifications
        (user_id, title, message)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.user_id,
            data.title,
            data.message
        ],
        callback
    );

};

const getNotifications = (user_id, callback) => {

    const sql = `
        SELECT *
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [user_id], callback);

};

const markAsRead = (notification_id, callback) => {

    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ?
    `;

    db.query(sql, [notification_id], callback);

};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead
};
const db = require("../config/db");

// Create Study Session
const createSession = (data, callback) => {

    const sql = `
        INSERT INTO study_sessions
        (
            title,
            description,
            session_date,
            session_time,
            location,
            meeting_link,
            group_id,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.title,
            data.description,
            data.session_date,
            data.session_time,
            data.location,
            data.meeting_link,
            data.group_id,
            data.created_by
        ],
        callback
    );

};

// Get All Sessions
const getAllSessions = (callback) => {

    const sql = `
        SELECT
          ss.*,sg.group_name
          FROM study_sessions ss 
          JOIN study_groups sg
          ON ss.group_id = sg .group_id
        ORDER BY session_date ASC, session_time ASC
    `;

    db.query(sql, callback);

};

// Delete Session
const deleteSession = (sessionId, callback) => {

    const sql = `
        DELETE FROM study_sessions
        WHERE session_id = ?
    `;

    db.query(sql, [sessionId], callback);

};

module.exports = {
    createSession,
    getAllSessions,
    deleteSession
};
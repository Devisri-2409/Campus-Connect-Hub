const db = require("../config/db");

const uploadNote = (data, callback) => {

    const sql = `
        INSERT INTO notes
        (title, file_url, group_id, uploaded_by)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.title,
            data.file_url,
            data.group_id,
            data.uploaded_by
        ],
        callback
    );

};

const getAllNotes = (callback) => {

    const sql = `
        SELECT
            n.*,
            u.full_name,
            sg.group_name
        FROM notes n
        LEFT JOIN users u
            ON n.uploaded_by = u.user_id
        LEFT JOIN study_groups sg
            ON n.group_id = sg.group_id
        ORDER BY n.created_at DESC
    `;

    db.query(sql, callback);

};

module.exports = {
    uploadNote,
    getAllNotes
};
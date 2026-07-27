const db = require("../config/db");

const joinGroup = (groupId, userId, callback) => {

    const sql = `
        INSERT INTO group_members
        (group_id, user_id)
        VALUES (?, ?)
    `;

    db.query(sql, [groupId, userId], callback);

};
const getMyGroups = (userId, callback) => {

    const sql = `
        SELECT
            sg.*
        FROM study_groups sg
        INNER JOIN group_members gm
            ON sg.group_id = gm.group_id
        WHERE gm.user_id = ?
    `;

    db.query(sql, [userId], callback);

};
const leaveGroup = (groupId, userId, callback) => {

    const sql = `
        DELETE FROM group_members
        WHERE group_id = ?
        AND user_id = ?
    `;

    db.query(sql, [groupId, userId], callback);

};
module.exports = {
    joinGroup,
    getMyGroups,
    leaveGroup
};
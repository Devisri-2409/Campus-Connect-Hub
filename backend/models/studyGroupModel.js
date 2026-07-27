const db = require("../config/db");

const createStudyGroup = (groupData, callback) => {

    const sql = `
INSERT INTO study_groups
(
    group_name,
    subject,
    description,
    created_by,
    department_id,
    max_members
)
VALUES (?, ?, ?, ?, ?, ?)
`;

    db.query(sql, [

    groupData.group_name,
    groupData.subject,
    groupData.description,
    groupData.created_by,
    groupData.department_id,
    groupData.max_members

], callback);

};

const getAllStudyGroups = (callback) => {

    db.query("SELECT * FROM study_groups", callback);

};
const deleteGroup = (group_id ,user_id ,callback) =>{
    const sql = `DELETE FROM study_groups
    WHERE group_id = ?
    AND created_by = ?`;
    db.query(sql,[group_id,user_id],callback);
}
module.exports = {

    createStudyGroup,
    getAllStudyGroups,
    deleteGroup

};
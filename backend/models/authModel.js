const db = require("../config/db");

const checkEmailExists = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};
const findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};

const createUser = (userData, callback) => {
    const sql = `
        INSERT INTO users
        (full_name, email, password, role_id, department_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userData.full_name,
            userData.email,
            userData.password,
            userData.role_id,
            userData.department_id
        ],
        callback
    );
};
const getUserById = (user_id, callback) => {

    const sql = `
        SELECT
            user_id,
            full_name,
            email,
            role_id,
            department_id,
            phone,
            bio
            created_at
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], callback);

};
const updateUserProfile = (user_id, phone, bio, callback) => {

    const sql = `
        UPDATE users
        SET phone = ?, bio = ?
        WHERE user_id = ?
    `;

    db.query(sql, [phone, bio, user_id], callback);

};


module.exports = {
    checkEmailExists,
    createUser,
    findUserByEmail,
    getUserById,
    updateUserProfile
};
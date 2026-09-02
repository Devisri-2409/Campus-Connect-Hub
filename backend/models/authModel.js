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
            bio,
            skills,
            email_verified,
            phone_verified,
            created_at
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], callback);
};

const updateUserProfile = (user_id, phone, email, bio, skills, callback) => {
    const sql = `
        UPDATE users
        SET phone = ?, email = ?, bio = ?, skills = ?
        WHERE user_id = ?
    `;

    db.query(sql, [phone, email, bio, skills, user_id], callback);
};


/* ================================
   OTP FUNCTIONS
================================ */

const saveOTP = (user_id, type, otp, expires_at, callback) => {
    const deleteOldSql = `
        DELETE FROM verification_otps
        WHERE user_id = ? AND type = ?
    `;

    db.query(deleteOldSql, [user_id, type], (err) => {
        if (err) {
            return callback(err);
        }

        const insertSql = `
            INSERT INTO verification_otps
            (user_id, type, otp, expires_at)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertSql,
            [user_id, type, otp, expires_at],
            callback
        );
    });
};

const getOTP = (user_id, type, callback) => {
    const sql = `
        SELECT *
        FROM verification_otps
        WHERE user_id = ?
        AND type = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    db.query(sql, [user_id, type], callback);
};

const deleteOTP = (user_id, type, callback) => {
    const sql = `
        DELETE FROM verification_otps
        WHERE user_id = ? AND type = ?
    `;

    db.query(sql, [user_id, type], callback);
};


/* ================================
   VERIFICATION STATUS
================================ */

const markEmailVerified = (user_id, callback) => {
    const sql = `
        UPDATE users
        SET email_verified = TRUE
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], callback);
};

const markPhoneVerified = (user_id, callback) => {
    const sql = `
        UPDATE users
        SET phone_verified = TRUE
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], callback);
};


module.exports = {
    checkEmailExists,
    createUser,
    findUserByEmail,
    getUserById,
    updateUserProfile,
    saveOTP,
    getOTP,
    deleteOTP,
    markEmailVerified,
    markPhoneVerified
};
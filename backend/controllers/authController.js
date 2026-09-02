const {
    createUser,
    checkEmailExists,
    findUserByEmail,
    getUserById,
    updateUserProfile,
    saveOTP,
    getOTP,
    deleteOTP,
    markEmailVerified,
    markPhoneVerified
} = require("../models/authModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {

    try {

        const {
            full_name,
            email,
            password,
            role_id,
            department_id
        } = req.body;

        if (!full_name || !email || !password || !role_id || !department_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        checkEmailExists(email, async (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

           const hashedPassword = await bcrypt.hash(password, 10);


console.log("Hashed Password:", hashedPassword);
            

            createUser(
                {
                    full_name,
                    email,
                    password: hashedPassword,
                    role_id,
                    department_id
                },
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "User Registered Successfully 🎉"
                    });

                }
            );

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required"
        });
    }
      
    findUserByEmail(email, async (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role_id: user.role_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful 🎉",
            token,
            user
        });

    });

};


const getProfile = (req, res) => {

    const user_id = req.user.user_id;

    getUserById(user_id, (err, result) => {
        console.log(req.user);

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: result[0]
        });

    });

};
const updateProfile = (req, res) => {

    const user_id = req.user.user_id;

    const { phone, email, bio, skills } = req.body;

    updateUserProfile(
        user_id,
        phone,
        email,
        bio,
        skills,
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Profile Updated Successfully 🎉"
            });
        }
    );
};

const sendEmailOTP = (req, res) => {

    const user_id = req.user.user_id;

    const otp = generateOTP();

    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    saveOTP(
        user_id,
        "email",
        otp,
        expires_at,
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate verification code"
                });
            }

            // TEMPORARY DEVELOPMENT MODE
            console.log("EMAIL OTP:", otp);

            res.json({
                success: true,
                message: "Email verification code generated"
            });
        }
    );
};
const verifyEmail = (req, res) => {

    const user_id = req.user.user_id;
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "OTP is required"
        });
    }

    getOTP(user_id, "email", (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No verification code found"
            });
        }

        const savedOTP = result[0];

        if (new Date() > new Date(savedOTP.expires_at)) {
            return res.status(400).json({
                success: false,
                message: "Verification code expired"
            });
        }

        if (savedOTP.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });
        }

        markEmailVerified(user_id, (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            deleteOTP(user_id, "email", () => {});

            res.json({
                success: true,
                message: "Email verified successfully"
            });
        });
    });
};
const sendPhoneOTP = (req, res) => {

    const user_id = req.user.user_id;

    const otp = generateOTP();

    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    saveOTP(
        user_id,
        "phone",
        otp,
        expires_at,
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate verification code"
                });
            }

            // TEMPORARY DEVELOPMENT MODE
            console.log("PHONE OTP:", otp);

            res.json({
                success: true,
                message: "Phone verification code generated"
            });
        }
    );
};
const verifyPhone = (req, res) => {

    const user_id = req.user.user_id;
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "OTP is required"
        });
    }

    getOTP(user_id, "phone", (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No verification code found"
            });
        }

        const savedOTP = result[0];

        if (new Date() > new Date(savedOTP.expires_at)) {
            return res.status(400).json({
                success: false,
                message: "Verification code expired"
            });
        }

        if (savedOTP.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });
        }

        markPhoneVerified(user_id, (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            deleteOTP(user_id, "phone", () => {});

            res.json({
                success: true,
                message: "Phone verified successfully"
            });
        });
    });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    sendEmailOTP,
    verifyEmail,
    sendPhoneOTP,
    verifyPhone
};
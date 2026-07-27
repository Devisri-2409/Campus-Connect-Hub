const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { createUser, checkEmailExists, findUserByEmail,getUserById,
    updateUserProfile } = require("../models/authModel");

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

console.log("Original Password:", password);
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

    const { phone, bio } = req.body;

    updateUserProfile(user_id, phone, bio, (err) => {

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

    });

};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};


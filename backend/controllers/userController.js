const { getUserById } = require("../models/authModel");

const getProfile = async (req, res) => {
    try {
        const user = await getUserById(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile fetched successfully",
            user
        });
        const updateProfile = (req, res) => {

    const userId = req.user.user_id;

    const { phone, bio } = req.body;

    userModel.updateProfile(
        userId,
        phone,
        bio,
        (err) => {

            if (err) {

                return res.status(500).json({
                    success:false,
                    message:"Unable to update profile"
                });

            }

            res.json({
                success:true,
                message:"Profile Updated Successfully"
            });

        }
    );

};

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getProfile
};
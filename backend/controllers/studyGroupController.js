
const {

    createStudyGroup,
    getAllStudyGroups,
    deleteGroup

} = require("../models/studyGroupModel");

const createGroup = (req, res) => {

    const {

        group_name,
        subject,
        description,
        department_id,
        max_members

    } = req.body;
    console.log("Logged-in user:", req.user);
    createStudyGroup({

        group_name,
        subject,
        description,
        created_by: req.user.user_id,
        department_id,
        max_members

    }, (err) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: err.message

            });

        }

        res.status(201).json({

            success: true,
            message: "Study Group Created Successfully"

        });

    });

};
const removeGroup = (req, res) => {

    const group_id = req.params.id;
    const user_id = req.user.user_id;

    deleteGroup(group_id, user_id, (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        if (result.affectedRows === 0) {

            return res.status(403).json({
                success: false,
                message: "You can only delete your own group."
            });

        }

        res.json({
            success: true,
            message: "Group deleted successfully"
        });

    });

};

const getAllGroups = (req, res) => {

    getAllStudyGroups((err, result) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: err.message

            });

        }

        res.json({

            success: true,
            groups: result

        });

    });

};

module.exports = {

    createGroup,
    getAllGroups,
    removeGroup

};
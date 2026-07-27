const noteModel = require("../models/noteModel");
const db = require("../config/db");

const uploadNote = (req, res) => {
       console.log(req.body);
console.log(req.file);
    const data = {
        title: req.body.title,
        file_url: req.file.filename,
        group_id: req.body.group_id,
        uploaded_by: req.user.user_id
    };

    noteModel.uploadNote(data, (err) => {

    if (err) {

        console.log("UPLOAD ERROR:", err);

        return res.status(500).json({
            success:false,
            message: err.message
        });

    }

        db.query(
    "SELECT user_id FROM group_members WHERE group_id = ?",
    [data.group_id],
    (err, members) => {

        if (!err) {

            members.forEach(member => {

                if (member.user_id !== req.user.user_id) {

                    createNotification({
                        user_id: member.user_id,
                        title: "New Notes",
                        message: data.title + " has been uploaded."
                    }, () => {});

                }

            });

        }

        res.json({
            success: true,
            message: "Note uploaded successfully"
        });

    }
);

    });

};

const getAllNotes = (req,res)=>{

    noteModel.getAllNotes((err,results)=>{

        if(err){

            return res.status(500).json({
                success:false
            });

        }

        res.json({
            success:true,
            notes:results
        });

    });

};

module.exports={
    uploadNote,
    getAllNotes
};
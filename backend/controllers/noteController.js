const noteModel = require("../models/noteModel");
const db = require("../config/db");

const uploadNote = (req, res) => {
       console.log(req.body);
console.log(req.file);
    const data = {
    title: req.body.title,
    summary: req.body.summary,
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

const deleteNote = (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.user.user_id;

    // First check that the note exists and belongs to the logged-in user
    db.query(
        "SELECT file_url FROM notes WHERE note_id = ? AND uploaded_by = ?",
        [noteId, userId],
        (err, results) => {

            if (err) {
                console.error("DELETE CHECK ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Note not found or you are not allowed to delete it"
                });
            }

            db.query(
                "DELETE FROM notes WHERE note_id = ? AND uploaded_by = ?",
                [noteId, userId],
                (err) => {

                    if (err) {
                        console.error("DELETE ERROR:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to delete note"
                        });
                    }

                    return res.json({
                        success: true,
                        message: "Note deleted successfully"
                    });

                }
            );
        }
    );
};

module.exports={
    uploadNote,
    getAllNotes,
    deleteNote
};
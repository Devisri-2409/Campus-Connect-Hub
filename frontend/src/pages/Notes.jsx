import React, { useEffect, useState } from "react";
import { getAllNotes, uploadNote } from "../services/noteService";

const Notes = () => {

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [groupId, setGroupId] = useState("");
    const [file, setFile] = useState(null);

    const fetchNotes = async () => {
        try {
            const data = await getAllNotes();
            setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleUpload = async () => {

        const formData = new FormData();

        formData.append("title", title);
        formData.append("group_id", groupId);
        formData.append("file", file);

        try {

            await uploadNote(formData);

            alert("Note Uploaded Successfully 🎉");

            setTitle("");
            setGroupId("");
            setFile(null);

            fetchNotes();

        } catch (err) {

            alert("Upload Failed");

        }

    };

    return (

        <div className="groups-container">

            <h1>📚 Notes</h1>

            <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

            <input
                type="number"
                placeholder="Group ID"
                value={groupId}
                onChange={(e)=>setGroupId(e.target.value)}
            />

            <input
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
            />

            <button
                className="create-btn"
                onClick={handleUpload}
            >
                Upload Note
            </button>

            <hr />

            {notes.map(note=>(
                <div
                    key={note.note_id}
                    className="group-card"
                >
                    <h2>{note.title}</h2>

                    <p>👤 {note.full_name}</p>

                    <p>👥 {note.group_name}</p>

                    <a
                        href={`http://localhost:5000/uploads/${note.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        📥 Download
                    </a>

                </div>
            ))}

        </div>

    );

};

export default Notes;
import React, { useEffect, useState } from "react";
import {
  getAllNotes,
  uploadNote,
  deleteNote,
} from "../services/noteService";
import "../styles/Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async () => {
    if (!title || !groupId || !file) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("group_id", groupId);
    formData.append("summary", summary);
    formData.append("file", file);

    try {
      setUploading(true);

      await uploadNote(formData);

      alert("Note uploaded successfully 🎉");

      setTitle("");
      setGroupId("");
      setSummary("");
      setFile(null);

      // Reset file input
      const fileInput = document.getElementById("note-file");
      if (fileInput) {
        fileInput.value = "";
      }

      fetchNotes();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      await deleteNote(noteId);

      alert("Note deleted successfully 🗑️");

      fetchNotes();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the note.");
    }
  };

  return (
    <div className="notes-container">

      {/* Page Header */}
      <div className="notes-page-header">
        <div>
          <h1>📚 Notes & Resources</h1>
          <p>
            Upload, access, and manage your study materials.
          </p>
        </div>

        <div className="notes-count">
          <strong>{notes.length}</strong>
          <span>Notes</span>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-card">

        <div className="upload-card-header">
          <div className="upload-icon">
            📤
          </div>

          <div>
            <h2>Upload a Note</h2>
            <p>
              Share your study material with your study group.
            </p>
          </div>
        </div>

        <div className="upload-form">

          <div className="input-group">
            <label>Note Title *</label>

            <input
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Group ID *</label>

            <input
              type="number"
              placeholder="Enter group ID"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
          </div>

          <div className="input-group full-width">
            <label>📝 Note Summary</label>

            <textarea
              placeholder="Write a short summary of your note..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
            />
          </div>

          <div className="input-group full-width">
            <label>📎 Select File *</label>

            <input
              id="note-file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "📤 Upload Note"}
          </button>

        </div>
      </div>

      {/* Notes Header */}
      <div className="notes-section-header">
        <div>
          <h2>📖 Available Notes</h2>
          <p>Browse and manage your uploaded study materials.</p>
        </div>
      </div>

      {/* Notes */}
      {notes.length === 0 ? (
        <div className="empty-notes">
          <div>📚</div>
          <h3>No notes available</h3>
          <p>Upload your first study note to get started.</p>
        </div>
      ) : (
        <div className="notes-grid">

          {notes.map((note) => (
            <div
              key={note.note_id}
              className="note-card"
            >

              {/* Card Header */}
              <div className="note-header">

                <div className="pdf-icon">
                  📄
                </div>

                <div className="note-title-section">
                  <h2>{note.title}</h2>

                  <span className="subject-tag">
                    Study Material
                  </span>
                </div>

              </div>

              {/* Summary */}
              {note.summary && (
                <div className="note-description">
                  <strong>Summary</strong>
                  <p>{note.summary}</p>
                </div>
              )}

              {/* Details */}
              <div className="note-details">

                <div className="note-detail">
                  <span>👤</span>
                  <div>
                    <small>Uploaded by</small>
                    <strong>{note.full_name}</strong>
                  </div>
                </div>

                <div className="note-detail">
                  <span>👥</span>
                  <div>
                    <small>Study Group</small>
                    <strong>{note.group_name}</strong>
                  </div>
                </div>

              </div>

              {/* Buttons */}
              <div className="note-footer">

                <a
                  href={`http://localhost:5000/uploads/${note.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                >
                  ⬇ Download
                </a>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(note.note_id)}
                >
                  🗑 Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Notes;
import React, { useEffect, useState } from "react";
import {
    getAllSessions,
    createSession,
    deleteSession
} from "../services/sessionService";

import "../styles/Sessions.css";
import api from "../services/api";

const Sessions = () => {

    const [sessions, setSessions] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [sessionTime, setSessionTime] = useState("");
    const [location, setLocation] = useState("");
    const [groups,setGroups] = useState([]);
    const [selectedgroup,setSelectedGroup] = useState([]);
    const [meetingLink,setMeetingLink] = useState("");

    const fetchSessions = async () => {
        try {
            const data = await getAllSessions();
            const upcomingSessions = data.filter((session) => {
                const sessionDateTime = new Date(`${session.session_date}T${session.session_time || "00:00"}`);
                return sessionDateTime >= new Date();
            });
            setSessions(upcomingSessions);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchMyGroups = async() =>{
        try{
            const token = localStorage.getItem("token");
            const response = await api.get("/groups/my",{
                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            });
            setGroups(response.data.groups);
        }
        catch(err){
            console.log(err);
        }
    };
    

    useEffect(() => {

        fetchSessions();
        fetchMyGroups();

    }, []);

    const handleCreateSession = async () => {

        try {
              if(!selectedgroup){
                alert("Please select a study group");
                return;
              }

            await createSession({

                title,
                description,
                session_date: sessionDate,
                session_time: sessionTime,
                location,
                meeting_link : meetingLink,
                group_id: Number(selectedgroup)
                

            });

            alert("Study Session Created 🎉");

            setShowModal(false);

            setTitle("");
            setDescription("");
            setSessionDate("");
            setSessionTime("");
            setLocation("");
            setSelectedGroup("");
            setMeetingLink("");
            fetchSessions();

        } catch (err) {

            alert("Unable to create session");

        }

    };

    const handleDelete = async (id) => {

        await deleteSession(id);

        fetchSessions();

    };

    return (

        <div className="sessions-container">

            <div className="session-header">

                <h1>📅 Study Sessions</h1>

                <button
                    className="create-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Create Session
                </button>

            </div>

            <div className="session-grid">

                {sessions.map((session) => (

                    <div
                        className="session-card"
                        key={session.session_id}
                    >

                        <h2>{session.title}</h2>

                        <p>{session.description}</p>
                        <p>👥 {session.group_name}</p>

                        <div className="session-meta-row">
                            <span>📅 {new Date(session.session_date).toLocaleDateString()}</span>
                            <span>🕛 {new Date(`1970-01T${session.session_time}`).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</span>
                        </div>

                        <p>📍 {session.location}</p>
                        {session.meeting_link &&(
                            <a href={session.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="join-btn"
                            >
                                🟢 Join Meeting
                            </a>
                        )}

                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(session.session_id)}
                        >
                            Delete
                        </button>

                    </div>

                ))}

            </div>

            {showModal && (

                <div className="modal-overlay">

                    <div className="group-modal">

                        <h2>Create Study Session</h2>

                        <input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <select value ={selectedgroup}
                        onChange ={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value = "">Select Study Group</option>
                            {groups.map((group) =>(
                                <option 
                                key = {group.group_id}
                                value = {group.group_id}
                                >
                                    {group.group_name}
                                    </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={sessionDate}
                            onChange={(e) => setSessionDate(e.target.value)}
                        />

                        <input
                            type="time"
                            value={sessionTime}
                            onChange={(e) => setSessionTime(e.target.value)}
                        />

                          <input
                            placeholder="Google Meet/ Zoom Link"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                        />
                        <input
                            placeholder="Location / Meet Link"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
    
                        <div className="modal-buttons">

                            <button
                                className="cancel-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="save-btn"
                                onClick={handleCreateSession}
                            >
                                Create
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default Sessions;
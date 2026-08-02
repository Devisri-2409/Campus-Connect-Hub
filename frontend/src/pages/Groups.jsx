import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    getAllGroups,
    createGroup,
    joinGroup,
    deleteGroup
} from "../services/groupService";
import "../styles/Groups.css";
import {
    FaUsers,
    FaBook,
    FaCalendarAlt,
    FaUserCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";

const StudyGroups = () => {
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState("");
     const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [maxMembers, setMaxMembers] = useState("");
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [user,setUser] = useState(null);

    const fetchGroups = async () => {

    try {

        setLoading(true);

        const data = await getAllGroups();

        setGroups(data);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

};
const fetchProfile = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.get("/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setUser(response.data.user);

    } catch (err) {

        console.log(err);

    }

};


useEffect(() => {

    fetchGroups();
    fetchProfile();

}, []);
const handleCreateGroup = async () => {

    try {

        await createGroup({

            group_name: groupName,
            subject: subject,
            description: description,
            department_id: 2,
            max_members: Number(maxMembers)

        });

        alert("Study Group Created Successfully 🎉");

        // Close popup
        setShowModal(false);

        // Clear form
        setGroupName("");
        setSubject("");
        setDescription("");
        setMaxMembers("");

        // Refresh study groups
        fetchGroups();

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to create group"
        );

    }

};
const filteredGroups = groups.filter((group) =>

    group.group_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

    group.subject
        .toLowerCase()
        .includes(search.toLowerCase())

);
const handleJoinGroup = async (groupId) => {

    try {

        await joinGroup(groupId);

        alert("Joined Successfully 🎉");

        setJoinedGroups((prev) => [...prev, groupId]);

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Unable to join group"
        );

    }

};

const handleDeleteGroup = async (groupId) => {
    const confirmDelete = window.confirm( "Are you sure you want to delete this study group ? ");
    if(!confirmDelete) return;

    try {

        await deleteGroup(groupId);
        setGroups((prevGroups) => prevGroups.filter((group) => group.group_id !== groupId));

        alert("Group deleted successfully 🗑️");


    } catch (error) {

        alert(
            "Unable to delete group"
        );

    }

};

    return (

        <div className="groups-container">

           <div className="groups-header">

   <div className="header-top">

    <div>

        <h1>Study Groups 👥</h1>

        <p>
            Find and join study groups based on your subjects.
        </p>

    </div>

    <div className="header-actions">

        <input
            type="text"
            placeholder="🔍 Search Groups..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <button
            className="create-btn"
            onClick={() => setShowModal(true)}
        >
            + Create Group
        </button>

    </div>

</div>

</div>

            {loading ? (

                <div className="loading-spinner">

    <div className="spinner"></div>

    <p>Loading Study Groups...</p>

</div>

            ) : groups.length === 0 ? (

                <div className="empty-state">

    <h2>📚 No Study Groups Yet</h2>

    <p>
        Create your first study group and invite your classmates.
    </p>

    <button
        className="create-btn"
        onClick={() => setShowModal(true)}
    >
        + Create First Group
    </button>

</div>

            ) : (

                <div className="groups-grid">

                    {filteredGroups.map((group) => (

                        <div
    className="group-card"
    key={group.group_id}
>

    <div className="card-top">

        <span className="subject-badge">
            <FaBook />
            {" "}
            {group.subject}
        </span>

    </div>

    <h2>{group.group_name}</h2>

    <p className="group-description">
        {group.description}
    </p>

    <div className="group-info">

        <p>
            <FaUserCircle />
            {" "}
            Admin
        </p>

        <p>
            <FaUsers />
            {" "}
            {group.max_members} Members
        </p>

        <p>
            <FaCalendarAlt />
            {" "}
            New Group
        </p>

    </div>
   {group.created_by !== user?.user_id && (
    <button
        className="join-btn"
        onClick={() => handleJoinGroup(group.group_id)}
        disabled={joinedGroups.includes(group.group_id)}
    >
        {joinedGroups.includes(group.group_id)
            ? "Joined ✅"
            : "Join Group"}
    </button>
)}

{group.created_by === user?.user_id && (
    <button
        className="delete-btn"
        onClick={() => handleDeleteGroup(group.group_id)}
    >
        Delete Group
    </button>
)}

<Link
    to={`/chat/${group.group_id}`}
    className="chat-btn"
>
    💬 Open Chat
</Link>

</div>

                    ))}

                </div>

            )}
            {showModal && (

    <div className="modal-overlay">

        <div className="group-modal">

            <h2>Create Study Group</h2>

           <input
    type="text"
    placeholder="Group Name"
    value={groupName}
    onChange={(e) => setGroupName(e.target.value)}
/>

           <input
    type="text"
    placeholder="Subject"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
/>

            <textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
></textarea>
          <input
    type="number"
    placeholder="Max Members"
    value={maxMembers}
    onChange={(e) => setMaxMembers(e.target.value)}
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
    onClick={handleCreateGroup}
>
    Create Group
</button>

            </div>

        </div>

    </div>

)}

        </div>

    );

};

export default StudyGroups;
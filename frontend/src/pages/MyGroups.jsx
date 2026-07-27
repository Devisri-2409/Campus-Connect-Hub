import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Groups.css";

import { leaveGroup } from "../services/groupService";
const MyGroups = () => {

    const [groups, setGroups] = useState([]);

    useEffect(() => {

        const fetchMyGroups = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get("/groups/my", {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                });
                setGroups(response.data.groups);

console.log("Groups from API:", response.data.groups);
   

console.log("Groups from API:", response.data.groups);

            } catch (err) {

                console.error(err);

            }

        };

        fetchMyGroups();

    }, []);
    const handleLeaveGroup = async (groupId) => {

    try {

        await leaveGroup(groupId);

       setGroups((prevGroups) =>
    prevGroups.filter(group => group.group_id !== groupId)
);

        alert("Left Group Successfully");

    } catch (err) {

        alert("Unable to leave group");

    }

};

    return (

        <div className="groups-container">

            <h1>⭐ My Groups</h1>

            <p>Groups you've joined.</p>

           <h2>Total Groups: {groups.length}</h2>

<div className="groups-grid">

    {groups.map((group) => (

        <div
            className="group-card"
            key={group.group_id}
        >

                        <h2>{group.group_name}</h2>

                        <h4>{group.subject}</h4>

                        <p>{group.description}</p>

                       <button
    className="leave-btn"
    onClick={() => handleLeaveGroup(group.group_id)}
>
    Leave Group
</button>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default MyGroups;
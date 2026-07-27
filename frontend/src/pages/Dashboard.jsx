import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBook, FaLayerGroup, FaCalendarAlt } from "react-icons/fa";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [groupCount, setGroupCount] = useState(0);
  const [myGroupCount, setMyGroupCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [profileResponse, groupsResponse, myGroupsResponse, notesResponse, sessionsResponse] = await Promise.all([
          api.get("/auth/profile", { headers }),
          api.get("/groups", { headers }),
          api.get("/groups/my", { headers }),
          api.get("/notes", { headers }),
          api.get("/sessions", { headers })
        ]);

        setUser(profileResponse.data.user);
        setGroupCount(groupsResponse.data.groups?.length || 0);
        setMyGroupCount(myGroupsResponse.data.groups?.length || 0);
        setNoteCount(notesResponse.data.notes?.length || 0);
        setSessionCount(sessionsResponse.data.sessions?.length || 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <p className="dashboard-label">Dashboard</p>
        <h1>Welcome back, {user?.full_name || "Student"} 👋</h1>
        <p className="dashboard-subtitle">
          A central place to manage your groups, notes, sessions, and profile.
        </p>
      </div>

      <div className="top-cards">
        <DashboardCard
          icon={<FaLayerGroup />}
          title="Study Groups"
          value={groupCount}
          description="Available groups"
          link="/groups"
        />
        <DashboardCard
          icon={<FaUsers />}
          title="My Groups"
          value={myGroupCount}
          description="Your active memberships"
          link="/mygroups"
        />
        <DashboardCard
          icon={<FaBook />}
          title="Notes"
          value={noteCount}
          description="Shared study resources"
          link="/notes"
        />
        <DashboardCard
          icon={<FaCalendarAlt />}
          title="Sessions"
          value={sessionCount}
          description="Upcoming sessions"
          link="/sessions"
        />
      </div>

      <div className="dashboard-sections">
        <div className="welcome-banner">
          <div>
            <h2>Campus Connect Hub</h2>
            <p>
              Collaborate with classmates, share notes, and stay organized across every study activity.
            </p>
          </div>
          <button className="explore-btn" onClick={() => navigate("/groups")}>Explore Groups</button>
        </div>

        <div className="recent-activity">
          <h2>Quick actions</h2>
          <div className="activity-item">Create or join study groups</div>
          <div className="activity-item">Upload notes and session plans</div>
          <div className="activity-item">Manage your profile securely</div>
          <div className="activity-item">Stay on top of notifications</div>
        </div>
      </div>

      <div className="project-info">
        <h3>Project Objective</h3>
        <p>
          Campus Connect Hub helps students collaborate through study groups,
          share notes, schedule sessions, and stay connected with the campus community.
        </p>

        <h3>Technologies Used</h3>
        <div className="tech-list">
          <span>React.js</span>
          <span>Node.js</span>
          <span>Express.js</span>
          <span>MySQL</span>
          <span>JWT</span>
          <span>React Router</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

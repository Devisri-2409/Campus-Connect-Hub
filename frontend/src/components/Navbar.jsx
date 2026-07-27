import { FaSignOutAlt, FaBell, FaChevronDown, FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/navbar.css";

import {
    getNotifications,
    markNotificationRead
} from "../services/notificationService";
import api from "../services/api";

function Navbar() {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            window.location.href = "/login";
        }
    };

    const getInitials = (name) => {
        if (!name) return "ST";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        const loadProfile = async () => {
            try {
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

        const loadNotifications = async () => {
            try {
                const data = await getNotifications();
                setNotifications(data);
            } catch (err) {
                console.log(err);
            }
        };

        loadProfile();
        loadNotifications();
    }, []);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <nav className="navbar">
            <div className="navbar-title">🎓 Campus Connect Hub</div>

            <div className="navbar-right">
                <div className="notification-container">
                    <button
                        className="bell-btn"
                        onClick={() => setShowNotifications((prev) => !prev)}
                    >
                        <FaBell />
                        {unreadCount > 0 && (
                            <span className="notification-count">{unreadCount}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <h3>Notifications</h3>
                            {notifications.length === 0 ? (
                                <p className="no-notifications">No Notifications</p>
                            ) : (
                                notifications.map((item) => (
                                    <div
                                        key={item.notification_id}
                                        className="notification-item"
                                        onClick={async () => {
                                            await markNotificationRead(item.notification_id);
                                            setNotifications((prev) =>
                                                prev.map((n) =>
                                                    n.notification_id === item.notification_id
                                                        ? { ...n, is_read: 1 }
                                                        : n
                                                )
                                            );
                                        }}
                                    >
                                        <strong>{item.title}</strong>
                                        <p>{item.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                </button>

                <div className="profile-menu">
                    <button
                        className="profile-button"
                        onClick={() => setShowProfileMenu((prev) => !prev)}
                    >
                        <span className="profile-avatar-small">{getInitials(user?.full_name)}</span>
                        <span className="profile-name">{user?.full_name || "Student"}</span>
                        <FaChevronDown className={`profile-chevron ${showProfileMenu ? "open" : ""}`} />
                    </button>

                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <strong>{user?.full_name || "Student"}</strong>
                                <span>{user?.email || "No email available"}</span>
                            </div>
                            <button className="profile-dropdown-item" onClick={() => navigate("/profile")}>Profile</button>
                            <button className="profile-dropdown-item logout-item" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
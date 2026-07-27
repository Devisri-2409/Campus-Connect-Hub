import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaUsers,
   
    FaBook,
    FaCalendarAlt,
    FaUser,
   
} from "react-icons/fa";

import "../components/Sidebar.css";

const Sidebar = () => {

    return (

        <div className="sidebar">
             <div className="sidebar-logo">

               <h2>Campus Connect Hub</h2>

            </div>

            <nav>

               <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"
    }
>
                    <FaHome />
                    Dashboard
                </NavLink>

               <NavLink to="/groups" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"
    }
>
                    <FaUsers />
                    Study Groups
                </NavLink>

                 <NavLink to="/mygroups" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"
    }>
                    <FaUsers />
                    My Groups
                </NavLink>

                <NavLink to="/notes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"
    }>
                    <FaBook />
                    Notes
                </NavLink>

                <NavLink to="/sessions" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"
    }>
                    <FaCalendarAlt />
                    Sessions
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"
    }>
                    <FaUser />
                    Profile
                </NavLink>

            </nav>

          

        </div>

    );

};

export default Sidebar;
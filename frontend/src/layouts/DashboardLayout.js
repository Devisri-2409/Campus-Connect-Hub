import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Layout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">

      <Navbar />

      <div className="layout-container">
        <Sidebar />

        <main className="page-content">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
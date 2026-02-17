// src/components/UserSidebar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useUser } from "../context/userContext";

// Icons
import Vector from "../assets/icons/Vector.png";
import HomeIcon from "../assets/icons/home.png";
import FileIcon from "../assets/icons/file.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const UserSidebar = ({ activePage = "dashboard" }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);

    try {
      logoutUser();
      clearUser();
      alert("✅ Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </div>
      </div>

      <nav className="menu">
        <div
          className={`menu-item ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => navigate("/user/dashboard")}
        >
          <img src={HomeIcon} alt="Home" />
          {!sidebarCollapsed && <span>Home</span>}
        </div>

        <div
          className={`menu-item ${activePage === "profile" ? "active" : ""}`}
          onClick={() => navigate("/user/my-profile")}
        >
          <img src={Vector} alt="Profile" />
          {!sidebarCollapsed && <span>My Profile</span>}
        </div>

        <div
          className={`menu-item ${activePage === "file-case" ? "active" : ""}`}
          onClick={() => navigate("/user/file-new-case/step1")}
        >
          <img src={FileIcon} alt="File New Case" />
          {!sidebarCollapsed && <span>File New Case</span>}
        </div>

        <div
          className={`menu-item ${activePage === "my-cases" ? "active" : ""}`}
          onClick={() => navigate("/user/my-cases")}
        >
          <img src={CaseIcon} alt="My Cases" />
          {!sidebarCollapsed && <span>My Cases</span>}
        </div>

        <div
          className={`menu-item ${activePage === "meetings" ? "active" : ""}`}
          onClick={() => navigate("/user/case-meetings")}
        >
          <img src={MeetingIcon} alt="Case Meetings" />
          {!sidebarCollapsed && <span>Case Meetings</span>}
        </div>

        <div
          className={`menu-item ${activePage === "documents" ? "active" : ""}`}
          onClick={() => navigate("/user/documents")}
        >
          <img src={DocsIcon} alt="Documents" />
          {!sidebarCollapsed && <span>Documents</span>}
        </div>

        <div
          className={`menu-item ${activePage === "chats" ? "active" : ""}`}
          onClick={() => navigate("/user/chats")}
        >
          <img src={ChatIcon} alt="Chats" />
          {!sidebarCollapsed && <span>Chats</span>}
        </div>

        <div
          className={`menu-item ${activePage === "payments" ? "active" : ""}`}
          onClick={() => navigate("/user/payments")}
        >
          <img src={PaymentIcon} alt="Payment" />
          {!sidebarCollapsed && <span>Payment</span>}
        </div>

        <div
          className={`menu-item ${activePage === "support" ? "active" : ""}`}
          onClick={() => navigate("/user/support")}
        >
          <img src={SupportIcon} alt="Support" />
          {!sidebarCollapsed && <span>Support</span>}
        </div>
      </nav>

      <div className="logout">
        <div
          className="menu-item"
          onClick={handleLogout}
          style={{
            cursor: isLoggingOut ? "not-allowed" : "pointer",
            opacity: isLoggingOut ? 0.6 : 1,
          }}
        >
          <img src={LogoutIcon} alt="Logout" />
          {!sidebarCollapsed && (
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
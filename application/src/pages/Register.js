// src/pages/MyProfile.js
import React, { useState } from "react";
import "./MyProfile.css";
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

import { FaCog, FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MyProfile = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { user, loading, clearUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading profile...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </div>
        </div>

        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/user/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            {!sidebarCollapsed && <span>Home</span>}
          </div>

          <div
            className="menu-item active"
            onClick={() => navigate("/user/my-profile")}
          >
            <img src={Vector} alt="Profile" />
            {!sidebarCollapsed && <span>My Profile</span>}
          </div>

          <div
            className="menu-item"
            onClick={() => navigate("/user/file-new-case/step1")}
          >
            <img src={FileIcon} alt="File New Case" />
            {!sidebarCollapsed && <span>File New Case</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/my-cases")}>
            <img src={CaseIcon} alt="My Cases" />
            {!sidebarCollapsed && <span>My Cases</span>}
          </div>

          <div
            className="menu-item"
            onClick={() => navigate("/user/case-meetings")}
          >
            <img src={MeetingIcon} alt="Case Meetings" />
            {!sidebarCollapsed && <span>Case Meetings</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/documents")}>
            <img src={DocsIcon} alt="Documents" />
            {!sidebarCollapsed && <span>Documents</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/chats")}>
            <img src={ChatIcon} alt="Chats" />
            {!sidebarCollapsed && <span>Chats</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/payments")}>
            <img src={PaymentIcon} alt="Payment" />
            {!sidebarCollapsed && <span>Payment</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/support")}>
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
              opacity: isLoggingOut ? 0.6 : 1 
            }}
          >
            <img src={LogoutIcon} alt="Logout" />
            {!sidebarCollapsed && <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>}
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        {/* Navbar */}
        <header className="navbar">
          <div />
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img
                src={user.avatar || "https://i.pravatar.cc/40"}
                alt="profile"
                className="profile-img"
              />
              <span>{user.name}</span>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <section className="profile-section">
          <div className="profile-left-card">
            <img
              src={user.avatar || "https://i.pravatar.cc/150"}
              alt="User"
              className="profile-avatar"
            />
            <h3>{user.name}</h3>
            <p className="email">{user.email}</p>
            <p className="phone">{user.phone || "—"}</p>

            <button
              className="save-btn"
              onClick={() => navigate("/user/edit-profile")}
            >
              <span>✏️</span> Edit Profile
            </button>
          </div>

          <div className="profile-right-card">
            <h3>Personal Information</h3>

            <div className="info-grid">
              <div>
                <p>Date of Birth</p>
                <h4>{user.dob ? new Date(user.dob).toLocaleDateString() : "—"}</h4>
              </div>
              <div>
                <p>Gender</p>
                <h4>{user.gender || "—"}</h4>
              </div>
              <div>
                <p>City</p>
                <h4>{user.city || "—"}</h4>
              </div>
              <div>
                <p>Country</p>
                <h4>{user.country || "—"}</h4>
              </div>
              <div>
                <p>State</p>
                <h4>{user.state || "—"}</h4>
              </div>
              <div>
                <p>Pin Code</p>
                <h4>{user.pincode || "—"}</h4>
              </div>
            </div>

            <div className="address-section">
              <p>Address</p>
              <h4>{user.address || "—"}</h4>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;
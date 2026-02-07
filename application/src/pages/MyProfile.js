// src/pages/MyProfile.js
import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
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
          <div className="menu-item" onClick={handleLogout}>
            <img src={LogoutIcon} alt="Logout" />
            {!sidebarCollapsed && <span>Log out</span>}
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Navbar */}
        <header className="navbar">
          <div />
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img
                src={profile.avatar || "https://i.pravatar.cc/40"}
                alt="profile"
                className="profile-img"
              />
              <span>{profile.name}</span>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <section className="profile-section">
          <div className="profile-left-card">
            <img
              src={profile.avatar || "https://i.pravatar.cc/150"}
              alt="User"
              className="profile-avatar"
            />
            <h3>{profile.name}</h3>
            <p className="email">{profile.email}</p>
            <p className="phone">{profile.phone || "—"}</p>

            <button className="save-btn">
              <span>✏️</span> Edit Profile
            </button>
          </div>

          <div className="profile-right-card">
            <h3>Personal Information</h3>

            <div className="info-grid">
              <div>
                <p>Date of Birth</p>
                <h4>{profile.dob || "—"}</h4>
              </div>
              <div>
                <p>Gender</p>
                <h4>{profile.gender || "—"}</h4>
              </div>
              <div>
                <p>City</p>
                <h4>{profile.city || "—"}</h4>
              </div>
              <div>
                <p>Country</p>
                <h4>{profile.country || "India"}</h4>
              </div>
              <div>
                <p>State</p>
                <h4>{profile.state || "—"}</h4>
              </div>
              <div>
                <p>Pin Code</p>
                <h4>{profile.pincode || "—"}</h4>
              </div>
            </div>

            <div className="address-section">
              <p>Address</p>
              <h4>{profile.address || "—"}</h4>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;
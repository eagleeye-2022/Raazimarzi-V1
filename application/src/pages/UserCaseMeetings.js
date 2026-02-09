// src/pages/UserCaseMeetings.js
"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/axios";

import HomeIcon from "../assets/icons/home.png";
import Vector from "../assets/icons/Vector.png";
import FileIcon from "../assets/icons/file.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

import { FaCog, FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./UserCaseMeetings.css";

// Create UserContext locally
const UserContext = createContext();

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('userData');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, clearUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

const CaseMeetingsContent = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearUser } = useUser();

  const [search, setSearch] = useState("");
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch meetings from API
  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/meetings/my-meetings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming API returns { upcoming: [...], today: [...] }
      setUpcomingMeetings(res.data.upcoming || []);
      setTodayMeetings(res.data.today || []);
    } catch (err) {
      console.error("❌ Failed to fetch meetings:", err);
      setError("Failed to load meetings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleNext = (meetingId) => {
    // Navigate to meeting call page
    navigate(`/user/case-meetings/call/${meetingId}`);
  };

  const handleReset = () => setSearch("");

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

  // Filter meetings by search
  const filteredUpcoming = upcomingMeetings.filter((m) =>
    m.caseTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredToday = todayMeetings.filter((m) =>
    m.caseTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ padding: 20 }}>Loading meetings...</p>;

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
          <div className="menu-item" onClick={() => navigate("/user/my-profile")}>
            <img src={Vector} alt="Profile" />
            {!sidebarCollapsed && <span>My Profile</span>}
          </div>
          <div className="menu-item" onClick={() => navigate("/user/file-new-case/step1")}>
            <img src={FileIcon} alt="File New Case" />
            {!sidebarCollapsed && <span>File New Case</span>}
          </div>
          <div className="menu-item" onClick={() => navigate("/user/my-cases")}>
            <img src={CaseIcon} alt="My Cases" />
            {!sidebarCollapsed && <span>My Cases</span>}
          </div>
          <div className="menu-item active" onClick={() => navigate("/user/case-meetings")}>
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
      <section className={`main-section ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Navbar */}
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src="https://i.pravatar.cc/40" alt="profile" className="profile-img" />
              <span>Rohan Singhania</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by case title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>

        {error && <p style={{ color: "red", padding: 10 }}>{error}</p>}

        <section className="meetings-section">
          {/* Upcoming Meetings */}
          <div className="upcoming-meetings">
            <div className="section-header">
              <h3>Upcoming Case Meetings</h3>
            </div>
            <div className="meeting-cards">
              {filteredUpcoming.length === 0 ? (
                <p>No upcoming meetings found.</p>
              ) : (
                filteredUpcoming.map((m) => (
                  <div key={m._id} className="meeting-card">
                    <div className="meeting-icon">
                      <img src={Vector} alt="Meeting logo" />
                    </div>
                    <div className="meeting-info">
                      <p className="date">{new Date(m.date).toLocaleDateString()}</p>
                      <p className="time">{m.time}</p>
                      <p className="case-title">{m.caseTitle}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Meetings */}
          <div className="today-meetings">
            <h3>Today's Meetings</h3>
            {filteredToday.length === 0 ? (
              <p>No meetings scheduled for today.</p>
            ) : (
              filteredToday.map((m) => (
                <div key={m._id} className="today-meeting-card">
                  <div className="time-section">
                    <h4>{m.time}</h4>
                    <p>{m.duration || "30 minutes"}</p>
                  </div>
                  <div className="user-section">
                    <div className="user">
                      <img src={m.opponentAvatar || "https://i.pravatar.cc/40"} alt="Opponent" />
                      <p>
                        {m.opponentName} <span>Opponent</span>
                      </p>
                    </div>
                    <div className="user">
                      <img src={m.mediatorAvatar || "https://i.pravatar.cc/40"} alt="Mediator" />
                      <p>
                        {m.mediatorName} <span>Mediator</span>
                      </p>
                    </div>
                  </div>
                  <div className="category-section">
                    <a href="/" className="category">
                      Category
                    </a>
                    <p>{m.caseType}</p>
                  </div>
                  <button className="join-btn" onClick={() => handleNext(m._id)}>
                    Join Now
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

// Wrap with UserProvider before exporting
const CaseMeetings = () => {
  return (
    <UserProvider>
      <CaseMeetingsContent />
    </UserProvider>
  );
};

export default CaseMeetings;
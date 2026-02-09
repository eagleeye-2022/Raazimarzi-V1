// src/pages/UserCaseMeetingsNextPage.js
"use client";

import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
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
import "./UserCaseMeetingsNextPage.css";
import { FaCog, FaBell, FaVideo, FaPhoneSlash, FaMicrophone, FaDesktop, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

  const [message, setMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [chat, setChat] = useState([
    {
      sender: "Abhishek Singh",
      text: "It is a long established fact that a reader will be distracted by the readable content of a page.",
      time: "03:15 pm",
      type: "opponent",
    },
    {
      sender: "Rohan Singh",
      text: "Sure, noted!",
      time: "03:16 pm",
      type: "mediator",
    },
  ]);

  const handleSend = () => {
    if (message.trim() === "") return;

    setChat((prev) => [
      ...prev,
      {
        sender: "You",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "self",
      },
    ]);

    setMessage("");
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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
          <div className="menu-item active" onClick={() => navigate("/user/case-meetings/call")}>
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
          <div className="menu-item" onClick={() => navigate("/user/payment")}>
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

      {/* Main Content */}
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

        {/* Meeting Section */}
        <div className="meeting-container">
          <div className="meeting-header">
            <button className="ongoing-btn">On going meeting</button>
            <button className="case-btn">Case Session</button>
          </div>

          <div className="video-section">
            <div className="video-card opponent">
              <img src="https://i.pravatar.cc/500?img=12" alt="Opponent" className="video-frame" />
              <span className="label">Opponent</span>
            </div>
            <div className="video-card mediator">
              <img src="https://i.pravatar.cc/500?img=32" alt="Mediator" className="video-frame" />
              <span className="label">Mediator</span>
            </div>
            <div className="video-small">
              <img src="https://i.pravatar.cc/150?img=56" alt="You" className="video-frame-small" />
            </div>
          </div>

          <div className="controls">
            <FaVideo className="control-icon" />
            <FaDesktop className="control-icon" />
            <FaPhoneSlash className="control-icon end-call" />
            <FaMicrophone className="control-icon" />
            <FaCog className="control-icon" />
          </div>

          {/* Chat Section */}
          <div className="chat-section">
            <div className="chat-users">
              <h4>Chat Box</h4>
              <div className="chat-user">
                <img src="https://i.pravatar.cc/40?img=12" alt="Opponent" />
                <div>
                  <p className="name">Abhishek Singh</p>
                  <p className="role">Opponent</p>
                </div>
              </div>
              <div className="chat-user">
                <img src="https://i.pravatar.cc/40?img=32" alt="Mediator" />
                <div>
                  <p className="name">Rohan Singh</p>
                  <p className="role">Mediator</p>
                </div>
              </div>
            </div>

            <div className="chat-box">
              <div className="chat-messages">
                <p className="chat-date">Today</p>
                {chat.length === 0 ? (
                  <p style={{ textAlign: "center", padding: 10 }}>No messages yet.</p>
                ) : (
                  chat.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type === "self" ? "self" : ""}`}>
                      <p className="chat-text">{msg.text}</p>
                      <span className="chat-time">{msg.time}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} disabled={!message.trim()}>
                  &#9658;
                </button>
              </div>
            </div>
          </div>
        </div>
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
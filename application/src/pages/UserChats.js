"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Axios instance for API requests

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

import "./UserChats.css";
import { FaCog, FaBell, FaPaperPlane, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Chats = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ Admin email for chat
  const adminEmail = "expert@yourapp.com";

  // 🔹 Fetch chat history with admin
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chats/with/${adminEmail}`);
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("❌ Failed to fetch chat with admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // 🔹 Send message to admin
  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const res = await api.post("/api/chats/send-message", {
        chatWith: adminEmail,
        message,
      });

      setMessages(res.data.messages || [
        ...messages,
        { sender: "You", text: message },
      ]);

      setMessage("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading chat...</p>;

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
          <div className="menu-item" onClick={() => navigate("/user/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" />
            {!sidebarCollapsed && <span>Case Meetings</span>}
          </div>
          <div className="menu-item">
            <img src={DocsIcon} alt="Documents" />
            {!sidebarCollapsed && <span>Documents</span>}
          </div>
          <div className="menu-item active">
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
          <div className="menu-item">
            <img src={LogoutIcon} alt="Logout" />
            {!sidebarCollapsed && <span>Log out</span>}
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <section className={`main-section ${sidebarCollapsed ? 'expanded' : ''}`}>
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

        {/* Chat Box */}
        <div className="chat-container-single">
          <div className="chat-header">
            <img src="https://i.pravatar.cc/40" alt="Admin" />
            <h3>Expert Support</h3>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && <p>No messages yet.</p>}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "You" ? "sent" : "received"}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chats;
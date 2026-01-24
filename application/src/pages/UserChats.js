"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // ✅ production-ready

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
import { FaCog, FaBell, FaPaperPlane, FaSearch } from "react-icons/fa";

const Chats = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch chats on load
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/api/chats/my-chats"); // ✅ uses axios instance
        setChatList(res.data.chats || []);
        if (res.data.chats && res.data.chats.length > 0) {
          setSelectedChat(res.data.chats[0].chatWith);
          setMessages(res.data.chats[0].messages || []);
        }
      } catch (error) {
        console.error("❌ Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const res = await api.post("/api/chats/send-message", {
        chatWith: selectedChat,
        message,
      });

      // Update messages locally
      setMessages(res.data.messages || [...messages, { sender: "You", text: message }]);
      setMessage("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat.chatWith);
    setMessages(chat.messages || []);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading chats...</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/user/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/my-profile")}>
            <img src={Vector} alt="Profile" />
            <span>My Profile</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/file-new-case/step1")}>
            <img src={FileIcon} alt="File New Case" />
            <span>File New Case</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/my-cases")}>
            <img src={CaseIcon} alt="My Cases" />
            <span>My Cases</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" />
            <span>Case Meetings</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/documents")}>
            <img src={DocsIcon} alt="Documents" />
            <span>Documents</span>
          </div>
          <div className="menu-item active">
            <img src={ChatIcon} alt="Chats" />
            <span>Chats</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/payment")}>
            <img src={PaymentIcon} alt="Payment" />
            <span>Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/support")}>
            <img src={SupportIcon} alt="Support" />
            <span>Support</span>
          </div>
        </nav>
        <div className="logout">
          <div className="menu-item">
            <img src={LogoutIcon} alt="Logout" />
            <span>Log out</span>
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <section className="main-section">
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

        {/* Chat Section */}
        <div className="chat-container">
          {/* Left Sidebar - Chats */}
          <div className="chat-list">
            <div className="chat-list-header">
              <h3>My Chats</h3>
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search chat..." />
              </div>
            </div>

            {chatList.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${selectedChat === chat.chatWith ? "active" : ""}`}
                onClick={() => handleSelectChat(chat)}
              >
                <img src={chat.userAvatar || "https://i.pravatar.cc/40"} alt={chat.chatWith} />
                <div>
                  <h4>{chat.chatWith}</h4>
                  <p>{chat.lastMessage || "No messages yet."}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Chat Box */}
          <div className="chat-box">
            <div className="chat-header">
              <img src="https://i.pravatar.cc/40" alt={selectedChat} />
              <h3>{selectedChat || "Select a chat"}</h3>
            </div>

            <div className="chat-messages">
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
              />
              <button onClick={handleSend}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chats;

// src/pages/UserChats.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";

import "./UserChats.css";
import { FaPaperPlane } from "react-icons/fa";

const UserChats = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Admin email for chat
  const adminEmail = "expert@yourapp.com";

  // Helper function to get avatar URL with fallback
  const getAdminAvatar = () => {
    return "https://ui-avatars.com/api/?name=Expert+Support&background=4F46E5&color=fff&size=100";
  };

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

  if (loading) return <p style={{ padding: 20 }}>Loading chat...</p>;

  return (
    <div className="dashboard-container">
      {/* Reusable Sidebar */}
      <UserSidebar activePage="chats" />

      {/* Main Section */}
      <section className="main-section">
        {/* Reusable Navbar */}
        <UserNavbar />

        {/* Chat Box */}
        <div className="chat-container-single">
          <div className="chat-header">
            <img 
              src={getAdminAvatar()} 
              alt="Admin"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=Support&background=4F46E5&color=fff&size=40";
              }}
            />
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

export default UserChats;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/home.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocumentIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";
import "./CaseManagerChats.css";
import { FaCog, FaBell, FaPaperPlane, FaSearch } from "react-icons/fa";

const Chats = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "You", text: "Hello, I have a question about my case." },
    { sender: "Amit Kumar Singh", text: "Sure, please go ahead." },
  ]);

  const handleSend = () => {
    if (message.trim() === "") return;
    setMessages([...messages, { sender: "You", text: message }]);
    setMessage("");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/cm/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/new-cases")}>
            <img src={CaseIcon} alt="My Cases" />
            <span>New Cases</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" />
            <span>Case Meetings</span>
          </div>
             <div className="menu-item" onClick={() => navigate("/cm/client-docs")}>
                      <img src={DocumentIcon} alt="Documents" />
                      <span>Clients Documents</span>
                    </div>
          <div className="menu-item active" onClick={() => navigate("/cm/chats")}>
            <img src={ChatIcon} alt="Chats" />
            <span>Chats</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/payment")}>
            <img src={PaymentIcon} alt="Payment" />
            <span>Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/cm/support")}>
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
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="profile-img"
              />
              <span>Rohan Singhania</span>
            </div>
          </div>
        </header>

        {/* Chat Section */}
        <div className="chat-container">
          {/* Left Sidebar - My Raised Cases */}
          <div className="chat-list">
            <div className="chat-list-header">
              <h3>My Raised Cases</h3>
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search case..." />
              </div>
            </div>

            <div
              className={`chat-item ${selectedChat === "Amit" ? "active" : ""}`}
              onClick={() => setSelectedChat("Amit")}
            >
              <img src="https://i.pravatar.cc/40?img=2" alt="Amit" />
              <div>
                <h4>Amit Kumar Singh</h4>
                <p>Sure, please go ahead.</p>
              </div>
            </div>
            <div
              className={`chat-item ${selectedChat === "Neha" ? "active" : ""}`}
              onClick={() => setSelectedChat("Neha")}
            >
              <img src="https://i.pravatar.cc/40?img=3" alt="Neha" />
              <div>
                <h4>Neha Sharma</h4>
                <p>I'll update the document today.</p>
              </div>
            </div>
          </div>

          {/* Right Chat Box */}
          <div className="chat-box">
            <div className="chat-header">
              <img src="https://i.pravatar.cc/40?img=2" alt="Amit" />
              <h3>{selectedChat || "Select a chat"}</h3>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender === "You" ? "sent" : "received"
                  }`}
                >
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

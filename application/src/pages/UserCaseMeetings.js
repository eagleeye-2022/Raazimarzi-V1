import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/icons/home.png";
import FileIcon from "../assets/icons/file.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";
import Vector from "../assets/icons/Vector.png";
import "./UserCaseMeetings.css";
import { FaCog, FaBell } from "react-icons/fa";


const CaseMeetings = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

 const handleNext = () => {
    navigate("/user/case-meetings/call");
  };

    const handleReset = () => {
        setSearch("");
    };

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
                     <div className="menu-item active" onClick={() => navigate("/user/my-profile")}>
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
                    <div className="menu-item active" onClick={() => navigate("/user/case-meetings")}>
                        <img src={MeetingIcon} alt="Case Meetings" />
                        <span>Case Meetings</span>
                    </div>

                    <div className="menu-item" onClick={() => navigate("/user/documents")}>
                        <img src={DocsIcon} alt="Documents" />
                        <span>Documents</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate("/user/chats")}>
                        <img src={ChatIcon} alt="Chats" />
                        <span>Chats</span>
                    </div>
                    <div className="menu-item" onClick={() => navigate("/user/payments")}>
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

            {/* Main Content */}
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

                {/* Search bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by case id..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="reset-btn" onClick={handleReset}>
                        Reset
                    </button>
                </div>

                <section className="meetings-section">
                    {/* Upcoming Meetings */}
                    <div className="upcoming-meetings">
                        <div className="section-header">
                            <h3>Upcoming Cases Meetings (September 2025)</h3>
                        </div>
                        <div className="meeting-cards">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="meeting-card">
                                    <div className="meeting-icon">
                                        <img src={Vector} alt="Meeting logo" />
                                    </div>
                                    <div className="meeting-info">
                                        <p className="date">Sep 10, 2025</p>
                                        <p className="time">10:00 - 12:00pm</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today's Meeting */}
                    <div className="today-meetings">
                        <h3>Today's Meeting</h3>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="today-meeting-card">
                                <div className="time-section">
                                    <h4>11:00 AM</h4>
                                    <p>30 minutes</p>
                                </div>
                                <div className="user-section">
                                    <div className="user">
                                        <img src="https://i.pravatar.cc/40?img=1" alt="Opponent" />
                                        <p>Abhishek Singh <span>Opponent</span></p>
                                    </div>
                                    <div className="user">
                                        <img src="https://i.pravatar.cc/40?img=2" alt="Mediator" />
                                        <p>Rohan Singh <span>Mediator</span></p>
                                    </div>
                                </div>
                                <div className="category-section">
                                    <a href="/" className="category">Category</a>
                                    <p>Property Dispute</p>
                                </div>
                                <button className="join-btn" onClick={handleNext} Next>Join Now </button>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </div>
    );
};

export default CaseMeetings;
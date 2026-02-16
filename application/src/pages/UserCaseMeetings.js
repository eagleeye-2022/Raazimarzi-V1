"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { FaCog, FaBell } from "react-icons/fa";
import "./UserCaseMeetings.css";

const CaseMeetings = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

export default CaseMeetings;

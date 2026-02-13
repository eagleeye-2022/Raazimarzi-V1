// src/pages/UserCaseMeetings.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";

import Vector from "../assets/icons/Vector.png";

import "./UserCaseMeetings.css";

const UserCaseMeetings = () => {
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

  // Helper function to get avatar URL with fallback
  const getAvatarUrl = (avatarUrl, name) => {
    if (avatarUrl && avatarUrl !== "") {
      return avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random&color=fff&size=100`;
  };

  if (loading) return <p style={{ padding: 20 }}>Loading meetings...</p>;

  return (
    <div className="dashboard-container">
      {/* Reusable Sidebar */}
      <UserSidebar activePage="meetings" />

      {/* Main Section */}
      <section className="main-section">
        {/* Reusable Navbar */}
        <UserNavbar />

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
                      <img 
                        src={getAvatarUrl(m.opponentAvatar, m.opponentName)} 
                        alt="Opponent"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.opponentName || "Opponent")}&background=random&color=fff&size=100`;
                        }}
                      />
                      <p>
                        {m.opponentName} <span>Opponent</span>
                      </p>
                    </div>
                    <div className="user">
                      <img 
                        src={getAvatarUrl(m.mediatorAvatar, m.mediatorName)} 
                        alt="Mediator"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.mediatorName || "Mediator")}&background=random&color=fff&size=100`;
                        }}
                      />
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

export default UserCaseMeetings;
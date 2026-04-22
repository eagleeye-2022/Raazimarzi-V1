import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

import UDIcon1 from "../assets/icons/ud-1.png";
import UDIcon2 from "../assets/icons/ud-2.png";
import UDIcon3 from "../assets/icons/ud-3.png";
import UDIcon4 from "../assets/icons/ud-4.png";
import fingerprint from "../assets/icons/fingerprint.png"
import respond from "../assets/icons/respond.png"

import "./UserDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, pending: 0 });
  const [cases, setCases] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [actions, setActions] = useState([]);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not logged in");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/dashboard/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load dashboard");
          return;
        }

        setStats(data.stats || { total: 0, active: 0, resolved: 0, pending: 0 });
        setCases(data.cases || []);
        setMeetings(data.meetings || []);
        setMessages(data.messages || []);
        setActions(data.actions || []);
        setUserName(data.userName || "User");

      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (["resolved", "awarded"].includes(s))
      return { background: "#dcfce7", color: "#16a34a" };
    if (["in-progress", "assigned", "notice-sent", "mediation", "arbitration"].includes(s))
      return { background: "#dbeafe", color: "#1d4ed8" };
    if (["pending", "pending-review"].includes(s))
      return { background: "#fef3c7", color: "#92400e" };
    if (["rejected", "withdrawn", "closed"].includes(s))
      return { background: "#fee2e2", color: "#dc2626" };
    return { background: "#fef3c7", color: "#92400e" };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
      day: d.getDate(),
    };
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
  };

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) {
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    return "Yesterday";
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <UserSidebar activePage="dashboard" />
        <main className="main-content">
          <UserNavbar />
          <div className="center-state">
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <UserSidebar activePage="dashboard" />
        <main className="main-content">
          <UserNavbar />
          <div className="center-state">
            <p style={{ color: "#dc2626" }}>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <UserSidebar activePage="dashboard" />

      <main className="main-content">
        <UserNavbar />

        {/* Stats */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon-wrap">
              <img src={UDIcon1} alt="Total Cases" className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Cases</p>
              <h2 className="stat-value">{String(stats.total).padStart(2, "0")}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap">
              <img src={UDIcon2} alt="Active Cases" className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Active Cases</p>
              <h2 className="stat-value">{String(stats.active).padStart(2, "0")}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap">
              <img src={UDIcon3} alt="Resolved Cases" className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Resolved Cases</p>
              <h2 className="stat-value">{String(stats.resolved).padStart(2, "0")}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap">
              <img src={UDIcon4} alt="Pending Actions" className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Pending Actions</p>
              <h2 className="stat-value">{String(stats.pending).padStart(2, "0")}</h2>
            </div>
          </div>
        </section>

        {/*----------------- Cases + Action Required ---------*/}
        <section className="cases-actions-row">

          {/* LEFT — Recent Disputes */}
          <div className="disputes-wrapper">
            <div className="disputes-header">
              <h3 className="disputes-title">Recent Disputes</h3>
              <button
                className="view-all-btn"
                onClick={() => navigate("/user/my-cases")}
              >
                View All
              </button>
            </div>
            <div className="cases-section">
              {cases.length === 0 ? (
                <p className="empty-state">No cases found.</p>
              ) : (
                <table className="cases-table">
                  <thead>
                    <tr>
                      <th>CASE ID</th>
                      <th>TOPIC</th>
                      <th>RESPONDENT</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.slice(0, 5).map((c, index) => (
                      <tr key={index}>
                        <td className="case-id">#{c.id}</td>
                        <td>{c.title || c.topic}</td>
                        <td>{c.party2 || c.respondent}</td>
                        <td>
                          <span className="status-badge" style={getStatusStyle(c.status)}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <button className="view-details-btn">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* RIGHT — Action Required */}
          <div className="action-required-panel">
            <div className="action-header">
              <span className="action-exclaim">!</span>
              <h3 className="action-title">Action Required</h3>
            </div>

            {actions.length === 0 ? (
              <p className="empty-state">No actions required.</p>
            ) : (
              <div className="action-list">
                {actions.map((action, i) => (
                  <div key={i} className="action-item">
                    <div className="action-left-border" />
                    <div className="action-icon">
                      {action.type === "document" ? (
                        <img src={fingerprint} alt="doc" />
                      ) : (
                        <img src={respond} alt="chat" />
                      )}
                    </div>
                    <p className="action-text">{action.description}</p>
                    <button className="action-cta">
                      {action.type === "document" ? "Complete Now" : "Reply"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

        {/* Messages + Appointments */}
        <section className="bottom-row">
          {/* Recent Messages */}
          <div className="messages-section">
            <div className="section-header">
              <h3>Recent Messages</h3>
              <button className="icon-btn">···</button>
            </div>

            <div className="message-list">
              {messages.length === 0 ? (
                <p className="empty-state">No messages yet.</p>
              ) : (
                messages.slice(0, 2).map((msg, i) => (
                  <div key={i} className="message-item">
                    <img
                      src={msg.avatar || `https://i.pravatar.cc/40?img=${i + 1}`}
                      alt={msg.sender}
                      className="msg-avatar"
                    />
                    <div className="msg-body">
                      <div className="msg-top">
                        <span className="msg-sender">{msg.sender}</span>
                        <span className="msg-time">{formatMessageTime(msg.createdAt)}</span>
                      </div>
                      <p className="msg-preview">"{msg.preview}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              className="goto-messenger-btn"
              onClick={() => navigate("/user/chats")}
            >
              Go to Messenger
            </button>
          </div>

          {/* Upcoming Appointments */}
          <div className="appointments-section">
            <h3>Upcoming Appointments</h3>

            {meetings.length === 0 ? (
              <p className="empty-state">No upcoming appointments.</p>
            ) : (
              <div className="appointment-list">
                {meetings.slice(0, 2).map((m, i) => {
                  const fd = formatDate(m.date);
                  const isPrimary = i === 0;
                  return (
                    <div key={m.id || i} className="appointment-card">
                      <div className="appt-date-badge">
                        <span className="appt-month">{fd.month}</span>
                        <span className="appt-day">{fd.day}</span>
                      </div>
                      <div className="appt-info">
                        <p className="appt-title">{m.title || m.caseId}</p>
                        <p className="appt-time">
                          {m.time || formatTime(m.date)} / #{m.caseId || m.id}
                        </p>
                      </div>
                      {isPrimary ? (
                        <button
                          className="join-meeting-btn"
                          onClick={() => navigate("/user/case-meetings")}
                        >
                          Join Meeting
                        </button>
                      ) : (
                        <button
                          className="view-details-outline-btn"
                          onClick={() => navigate("/user/documents")}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
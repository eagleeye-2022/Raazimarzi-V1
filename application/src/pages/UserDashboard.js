import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";

import ActiveIcon from "../assets/icons/active.png";
import CurrentIcon from "../assets/icons/current.png";
import TotalIcon from "../assets/icons/total.png";
import Vector from "../assets/icons/Vector.png";

import { PieChart, Pie, Cell } from "recharts";

import "./UserDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const UserDashboard = () => {
  const [showAllCases, setShowAllCases]   = useState(false);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  /* ── Real data state ── */
  const [stats, setStats]                 = useState({ active: 0, current: 0, total: 0, progress: null });
  const [cases, setCases]                 = useState([]);
  const [meetings, setMeetings]           = useState([]);
  const [todayReminder, setTodayReminder] = useState(null);
  const [documents, setDocuments]         = useState({ total: 0, approved: 0, progress: 0, recent: [] });

  /* ── Pie chart colors ── */
  const COLORS = ["#7C3AED", "#E5E7EB"];

  /* ── Fetch dashboard data on mount ── */
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
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load dashboard");
          return;
        }

        setStats(data.stats         || { active: 0, current: 0, total: 0, progress: null });
        setCases(data.cases         || []);
        setMeetings(data.meetings   || []);
        setTodayReminder(data.todayReminder || null);
        setDocuments(data.documents || { total: 0, approved: 0, progress: 0, recent: [] });

      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ── Pie data from real documents ── */
  const pieData = [
    { name: "Completed", value: documents.progress       || 0  },
    { name: "Remaining", value: 100 - (documents.progress || 0) },
  ];

  /* ── Status badge color ── */
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (["resolved", "awarded"].includes(s))
      return { background: "#dcfce7", color: "#16a34a" };
    if (["in-progress", "assigned", "notice-sent", "mediation", "arbitration"].includes(s))
      return { background: "#dbeafe", color: "#1d4ed8" };
    if (["pending", "pending-review"].includes(s))
      return { background: "#fef9c3", color: "#854d0e" };
    if (["rejected", "withdrawn", "closed"].includes(s))
      return { background: "#fee2e2", color: "#dc2626" };
    return { background: "#dcfce7", color: "#16a34a" };
  };

  /* ── Format date ── */
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  /* ── Get current month name ── */
  const currentMonth = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });

  /* ── Display cases — all or first 3 ── */
  const displayedCases = showAllCases ? cases : cases.slice(0, 3);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="dashboard-container">
        <UserSidebar activePage="dashboard" />
        <main className="main-content">
          <UserNavbar />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <p style={{ color: "#888", fontSize: "16px" }}>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="dashboard-container">
        <UserSidebar activePage="dashboard" />
        <main className="main-content">
          <UserNavbar />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <p style={{ color: "#dc2626", fontSize: "16px" }}>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Reusable Sidebar */}
      <UserSidebar activePage="dashboard" />

      {/* Main Content */}
      <main className="main-content">
        {/* Reusable Navbar */}
        <UserNavbar />

        {/* Stats */}
        <section className="stats">
          <div className="stat-card green">
            <div className="stat-left">
              <p className="stat-label">Active Case</p>
              <h2 className="stat-value">{String(stats.active).padStart(2, "0")}</h2>
            </div>
            <div className="stat-right">
              <img src={ActiveIcon} alt="Active Case" className="stat-icon" />
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-left">
              <p className="stat-label">Current Cases</p>
              <h2 className="stat-value">{String(stats.current).padStart(2, "0")}</h2>
            </div>
            <div className="stat-right">
              <img src={CurrentIcon} alt="Current Cases" className="stat-icon" />
            </div>
          </div>

          <div className="stat-card yellow">
            <div className="stat-left">
              <p className="stat-label">Total Case</p>
              <h2 className="stat-value">{String(stats.total).padStart(2, "0")}</h2>
            </div>
            <div className="stat-right">
              <img src={TotalIcon} alt="Total Case" className="stat-icon" />
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-left">
              <p className="stat-label">
                Progress {stats.progress ? `: ${stats.progress.caseId}` : ""}
              </p>
              <h2 className="stat-value">
                +{documents.progress || 0}%
              </h2>
            </div>
            <div className="stat-right">
              <img src={ActiveIcon} alt="Progress" className="stat-icon" />
            </div>
          </div>
        </section>

        {/* Cases Table */}
        <section className="cases-section">
          <div className="section-header">
            <h3>My Cases ({currentMonth})</h3>
            {cases.length > 3 && (
              <button onClick={() => setShowAllCases(!showAllCases)}>
                {showAllCases ? "Hide" : "View all"}
              </button>
            )}
          </div>

          {displayedCases.length === 0 ? (
            <p style={{ color: "#888", padding: "20px 0" }}>No cases found.</p>
          ) : (
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Party 1</th>
                  <th>Party 2</th>
                  <th>Category</th>
                  <th>Mediator</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedCases.map((c, index) => (
                  <tr key={index}>
                    <td>{c.id}</td>
                    <td>{c.title}</td>
                    <td>{c.party1}</td>
                    <td>{c.party2}</td>
                    <td style={{ textTransform: "capitalize" }}>{c.category}</td>
                    <td className="mediator-cell">
                      <img
                        src={c.mediatorAvatar || "https://i.pravatar.cc/30?img=2"}
                        alt="mediator"
                        className="mediator-img"
                      />
                      {c.mediator}
                    </td>
                    <td>
                      <span className="status-badge" style={getStatusStyle(c.status)}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Meetings Section */}
        <section className="user-meetings-section">
          {/* Left — Upcoming Meetings */}
          <div className="user-upcoming-meetings">
            <div className="user-section-header">
              <h3>Upcoming Meetings ({currentMonth})</h3>
            </div>

            <div className="user-meeting-cards">
              {meetings.length === 0 ? (
                <p style={{ color: "#888", fontSize: "14px" }}>No upcoming meetings.</p>
              ) : (
                meetings.slice(0, 4).map((m) => (
                  <div key={m.id} className="user-meeting-card">
                    <div className="meeting-icon">
                      <img src={Vector} alt="Meeting logo" />
                    </div>
                    <div className="meeting-info">
                      <p className="date">{formatDate(m.date)}</p>
                      <p className="time">{m.time || formatTime(m.date)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right — Reminder */}
          <div className="right-section">
            <div className="view-all-wrapper">
              <button className="view-all">View all</button>
            </div>

            <div className="today-reminder">
              {todayReminder ? (
                <>
                  <div className="reminder-header">
                    <h4>Today</h4>
                    <span className="reminder-date">{formatDate(todayReminder.date)}</span>
                  </div>

                  <p className="reminder-time">
                    {todayReminder.time || formatTime(todayReminder.date)}
                  </p>

                  <div className="reminder-details">
                    <p><span className="label">Case ID:</span> {todayReminder.caseId}</p>
                    <p><span className="label">Title:</span> {todayReminder.title}</p>
                    <p><span className="label">Opponent:</span> {todayReminder.opponent}</p>
                  </div>

                  <button
                    className="join-btn"
                    onClick={() => todayReminder.link && window.open(todayReminder.link, "_blank")}
                    disabled={!todayReminder.link}
                  >
                    Join now
                  </button>
                </>
              ) : (
                <>
                  <div className="reminder-header">
                    <h4>Today</h4>
                    <span className="reminder-date">{formatDate(new Date())}</span>
                  </div>
                  <p style={{ color: "#888", fontSize: "14px", marginTop: "12px" }}>
                    No meetings scheduled for today.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Documents & Payments */}
        <section className="documents-payments">
          <div className="documents">
            <h3>Documents</h3>
            <div className="doc-content">
              <PieChart width={120} height={120}>
                <Pie
                  data={pieData}
                  cx={60}
                  cy={60}
                  innerRadius={35}
                  outerRadius={55}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <ul>
                {documents.recent.length === 0 ? (
                  <li style={{ color: "#888" }}>No documents uploaded yet</li>
                ) : (
                  documents.recent.map((doc, i) => (
                    <li key={i}>{doc.documentTitle}</li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="payments">
            <h3>Payments</h3>
            {/* Payment gateway coming soon */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
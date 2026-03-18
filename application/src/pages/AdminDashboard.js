import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import ActiveIcon  from "../assets/icons/active.png";
import CurrentIcon from "../assets/icons/current.png";
import TotalIcon   from "../assets/icons/total.png";
import HomeIcon    from "../assets/icons/home.png";
import CaseIcon    from "../assets/icons/newcase.png";
import MeetingIcon from "../assets/icons/meeting.png";
import ChatIcon    from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon  from "../assets/icons/logout.png";

import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { FaCog, FaBell } from "react-icons/fa";

Chart.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [admin, setAdmin]                   = useState({ name: "Admin", avatar: "" });
  const [stats, setStats]                   = useState({ active: 0, current: 0, total: 0 });
  const [cases, setCases]                   = useState([]);
  const [todayMeetings, setTodayMeetings]   = useState([]);
  const [caseProgress, setCaseProgress]     = useState(null);
  const [searchCaseId, setSearchCaseId]     = useState("");
  const [searchLoading, setSearchLoading]   = useState(false);

  /* ── Fetch dashboard data ── */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { setError("Not logged in"); setLoading(false); return; }

        const res  = await fetch(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load dashboard");
          return;
        }

        setAdmin(data.admin || { name: "Admin", avatar: "" });
        setStats(data.stats || { active: 0, current: 0, total: 0 });
        setCases(data.cases || []);
        setTodayMeetings(data.todayMeetings || []);
        setCaseProgress(data.caseProgress || null);
      } catch (err) {
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ── Search case progress ── */
  const handleCaseSearch = async (e) => {
    e.preventDefault();
    if (!searchCaseId.trim()) return;

    try {
      setSearchLoading(true);
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_URL}/admin/case-progress/${searchCaseId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCaseProgress(data.progress);
      else alert("Case not found");
    } catch (err) {
      alert("Error searching case");
    } finally {
      setSearchLoading(false);
    }
  };

  /* ── Chart data from real values ── */
  const phaseChart = {
    labels: ["Completed", "Remaining"],
    datasets: [{
      data: [caseProgress?.phasePercent || 0, 100 - (caseProgress?.phasePercent || 0)],
      backgroundColor: ["#6b5bff", "#eee"],
      borderWidth: 0,
    }],
  };

  const paymentChart = {
    labels: ["Paid", "Remaining"],
    datasets: [{
      data: caseProgress?.filingFeePaid ? [100, 0] : [0, 100],
      backgroundColor: ["#30c48d", "#eee"],
      borderWidth: 0,
    }],
  };

  /* ── Status badge style ── */
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (["resolved","awarded"].includes(s))         return { color: "#16a34a" };
    if (["in-progress","assigned","mediation","arbitration","notice-sent"].includes(s))
                                                     return { color: "#1d4ed8" };
    if (["pending","pending-review"].includes(s))    return { color: "#854d0e" };
    if (["rejected","withdrawn"].includes(s))        return { color: "#dc2626" };
    return { color: "#16a34a" }; // default active green
  };

  /* ── Format date ── */
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  /* ── Current month label ── */
  const currentMonth = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <aside className="admin-sidebar">
          <h2 className="admin-sidebar-title">Dashboard</h2>
        </aside>
        <main className="admin-main-content" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <p style={{ color:"#888" }}>Loading dashboard...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <aside className="admin-sidebar"><h2 className="admin-sidebar-title">Dashboard</h2></aside>
        <main className="admin-main-content" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <p style={{ color:"#dc2626" }}>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Dashboard</h2>
        <nav className="admin-menu">
          <div className="admin-menu-item active" onClick={() => navigate("/admin/dashboard")}>
            <img src={HomeIcon} alt="Home" /><span>Home</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/new-cases")}>
            <img src={CaseIcon} alt="New Cases" /><span>New Cases</span>
          </div>
          <div className="admin-menu-item" onClick={() => navigate("/admin/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" /><span>Case Meetings</span>
          </div>
          <div className="admin-menu-item" onClick={() => navigate("/admin/chats")}>
            <img src={ChatIcon} alt="Chats" /><span>Chats</span>
          </div>
          <div className="admin-menu-item" onClick={() => navigate("/admin/payment")}>
            <img src={PaymentIcon} alt="Payment" /><span>Payment</span>
          </div>
          <div className="admin-menu-item" onClick={() => navigate("/admin/support")}>
            <img src={SupportIcon} alt="Support" /><span>Support</span>
          </div>
        </nav>
        <div className="admin-logout">
          <div className="admin-menu-item">
            <img src={LogoutIcon} alt="Logout" /><span>Log out</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Navbar */}
        <header className="admin-navbar">
          <div></div>
          <div className="admin-nav-icons">
            <FaCog className="admin-icon" />
            <FaBell className="admin-icon" />
            <div className="admin-profile">
              <img
                src={admin.avatar || "https://i.pravatar.cc/40"}
                alt="profile"
                className="admin-profile-img"
              />
              <span>{admin.name}</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="admin-stats">
          <div className="admin-stat-card admin-green">
            <div className="admin-stat-left">
              <p className="admin-stat-label">Active Case</p>
              <h2 className="admin-stat-value">{String(stats.active).padStart(2,"0")}</h2>
            </div>
            <div className="admin-stat-right">
              <img src={ActiveIcon} alt="Active Case" className="admin-stat-icon" />
            </div>
          </div>

          <div className="admin-stat-card admin-blue">
            <div className="admin-stat-left">
              <p className="admin-stat-label">Current Cases</p>
              <h2 className="admin-stat-value">{String(stats.current).padStart(2,"0")}</h2>
            </div>
            <div className="admin-stat-right">
              <img src={CurrentIcon} alt="Current Cases" className="admin-stat-icon" />
            </div>
          </div>

          <div className="admin-stat-card admin-yellow">
            <div className="admin-stat-left">
              <p className="admin-stat-label">Total Case</p>
              <h2 className="admin-stat-value">{String(stats.total).padStart(2,"0")}</h2>
            </div>
            <div className="admin-stat-right">
              <img src={TotalIcon} alt="Total Case" className="admin-stat-icon" />
            </div>
          </div>

          <div className="admin-stat-card admin-purple">
            <div className="admin-stat-left">
              <p className="admin-stat-label">
                {caseProgress ? `Progress: ${caseProgress.caseId}` : "Resolution Rate"}
              </p>
              <h2 className="admin-stat-value">+{stats.resolutionRate || 0}%</h2>
            </div>
            <div className="admin-stat-right">
              <img src={ActiveIcon} alt="Progress" className="admin-stat-icon" />
            </div>
          </div>
        </section>

        {/* New Cases Table */}
        <section className="admin-new-cases">
          <div className="admin-section-header">
            <h3>New Cases ({currentMonth})</h3>
            <button onClick={() => navigate("/admin/new-cases")}>View all</button>
          </div>
          {cases.length === 0 ? (
            <p style={{ color:"#888", padding:"16px 0" }}>No cases found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Party 1</th>
                  <th>Party 2</th>
                  <th>Category</th>
                  <th>Assigned to</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cases.slice(0, 5).map((c) => (
                  <tr key={c._id} style={{ cursor:"pointer" }} onClick={() => navigate(`/admin/cases/${c._id}`)}>
                    <td>{c.caseId}</td>
                    <td>{c.title}</td>
                    <td>{c.party1}</td>
                    <td>{c.party2}</td>
                    <td style={{ textTransform:"capitalize" }}>{c.category}</td>
                    <td className="admin-assigned">
                      <img
                        src={c.assignedAvatar || "https://i.pravatar.cc/30"}
                        alt="avatar"
                      />
                      {c.assignedTo}
                    </td>
                    <td className="admin-status admin-active" style={getStatusStyle(c.status)}>
                      {c.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Middle Section */}
        <section className="admin-middle">
          {/* Meeting Scheduled */}
          <div className="admin-meeting-section">
            <h3 className="admin-meeting-title">Meeting Scheduled</h3>

            <div className="admin-meeting-container">
              {todayMeetings.length === 0 ? (
                <>
                  <div className="admin-meeting-header">
                    <div>
                      <p className="admin-meeting-day">Today</p>
                      <p className="admin-meeting-time">No meetings scheduled</p>
                    </div>
                    <span className="admin-meeting-date">{formatDate(new Date())}</span>
                  </div>
                  <div className="admin-meeting-footer">
                    <button className="admin-join-btn" disabled style={{ opacity:0.5 }}>No Meeting</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-meeting-header">
                    <div>
                      <p className="admin-meeting-day">Today</p>
                      <p className="admin-meeting-time">{todayMeetings[0]?.time || ""}</p>
                    </div>
                    <span className="admin-meeting-date">{formatDate(todayMeetings[0]?.date)}</span>
                  </div>

                  <div className="admin-meeting-list">
                    {todayMeetings.slice(0, 2).map((m) => (
                      <div className="admin-meeting-row" key={m._id}>
                        <p><strong>Case Id:</strong> {m.caseId}</p>
                        <p><strong>Title:</strong> {m.title}</p>
                        <p><strong>Meeting:</strong> {m.meetingWith}</p>
                      </div>
                    ))}
                  </div>

                  <div className="admin-meeting-footer">
                    <button
                      className="admin-join-btn"
                      onClick={() => todayMeetings[0]?.link && window.open(todayMeetings[0].link, "_blank")}
                      disabled={!todayMeetings[0]?.link}
                    >
                      Join now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Case Progress */}
          <section className="admin-case-progress">
            <h3>Case Progress</h3>

            <div className="admin-case-progress-box">
              <div className="admin-progress-header">
                <form onSubmit={handleCaseSearch} style={{ display:"flex", gap:"8px" }}>
                  <input
                    type="text"
                    placeholder="Search by case id..."
                    value={searchCaseId}
                    onChange={(e) => setSearchCaseId(e.target.value)}
                  />
                  <button type="submit" style={{ padding:"6px 12px", cursor:"pointer" }}>
                    {searchLoading ? "..." : "Go"}
                  </button>
                </form>
                {caseProgress && (
                  <div className="admin-progress-status">
                    <span className="admin-status-label">Status:</span>
                    <span className="admin-status admin-active" style={getStatusStyle(caseProgress.status)}>
                      {caseProgress.status}
                    </span>
                    <span className="admin-case-id">Case Id: {caseProgress.caseId}</span>
                  </div>
                )}
              </div>

              <div className="admin-charts-row">
                <div className="admin-chart-item">
                  <div className="admin-chart-wrapper">
                    <Doughnut
                      data={phaseChart}
                      options={{ cutout:"75%", plugins:{ legend:{display:false}, tooltip:{enabled:false} } }}
                    />
                    <div className="admin-chart-center">
                      <p className="admin-chart-title">{caseProgress?.phase || "Phase 1"}</p>
                      <p className="admin-chart-subtitle">{caseProgress?.phasePercent || 0}%</p>
                    </div>
                  </div>
                </div>

                <div className="admin-chart-item">
                  <div className="admin-chart-wrapper">
                    <Doughnut
                      data={paymentChart}
                      options={{ cutout:"75%", plugins:{ legend:{display:false}, tooltip:{enabled:false} } }}
                    />
                    <div className="admin-chart-center">
                      <p className="admin-chart-title">Payment</p>
                      <p className="admin-chart-subtitle">
                        {caseProgress?.filingFeePaid ? `₹${caseProgress.filingFee?.toLocaleString("en-IN")}` : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {caseProgress ? (
                <div className="admin-case-details">
                  <p><strong>Party 1:</strong> {caseProgress.party1}</p>
                  <p><strong>Party 2:</strong> {caseProgress.party2}</p>
                  <p><strong>Mediator:</strong> {caseProgress.mediator}</p>
                  <p><strong>Manager:</strong> {caseProgress.manager}</p>
                  <p><strong>Category:</strong> {caseProgress.category}</p>
                </div>
              ) : (
                <div className="admin-case-details">
                  <p style={{ color:"#888" }}>Search a case ID above to view progress</p>
                </div>
              )}
            </div>
          </section>
        </section>

        {/* Bottom Section */}
        <section className="admin-bottom">
          <div className="admin-feedback">
            <h3>Feedback {caseProgress ? `Case Id: ${caseProgress.caseId}` : ""}</h3>
            <div className="admin-feedback-box">
              <p style={{ color:"#888" }}>Feedback system coming soon</p>
            </div>
          </div>

          <div className="admin-coming-soon">
            <h3>Coming Soon...!</h3>
            <div className="admin-coming-box">
              <p>🚧 New Features in Progress 🚧</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
// src/pages/AdminDashboard.js
import React, { useState, useEffect, useRef } from "react";
import "./AdminDashboard.css";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaHome, FaFolder, FaUsers, FaComments, FaCreditCard, FaLifeRing, FaSignOutAlt, FaBars } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart, CategoryScale, LinearScale, PointElement, LineElement,
  Tooltip, Filler,
} from "chart.js";

import UDIcon1 from "../assets/icons/ud-1.png";
import UDIcon2 from "../assets/icons/ud-2.png";
import UDIcon3 from "../assets/icons/ud-3.png";
import UDIcon4 from "../assets/icons/ud-4.png";
import ADIcon5 from "../assets/icons/ad-5.png";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/* ── helpers ── */
const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const getStatusClass = (s = "") => {
  const v = s.toLowerCase();
  if (["resolved", "awarded", "active"].includes(v)) return "adx-badge-green";
  if (["pending", "pending-review"].includes(v)) return "adx-badge-yellow";
  if (["rejected", "withdrawn"].includes(v)) return "adx-badge-red";
  return "adx-badge-blue";
};

/* ── MOCK fallback (used when API is unavailable) ── */
const MOCK = {
  admin: { name: "Admin", avatar: "" },
  stats: { total: 10, active: 2, resolved: 8, pending: 4, revenue: 580000 },
  cases: [
    { _id: "1", caseId: "#4245", title: "Property Division", party1: "Ramesh V", party2: "Suresh V", mediator: "Dharma", status: "PENDING" },
    { _id: "2", caseId: "#4246", title: "Employment Dispute", party1: "Harish K", party2: "Tech Corp", mediator: "Anita R", status: "ACTIVE" },
    { _id: "3", caseId: "#4247", title: "Consumer Complaint", party1: "Priya M", party2: "Store Ltd", mediator: "Vikas S", status: "RESOLVED" },
    { _id: "4", caseId: "#4248", title: "Lease Disagreement", party1: "Kavya T", party2: "Landlord", mediator: "Dharma", status: "PENDING" },
    { _id: "5", caseId: "#4249", title: "Insurance Claim", party1: "Arun N", party2: "Insurer Co", mediator: "Anita R", status: "PENDING" },
  ],
  actions: [
    { id: 1, title: "Overdue Cases (03)", sub: "Cases exceeding resolution time", btn: "Remind Mediator", icon: "⏰" },
    { id: 2, title: "Unassigned Mediations (12)", sub: "Cases awaiting mediator assignment", btn: "Assign Mediators", icon: "👤" },
    { id: 3, title: "Respondent Onboarding (18)", sub: "Follow up with respondent for onboarding", btn: "View Details", icon: "🔗" },
  ],
  sessions: [
    { id: 1, month: "OCT", day: "15", caseId: "#7843 (Asset Mediation)", time: "10:30 AM – 11:30 AM" },
    { id: 2, month: "OCT", day: "16", caseId: "#8734 (Employment Dispute)", time: "02:00 PM – 03:00 PM" },
  ],
  registrations: [
    { id: 1, name: "Harish", role: "Corporate Attorney", ago: "2m ago" },
    { id: 2, name: "Vikas", role: "Worker", ago: "1h ago" },
  ],
  revenueMonthly: [12000, 18000, 14000, 22000, 17000, 25000, 30000, 27000, 32000, 28000, 24000, 20000],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(MOCK.admin);
  const [stats, setStats] = useState(MOCK.stats);
  const [cases, setCases] = useState(MOCK.cases);
  const [actions, setActions] = useState(MOCK.actions);
  const [sessions, setSessions] = useState(MOCK.sessions);
  const [registrations, setRegistrations] = useState(MOCK.registrations);
  const [revenueData, setRevenueData] = useState(MOCK.revenueMonthly);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAdmin(data.admin || MOCK.admin);
          setStats(data.stats || MOCK.stats);
          setCases(data.cases || MOCK.cases);
          if (data.actions) setActions(data.actions);
          if (data.sessions) setSessions(data.sessions);
          if (data.registrations) setRegistrations(data.registrations);
          if (data.revenueMonthly) setRevenueData(data.revenueMonthly);
        }
      } catch (_) { /* keep mock */ }
      finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  /* ── Revenue chart config ── */
  const chartData = {
    labels: MONTH_LABELS,
    datasets: [{
      data: revenueData,
      borderColor: "rgba(119,138,255,1)",
      backgroundColor: "rgba(119,138,255,0.1)",
      borderWidth: 2.5,
      tension: 0.45,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
    }],
  };
  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#bbb" } },
      y: { display: false },
    },
  };

  const filteredCases = cases.filter((c) =>
    !search || [c.caseId, c.title, c.mediator, c.party1, c.party2]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const currentMonth = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });

  if (loading) return (
    <div className="adx-root">
      <div className="adx-loading">Loading dashboard…</div>
    </div>
  );

  return (
    <div className="adx-root">

      {/* ══ SIDEBAR ══ */}
      <AdminSidebar activePage="dashboard" />

      {/* ══ MAIN ══ */}
      <main className="adx-main">

        {/* ── Topbar ── */}
        <header className="adx-topbar">
          <div className="adx-search">
            <FaSearch className="adx-search__icon" />
            <input
              className="adx-search__input"
              placeholder="Search cases, mediators or files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="adx-topbar__right">
            <button className="adx-topbar__bell"><FaBell /></button>
            <div className="adx-topbar__profile">
              <img
                src={admin.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=778aff&color=fff&size=80`}
                alt="admin"
                className="adx-topbar__avatar"
              />
            </div>
          </div>
        </header>

        <div className="adx-body">

          {/* ── STAT CARDS ── */}

          <section className="adx-stats">

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <img src={UDIcon1} alt="Total Cases" className="stat-icon" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Cases</p>
                <h2 className="stat-value">{pad(stats.total)}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <img src={UDIcon2} alt="Active Cases" className="stat-icon" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active Cases</p>
                <h2 className="stat-value">{pad(stats.active)}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <img src={UDIcon3} alt="Resolved Cases" className="stat-icon" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Resolved Cases</p>
                <h2 className="stat-value">{pad(stats.resolved)}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <img src={UDIcon4} alt="Pending Actions" className="stat-icon" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending Actions</p>
                <h2 className="stat-value">{pad(stats.pending)}</h2>
              </div>
            </div>

            {/* NEW ADMIN CARD */}
            <div className="stat-card">
              <div className="stat-icon-wrap">
                <img src={ADIcon5} alt="Total Revenue" className="stat-icon" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Revenue</p>
                <h2 className="stat-value">
                  ₹{(stats.revenue / 100000).toFixed(1)}L
                </h2>
              </div>
            </div>

          </section>

          {/* ── MIDDLE GRID: Actions + Revenue ── */}
          <section className="adx-mid">

            {/* Action Required */}
            <div className="adx-card adx-actions">
              <h3 className="adx-card__title adx-actions__heading">
                <span className="adx-actions__bang">❗</span> Action Required
              </h3>
              <div className="adx-actions__list">
                {actions.map((a) => (
                  <div key={a.id} className="adx-action-row">
                    <span className="adx-action-row__icon">{a.icon}</span>
                    <div className="adx-action-row__text">
                      <p className="adx-action-row__title">{a.title}</p>
                      <p className="adx-action-row__sub">{a.sub}</p>
                    </div>
                    <button className="adx-action-row__btn">{a.btn}</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="adx-card adx-revenue">
              <div className="adx-revenue__header">
                <div>
                  <p className="adx-revenue__label">Revenue</p>
                  <p className="adx-revenue__sub">Earnings Performance</p>
                </div>
                <div className="adx-revenue__right">
                  <span className="adx-revenue__amount">₹{(stats.revenue / 100).toLocaleString("en-IN")}.00</span>
                  <span className="adx-revenue__growth">↑ 36%</span>
                  <p className="adx-revenue__growthlabel">Growth this month</p>
                </div>
              </div>
              <div className="adx-revenue__chart">
                <Line data={chartData} options={chartOpts} />
              </div>
            </div>
          </section>

          {/* ── BOTTOM GRID: Table + Sidebar widgets ── */}
          <section className="adx-bottom">

            {/* Recent Disputes Table */}
            <div className="adx-card adx-table-card">
              <div className="adx-table-card__header">
                <h3 className="adx-card__title">Recent Disputes</h3>
                <button className="adx-link-btn" onClick={() => navigate("/admin/new-cases")}>View All</button>
              </div>
              <div className="adx-table-wrap">
                <table className="adx-table">
                  <thead>
                    <tr>
                      <th>CASE ID</th>
                      <th>TOPIC</th>
                      <th>MEDIATOR</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.slice(0, 6).map((c) => (
                      <tr key={c._id} onClick={() => navigate(`/admin/cases/${c._id}`)}>
                        <td className="adx-table__caseid">{c.caseId}</td>
                        <td>{c.title}</td>
                        <td>{c.mediator || c.assignedTo || "—"}</td>
                        <td>
                          <span className={`adx-badge ${getStatusClass(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="adx-view-btn"
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/cases/${c._id}`); }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredCases.length === 0 && (
                      <tr><td colSpan={5} className="adx-table__empty">No cases match your search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right widgets */}
            <div className="adx-widgets">

              {/* Upcoming Sessions */}
              <div className="adx-card adx-sessions">
                <div className="adx-sessions__header">
                  <p className="adx-sessions__heading">UPCOMING SESSIONS</p>
                  <button className="adx-link-btn" onClick={() => navigate("/admin/case-meetings")}>View All</button>
                </div>
                <div className="adx-sessions__list">
                  {sessions.map((s) => (
                    <div key={s.id} className="adx-session-row">
                      <div className="adx-session-row__date">
                        <span className="adx-session-row__month">{s.month}</span>
                        <span className="adx-session-row__day">{s.day}</span>
                      </div>
                      <div className="adx-session-row__info">
                        <p className="adx-session-row__title">{s.caseId}</p>
                        <p className="adx-session-row__time">{s.time}</p>
                      </div>
                      <button className="adx-session-row__arrow">›</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Registrations */}
              <div className="adx-card adx-registrations">
                <p className="adx-sessions__heading" style={{ marginBottom: 14 }}>NEW REGISTRATIONS</p>
                <div className="adx-reg__list">
                  {registrations.map((r) => (
                    <div key={r.id} className="adx-reg-row">
                      <div className="adx-reg-row__avatar">
                        {r.name.charAt(0)}
                      </div>
                      <div className="adx-reg-row__info">
                        <p className="adx-reg-row__name">{r.name}</p>
                        <p className="adx-reg-row__role">{r.role}</p>
                      </div>
                      <span className="adx-reg-row__ago">{r.ago}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="adx-view-all-users"
                  onClick={() => navigate("/admin/users")}
                >
                  VIEW ALL USERS
                </button>
              </div>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
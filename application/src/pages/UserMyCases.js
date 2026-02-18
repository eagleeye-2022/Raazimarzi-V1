// src/pages/UserMyCases.js
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
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

import "./UserMyCases.css";
import { FaCog, FaBell, FaChevronLeft, FaChevronRight, FaSyncAlt } from "react-icons/fa";

// ─── Local UserContext ────────────────────────────────────────────────────────
const UserContext = createContext();

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const clearUser = () => { setUser(null); localStorage.removeItem("userData"); };
  const updateUser = (userData) => setUser(userData);
  return (
    <UserContext.Provider value={{ user, clearUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ─── Status badge helper ──────────────────────────────────────────────────────

const statusClass = (status = "") => status.toLowerCase().replace(/\s+/g, "-");

// ─── CasesTable sub-component ─────────────────────────────────────────────────
const CasesTable = ({ title, cases }) => (
  <div className="table-section">
    <h3>{title} <span style={{ color: "#888", fontWeight: 400 }}>({cases.length})</span></h3>
    <table className="cases-table">
      <thead>
        <tr>
          <th>Case ID</th>
          <th>Title</th>
          <th>Petitioner</th>
          <th>Defendant</th>
          <th>Category</th>
          <th>Status</th>
          <th>Filed On</th>
        </tr>
      </thead>
      <tbody>
        {cases.length === 0 ? (
          <tr>
            <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#888" }}>
              No cases found
            </td>
          </tr>
        ) : (
          cases.map((c) => (
            <tr key={c._id}>
              <td><code>{c.caseId}</code></td>
              <td>{c.caseTitle || "-"}</td>
              <td>{c.petitionerDetails?.fullName || "-"}</td>
              <td>{c.defendantDetails?.fullName || "-"}</td>
              <td>{c.caseType || "-"}</td>
              <td>
                <span className={`status ${statusClass(c.status)}`}>
                  {c.status || "Pending"}
                </span>
              </td>
              <td>
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })
                  : "-"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ─── Main page content ────────────────────────────────────────────────────────
const UserMyCasesContent = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearUser } = useUser();

  const [search, setSearch] = useState("");
  const [raisedCases, setRaisedCases] = useState([]);
  const [opponentCases, setOpponentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ fullName: "", avatar: "" });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ─── Fetch user info + cases ────────────────────────────────────────────────
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ User info
      const userRes = await api.get("/cases/me");
      // getMe returns both `name` and `fullName` as aliases
      setUser({
        fullName: userRes.data.name || userRes.data.fullName || "User",
        avatar: userRes.data.avatar || "https://i.pravatar.cc/40",
      });

      // 2️⃣ Cases
      const casesRes = await api.get("/cases/my-cases");

      // ── Debug: log raw response so you can inspect it in DevTools ──
      console.log("✅ /cases/my-cases response:", casesRes.data);

      const raised   = casesRes.data?.raisedCases   ?? [];
      const opponent = casesRes.data?.opponentCases  ?? [];

      if (!Array.isArray(raised) || !Array.isArray(opponent)) {
        throw new Error("Unexpected response shape from /cases/my-cases");
      }

      setRaisedCases(raised);
      setOpponentCases(opponent);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load cases. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]); 

  // ─── Search filter ──────────────────────────────────────────────────────────
  const filterCases = (list) =>
    list.filter(
      (c) =>
        (c.caseId?.toLowerCase().includes(search.toLowerCase())) ||
        (c.caseTitle?.toLowerCase().includes(search.toLowerCase())) ||
        (c.petitionerDetails?.fullName?.toLowerCase().includes(search.toLowerCase())) ||
        (c.defendantDetails?.fullName?.toLowerCase().includes(search.toLowerCase()))
    );

  const filteredRaised   = filterCases(raisedCases);
  const filteredOpponent = filterCases(opponentCases);

  // ─── Logout ───
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    setIsLoggingOut(true);
    try {
      logoutUser();
      clearUser();
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ─── Render guards ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 12 }}>
        <div className="spinner" />
        <p style={{ color: "#555" }}>Loading your cases…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
        <p style={{ color: "#e53e3e", fontSize: 16 }}>⚠️ {error}</p>
        <button
          onClick={fetchData}
          style={{ padding: "10px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Full render ─────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </div>
        </div>

        <nav className="menu">
          {[
            { icon: HomeIcon,    label: "Home",         path: "/user/dashboard" },
            { icon: Vector,      label: "My Profile",   path: "/user/my-profile" },
            { icon: FileIcon,    label: "File New Case", path: "/user/file-new-case/step1" },
            { icon: CaseIcon,    label: "My Cases",     path: "/user/my-cases",    active: true },
            { icon: MeetingIcon, label: "Case Meetings", path: "/user/case-meetings" },
            { icon: DocsIcon,    label: "Documents",    path: "/user/documents" },
            { icon: ChatIcon,    label: "Chats",        path: "/user/chats" },
            { icon: PaymentIcon, label: "Payment",      path: "/user/payment" },
            { icon: SupportIcon, label: "Support",      path: "/user/support" },
          ].map(({ icon, label, path, active }) => (
            <div key={label} className={`menu-item ${active ? "active" : ""}`} onClick={() => navigate(path)}>
              <img src={icon} alt={label} />
              {!sidebarCollapsed && <span>{label}</span>}
            </div>
          ))}
        </nav>

        <div className="logout">
          <div
            className="menu-item"
            onClick={handleLogout}
            style={{ cursor: isLoggingOut ? "not-allowed" : "pointer", opacity: isLoggingOut ? 0.6 : 1 }}
          >
            <img src={LogoutIcon} alt="Logout" />
            {!sidebarCollapsed && <span>{isLoggingOut ? "Logging out…" : "Log out"}</span>}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <section className={`main-section ${sidebarCollapsed ? "expanded" : ""}`}>
        {/* Navbar */}
        <header className="navbar">
          <div />
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src={user.avatar} alt="profile" />
              <span>{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Search + refresh */}
        <div className="search-bar" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by case ID, title, petitioner or defendant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="reset-btn" onClick={() => setSearch("")}>
            Reset
          </button>
          <button
            className="reset-btn"
            onClick={fetchData}
            title="Refresh cases"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>

        {/* Summary strip */}
        <div style={{ padding: "8px 0 4px", display: "flex", gap: 24, fontSize: 13, color: "#666" }}>
          <span>📁 Raised by you: <strong>{raisedCases.length}</strong></span>
          <span>⚖️ You as defendant: <strong>{opponentCases.length}</strong></span>
          {search && (
            <span style={{ color: "#4f46e5" }}>
              🔍 Showing {filteredRaised.length + filteredOpponent.length} matches
            </span>
          )}
        </div>

        {/* Tables */}
        <CasesTable title="My Raised Cases" cases={filteredRaised} />
        <CasesTable title="Opponent Parties Raised Cases" cases={filteredOpponent} />
      </section>
    </div>
  );
};

// ─── Export wrapped with UserProvider ────────────────────────────────────────
const UserMyCases = () => (
  <UserProvider>
    <UserMyCasesContent />
  </UserProvider>
);

export default UserMyCases;
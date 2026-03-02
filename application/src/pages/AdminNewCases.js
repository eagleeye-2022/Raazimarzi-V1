import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaBell, FaSyncAlt } from "react-icons/fa";
import api from "../api/axios";
import HomeIcon from "../assets/icons/home.png";
import CaseIcon from "../assets/icons/newcase.png";
import MeetingIcon from "../assets/icons/meeting.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";
import "./AdminNewCases.css";

const AdminNewCases = () => {
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminUser, setAdminUser] = useState({ name: "Admin", avatar: "https://i.pravatar.cc/40" });

  // ─── Fetch all cases from backend ───────────────────────────────────────────
  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ GET /api/cases/all → getAllCases in caseController
      const response = await api.get("/cases/all");
      
      console.log("✅ Admin fetched cases:", response.data);
      
      if (response.data.success) {
        setAllCases(response.data.cases || []);
      } else {
        setAllCases(response.data.cases || response.data || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch cases:", err);
      setError(err.response?.data?.message || "Failed to load cases");
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Unauthorized. Please login as admin.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Optional: verify admin role (if you store it in localStorage)
    if (role && role !== "admin") {
      alert("Access denied. Admin only.");
      navigate("/login");
      return;
    }
    
    fetchCases();
  }, [navigate]);

  // ─── Filter cases by search ──────────────────────────────────────────────────
  const filteredCases = allCases.filter((c) =>
    (c.caseId?.toLowerCase().includes(search.toLowerCase())) ||
    (c.caseTitle?.toLowerCase().includes(search.toLowerCase())) ||
    (c.petitionerDetails?.fullName?.toLowerCase().includes(search.toLowerCase())) ||
    (c.defendantDetails?.fullName?.toLowerCase().includes(search.toLowerCase()))
  );

  // ─── Status badge helper ─────────────────────────────────────────────────────
  const statusClass = (status = "") => status.toLowerCase().replace(/\s+/g, "-");

  // ─── Loading/Error states ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 12 }}>
        <div className="spinner" />
        <p style={{ color: "#555" }}>Loading cases…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
        <p style={{ color: "#e53e3e", fontSize: 16 }}>⚠️ {error}</p>
        <button
          onClick={fetchCases}
          style={{ padding: "10px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
          <div className="menu-item" onClick={() => navigate("/admin/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </div>
          <div className="menu-item active" onClick={() => navigate("/admin/new-cases")}>
            <img src={CaseIcon} alt="New Cases" />
            <span>New Cases</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" />
            <span>Case Meetings</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/chats")}>
            <img src={ChatIcon} alt="Chats" />
            <span>Chats</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/payments")}>
            <img src={PaymentIcon} alt="Payment" />
            <span>Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/admin/support")}>
            <img src={SupportIcon} alt="Support" />
            <span>Support</span>
          </div>
        </nav>

        <div className="logout">
          <div className="menu-item" onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}>
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
              <img src={adminUser.avatar} alt="profile" className="profile-img" />
              <span>{adminUser.name}</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
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
            onClick={fetchCases}
            title="Refresh cases"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>

        {/* Summary */}
        <div style={{ padding: "8px 0 4px", fontSize: 13, color: "#666" }}>
          📁 Total cases: <strong>{allCases.length}</strong>
          {search && (
            <span style={{ marginLeft: 24, color: "#4f46e5" }}>
              🔍 Showing {filteredCases.length} matches
            </span>
          )}
        </div>

        {/* Table Section */}
        <div className="table-section">
          <div className="section-header">
            <h3>All Cases</h3>
          </div>

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
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#888" }}>
                    {search ? "No matching cases found" : "No cases filed yet"}
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
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
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminNewCases;
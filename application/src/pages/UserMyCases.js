"use client";

import React, { useState, useEffect } from "react";
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

import "./UserMyCases.css";
import { FaCog, FaBell } from "react-icons/fa";

const UserMyCases = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [raisedCases, setRaisedCases] = useState([]);
  const [opponentCases, setOpponentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ fullName: "", avatar: "" });

  // 🔹 Check login and fetch user info
  useEffect(() => {
    const fetchUserAndCases = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        // Fetch user info
        const userRes = await api.get("/api/user/me");
        setUser({
          fullName: userRes.data.fullName,
          avatar: userRes.data.avatar || "https://i.pravatar.cc/40",
        });

        // Fetch user cases
        const res = await api.get("/api/cases/my-cases");
        setRaisedCases(res.data.raisedCases || []);
        setOpponentCases(res.data.opponentCases || []);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
        // If unauthorized, redirect to login
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCases();
  }, [navigate]);

  const filteredRaisedCases = raisedCases.filter((c) =>
    c.caseId?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOpponentCases = opponentCases.filter((c) =>
    c.caseId?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <p style={{ padding: 20 }}>Loading cases...</p>;

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
          <div className="menu-item active" onClick={() => navigate("/user/my-cases")}>
            <img src={CaseIcon} alt="My Cases" />
            <span>My Cases</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/case-meetings")}>
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
          <div className="menu-item" onClick={() => navigate("/user/payment")}>
            <img src={PaymentIcon} alt="Payment" />
            <span>Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate("/user/support")}>
            <img src={SupportIcon} alt="Support" />
            <span>Support</span>
          </div>
        </nav>

        <div className="logout" onClick={handleLogout}>
          <div className="menu-item">
            <img src={LogoutIcon} alt="Logout" />
            <span>Log out</span>
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <section className="main-section">
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src={user.avatar} alt="profile" />
              <span>{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by case ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="reset-btn" onClick={() => setSearch("")}>
            Reset
          </button>
        </div>

        {/* My Raised Cases */}
        <div className="table-section">
          <h3>My Raised Cases</h3>
          <table className="cases-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Petitioner</th>
                <th>Defendant</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRaisedCases.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No cases found
                  </td>
                </tr>
              ) : (
                filteredRaisedCases.map((c) => (
                  <tr key={c._id}>
                    <td>{c.caseId}</td>
                    <td>{c.caseTitle}</td>
                    <td>{c.petitionerDetails?.fullName || "-"}</td>
                    <td>{c.defendantDetails?.fullName || "-"}</td>
                    <td>{c.caseType}</td>
                    <td className={`status ${c.status.toLowerCase()}`}>{c.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Opponent Cases */}
        <div className="table-section">
          <h3>Opponent Parties Raised Cases</h3>
          <table className="cases-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Petitioner</th>
                <th>Defendant</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpponentCases.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No cases found
                  </td>
                </tr>
              ) : (
                filteredOpponentCases.map((c) => (
                  <tr key={c._id}>
                    <td>{c.caseId}</td>
                    <td>{c.caseTitle}</td>
                    <td>{c.petitionerDetails?.fullName || "-"}</td>
                    <td>{c.defendantDetails?.fullName || "-"}</td>
                    <td>{c.caseType}</td>
                    <td className={`status ${c.status.toLowerCase()}`}>{c.status}</td>
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

export default UserMyCases;

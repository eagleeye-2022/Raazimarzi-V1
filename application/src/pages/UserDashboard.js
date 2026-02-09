// src/pages/UserDashboard.js
import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

import ActiveIcon from "../assets/icons/active.png";
import CurrentIcon from "../assets/icons/current.png";
import TotalIcon from "../assets/icons/total.png";
import Vector from "../assets/icons/Vector.png";
import HomeIcon from "../assets/icons/home.png";
import FileIcon from "../assets/icons/file.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

import { FaCog, FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PieChart, Pie, Cell } from "recharts";

import "./UserDashboard.css";

// Create UserContext locally in this file
const UserContext = createContext();

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const clearUser = () => {
    setUser(null);
    // Clear any user data from localStorage if needed
    localStorage.removeItem('userData');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, clearUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearUser } = useUser();
  const [showAllCases, setShowAllCases] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pieData = [
    { name: "Completed", value: 66 },
    { name: "Remaining", value: 34 },
  ];
  const COLORS = ["#7C3AED", "#E5E7EB"];

  const cases = [
    {
      id: "#3201",
      title: "Property Dispute",
      party1: "Mohan Das",
      party2: "Ravi Gupta",
      category: "Property Dispute",
      mediator: "Ajay Sharma",
      status: "Active",
    },
    {
      id: "#3202",
      title: "Property Dispute",
      party1: "Mohan Das",
      party2: "Ravi Gupta",
      category: "Property Dispute",
      mediator: "Ajay Sharma",
      status: "Active",
    },
    {
      id: "#3203",
      title: "Property Dispute",
      party1: "Mohan Das",
      party2: "Ravi Gupta",
      category: "Property Dispute",
      mediator: "Ajay Sharma",
      status: "Active",
    },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async () => {
    // Confirm logout
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);

    try {
      // Call logout from AuthContext (this calls logoutService and clears auth state)
      logoutUser();
      
      // Clear user profile data from UserContext
      clearUser();

      // Show success message
      alert("✅ Logged out successfully!");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </div>
        </div>

        <nav className="menu">
          <div className="menu-item active" onClick={() => navigate("/user/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            {!sidebarCollapsed && <span>Home</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/my-profile")}>
            <img src={Vector} alt="Profile" />
            {!sidebarCollapsed && <span>My Profile</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/file-new-case/step1")}>
            <img src={FileIcon} alt="File New Case" />
            {!sidebarCollapsed && <span>File New Case</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/my-cases")}>
            <img src={CaseIcon} alt="My Cases" />
            {!sidebarCollapsed && <span>My Cases</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" />
            {!sidebarCollapsed && <span>Case Meetings</span>}
          </div>

          <div className="menu-item">
            <img src={DocsIcon} alt="Documents" />
            {!sidebarCollapsed && <span>Documents</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/chats")}>
            <img src={ChatIcon} alt="Chats" />
            {!sidebarCollapsed && <span>Chats</span>}
          </div>

          <div className="menu-item">
            <img src={PaymentIcon} alt="Payment" />
            {!sidebarCollapsed && <span>Payment</span>}
          </div>

          <div className="menu-item">
            <img src={SupportIcon} alt="Support" />
            {!sidebarCollapsed && <span>Support</span>}
          </div>
        </nav>

        <div className="logout">
          <div 
            className="menu-item" 
            onClick={handleLogout}
            style={{ 
              cursor: isLoggingOut ? "not-allowed" : "pointer", 
              opacity: isLoggingOut ? 0.6 : 1 
            }}
          >
            <img src={LogoutIcon} alt="Logout" />
            {!sidebarCollapsed && <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
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

        {/* Stats */}
        <section className="stats">
          <div className="stat-card green">
            <div className="stat-left">
              <p className="stat-label">Active Case</p>
              <h2 className="stat-value">04</h2>
            </div>
            <div className="stat-right">
              <img src={ActiveIcon} alt="Active Case" className="stat-icon" />
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-left">
              <p className="stat-label">Current Cases</p>
              <h2 className="stat-value">02</h2>
            </div>
            <div className="stat-right">
              <img src={CurrentIcon} alt="Current Cases" className="stat-icon" />
            </div>
          </div>

          <div className="stat-card yellow">
            <div className="stat-left">
              <p className="stat-label">Total Case</p>
              <h2 className="stat-value">06</h2>
            </div>
            <div className="stat-right">
              <img src={TotalIcon} alt="Total Case" className="stat-icon" />
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-left">
              <p className="stat-label">Progress : #1234</p>
              <h2 className="stat-value">+66%</h2>
            </div>
            <div className="stat-right">
              <img src={ActiveIcon} alt="Progress" className="stat-icon" />
            </div>
          </div>
        </section>

        {/* New Cases */}
        <section className="cases-section">
          <div className="section-header">
            <h3>New Cases (Oct 2025)</h3>
            <button onClick={() => setShowAllCases(!showAllCases)}>
              {showAllCases ? "Hide" : "View all"}
            </button>
          </div>
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
              {cases.map((c, index) => (
                <tr key={index}>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.party1}</td>
                  <td>{c.party2}</td>
                  <td>{c.category}</td>
                  <td className="mediator-cell">
                    <img src="https://i.pravatar.cc/30?img=2" alt="mediator" className="mediator-img" />
                    {c.mediator}
                  </td>
                  <td>
                    <span className="status-badge">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="user-meetings-section">
          {/* Left side - Upcoming Meetings */}
          <div className="user-upcoming-meetings">
            <div className="user-section-header">
              <h3>Upcoming Meetings (September 2025)</h3>
            </div>

            <div className="user-meeting-cards">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="user-meeting-card">
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

          {/* Right side - Reminder */}
          <div className="right-section">
            <div className="view-all-wrapper">
              <button className="view-all">View all</button>
            </div>

            <div className="today-reminder">
              <div className="reminder-header">
                <h4>Today</h4>
                <span className="reminder-date">Sep 02, 2025</span>
              </div>

              <p className="reminder-time">02:00pm - 03:00pm</p>

              {/* Horizontal details */}
              <div className="reminder-details">
                <p><span className="label">Case ID:</span> 12345</p>
                <p><span className="label">Title:</span> Property Dispute</p>
                <p><span className="label">Opponent:</span> Rakesh Singh</p>
              </div>

              <button className="join-btn">Join now</button>
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
                <li>Legal Property Paper</li>
                <li>Legal Property Paper</li>
                <li>Legal Property Paper</li>
              </ul>
            </div>
          </div>

          <div className="payments">
            <h3>Payments</h3>
          </div>
        </section>
      </main>
    </div>
  );
};

// Wrap Dashboard with UserProvider before exporting
const UserDashboard = () => {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
};

export default UserDashboard;
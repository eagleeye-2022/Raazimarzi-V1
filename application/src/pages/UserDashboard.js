// src/pages/UserDashboard.js
import React, { useState } from "react";
import { useNavigate, } from "react-router-dom";
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

import { FaCog, FaBell } from "react-icons/fa";
import { PieChart, Pie, Cell } from "recharts";

import "./UserDashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAllCases, setShowAllCases] = useState(false);

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>

        <nav className="menu">
          <div className="menu-item active" onClick={() => navigate("/user/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            <span>Home</span>
          </div>

          <nav className="menu">
            <div className="menu-item" onClick={() => navigate("/user/my-profile")}>
              <img src={Vector} alt="Profile" />
              <span>My Profile</span>
            </div>
            
          </nav>

          <div className="menu-item" onClick={() => navigate("/user/file-new-case/step1")}>
            <img src={FileIcon} alt="File New Case" />
            <span>File New Case</span>
          </div>

           <div className="menu-item" onClick={() => navigate("/user/my-cases")}>
            <img src={CaseIcon} alt="My Cases" />
            <span>My Cases</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/user/case-meetings")}>
            <img src={MeetingIcon} alt="Case Meetings" />
            <span>Case Meetings</span>
          </div>

          <div className="menu-item">
            <img src={DocsIcon} alt="Documents" />
            <span>Documents</span>
          </div>

          <div className="menu-item">
            <img src={ChatIcon} alt="Chats" />
            <span>Chats</span>
          </div>

          <div className="menu-item">
            <img src={PaymentIcon} alt="Payment" />
            <span>Payment</span>
          </div>

          <div className="menu-item">
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

      {/* Main Content */}
      <main className="main-content">
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

export default Dashboard;


// // src/pages/UserDashboard.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ActiveIcon from "../assets/icons/active.png";
// import CurrentIcon from "../assets/icons/current.png";
// import TotalIcon from "../assets/icons/total.png";
// import Vector from "../assets/icons/Vector.png";
// import HomeIcon from "../assets/icons/home.png";
// import FileIcon from "../assets/icons/file.png";
// import MeetingIcon from "../assets/icons/meeting.png";
// import CaseIcon from "../assets/icons/newcase.png";
// import DocsIcon from "../assets/icons/document.png";
// import ChatIcon from "../assets/icons/chat.png";
// import PaymentIcon from "../assets/icons/payment.png";
// import SupportIcon from "../assets/icons/support.png";
// import LogoutIcon from "../assets/icons/logout.png";
// import { FaCog, FaBell } from "react-icons/fa";
// import { PieChart, Pie, Cell } from "recharts";
// import "./UserDashboard.css";
// import api from "../api/axios"; 

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // state variables
//   const [cases, setCases] = useState([]);
//   const [meetings, setMeetings] = useState([]);
//   const [stats, setStats] = useState({ active: 0, current: 0, total: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAllCases, setShowAllCases] = useState(false);

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
//   const pieData = [
//     { name: "Uploaded", value: 70 },
//     { name: "Pending", value: 30 },
//   ];

//   // fetch dashboard data
//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         setLoading(true);
//         const { data } = await api.get("/dashboard/user");
//         // expected data: { stats, cases, meetings }
//         setStats(data.stats || { active: 0, current: 0, total: 0 });
//         setCases(data.cases || []);
//         setMeetings(data.meetings || []);
//       } catch (err) {
//         console.error(err);
//         setError(err?.response?.data?.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboard();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h2 className="sidebar-title">Dashboard</h2>

//         <nav className="menu">
//           <div
//             className="menu-item active"
//             onClick={() => navigate("/user/dashboard")}
//           >
//             <img src={HomeIcon} alt="Home" />
//             <span>Home</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/user/my-profile")}>
//             <img src={Vector} alt="Profile" />
//             <span>My Profile</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/user/file-new-case/step1")}>
//             <img src={FileIcon} alt="File New Case" />
//             <span>File New Case</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/user/my-cases")}>
//             <img src={CaseIcon} alt="My Cases" />
//             <span>My Cases</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/user/case-meetings")}>
//             <img src={MeetingIcon} alt="Case Meetings" />
//             <span>Case Meetings</span>
//           </div>

//           <div className="menu-item">
//             <img src={DocsIcon} alt="Documents" />
//             <span>Documents</span>
//           </div>

//           <div className="menu-item">
//             <img src={ChatIcon} alt="Chats" />
//             <span>Chats</span>
//           </div>

//           <div className="menu-item">
//             <img src={PaymentIcon} alt="Payment" />
//             <span>Payment</span>
//           </div>

//           <div className="menu-item">
//             <img src={SupportIcon} alt="Support" />
//             <span>Support</span>
//           </div>
//         </nav>

//         <div className="logout">
//           <div className="menu-item">
//             <img src={LogoutIcon} alt="Logout" />
//             <span>Log out</span>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Navbar */}
//         <header className="navbar">
//           <div></div>
//           <div className="nav-icons">
//             <FaCog className="icon" />
//             <FaBell className="icon" />
//             <div className="profile">
//               <img
//                 src="https://i.pravatar.cc/40"
//                 alt="profile"
//                 className="profile-img"
//               />
//               <span>Rohan Singhania</span>
//             </div>
//           </div>
//         </header>

//         {/* Stats */}
//         <section className="stats">
//           <div className="stat-card green">
//             <div className="stat-left">
//               <p className="stat-label">Active Case</p>
//               <h2 className="stat-value">{stats.active}</h2>
//             </div>
//             <div className="stat-right">
//               <img src={ActiveIcon} alt="Active Case" className="stat-icon" />
//             </div>
//           </div>

//           <div className="stat-card blue">
//             <div className="stat-left">
//               <p className="stat-label">Current Cases</p>
//               <h2 className="stat-value">{stats.current}</h2>
//             </div>
//             <div className="stat-right">
//               <img src={CurrentIcon} alt="Current Cases" className="stat-icon" />
//             </div>
//           </div>

//           <div className="stat-card yellow">
//             <div className="stat-left">
//               <p className="stat-label">Total Case</p>
//               <h2 className="stat-value">{stats.total}</h2>
//             </div>
//             <div className="stat-right">
//               <img src={TotalIcon} alt="Total Case" className="stat-icon" />
//             </div>
//           </div>

//           <div className="stat-card purple">
//             <div className="stat-left">
//               <p className="stat-label">Progress : #1234</p>
//               <h2 className="stat-value">+66%</h2>
//             </div>
//             <div className="stat-right">
//               <img src={ActiveIcon} alt="Progress" className="stat-icon" />
//             </div>
//           </div>
//         </section>

//         {/* New Cases */}
//         <section className="cases-section">
//           <div className="section-header">
//             <h3>New Cases (Oct 2025)</h3>
//             <button onClick={() => setShowAllCases(!showAllCases)}>
//               {showAllCases ? "Hide" : "View all"}
//             </button>
//           </div>
//           <table className="cases-table">
//             <thead>
//               <tr>
//                 <th>Case ID</th>
//                 <th>Title</th>
//                 <th>Party 1</th>
//                 <th>Party 2</th>
//                 <th>Category</th>
//                 <th>Mediator</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cases.map((c, index) => (
//                 <tr key={index}>
//                   <td>{c.id}</td>
//                   <td>{c.title}</td>
//                   <td>{c.party1}</td>
//                   <td>{c.party2}</td>
//                   <td>{c.category}</td>
//                   <td className="mediator-cell">
//                     <img
//                       src="https://i.pravatar.cc/30?img=2"
//                       alt="mediator"
//                       className="mediator-img"
//                     />
//                     {c.mediator}
//                   </td>
//                   <td>
//                     <span className="status-badge">{c.status}</span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* Meetings & Reminder */}
//         <section className="user-meetings-section">
//           {/* Left side - Upcoming Meetings */}
//           <div className="user-upcoming-meetings">
//             <div className="user-section-header">
//               <h3>Upcoming Meetings (September 2025)</h3>
//             </div>

//             <div className="user-meeting-cards">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="user-meeting-card">
//                   <div className="meeting-icon">
//                     <img src={Vector} alt="Meeting logo" />
//                   </div>
//                   <div className="meeting-info">
//                     <p className="date">Sep 10, 2025</p>
//                     <p className="time">10:00 - 12:00pm</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right side - Reminder */}
//           <div className="right-section">
//             <div className="view-all-wrapper">
//               <button className="view-all">View all</button>
//             </div>

//             <div className="today-reminder">
//               <div className="reminder-header">
//                 <h4>Today</h4>
//                 <span className="reminder-date">Sep 02, 2025</span>
//               </div>

//               <p className="reminder-time">02:00pm - 03:00pm</p>

//               <div className="reminder-details">
//                 <p><span className="label">Case ID:</span> 12345</p>
//                 <p><span className="label">Title:</span> Property Dispute</p>
//                 <p><span className="label">Opponent:</span> Rakesh Singh</p>
//               </div>

//               <button className="join-btn">Join now</button>
//             </div>
//           </div>
//         </section>

//         {/* Documents & Payments */}
//         <section className="documents-payments">
//           <div className="documents">
//             <h3>Documents</h3>
//             <div className="doc-content">
//               <PieChart width={120} height={120}>
//                 <Pie
//                   data={pieData}
//                   cx={60}
//                   cy={60}
//                   innerRadius={35}
//                   outerRadius={55}
//                   dataKey="value"
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell
//                       key={index}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//               </PieChart>
//               <ul>
//                 <li>Legal Property Paper</li>
//                 <li>Agreement Document</li>
//                 <li>Contract File</li>
//               </ul>
//             </div>
//           </div>

//           <div className="payments">
//             <h3>Payments</h3>
//             <p>No pending payments</p>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


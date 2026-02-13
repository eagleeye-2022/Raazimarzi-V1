// import React from "react";
// import "./CaseManagerDashboard.css";
// import { useNavigate } from "react-router-dom";
// import ActiveIcon from "../assets/icons/active.png";
// import CurrentIcon from "../assets/icons/current.png";
// import TotalIcon from "../assets/icons/total.png";
// import HomeIcon from "../assets/icons/home.png";
// import CaseIcon from "../assets/icons/newcase.png";
// import MeetingIcon from "../assets/icons/meeting.png";
// import DocumentIcon from "../assets/icons/document.png";
// import ChatIcon from "../assets/icons/chat.png";
// import PaymentIcon from "../assets/icons/payment.png";
// import SupportIcon from "../assets/icons/support.png";
// import LogoutIcon from "../assets/icons/logout.png";
// import Icon1 from "../assets/icons/1.png";
// import Icon2 from "../assets/icons/2.png";
// import Icon3 from "../assets/icons/3.png";
// import { FaCog, FaBell } from "react-icons/fa";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h2 className="sidebar-title">Dashboard</h2>

//         <nav className="menu">
//           <div className="menu-item active"  onClick={() => navigate("/cm/dashboard")}>
//             <img src={HomeIcon} alt="Home" />
//             <span>Home</span>
//           </div>
//           <div className="menu-item " onClick={() => navigate("/cm/new-cases")}>
//             <img src={CaseIcon} alt="New Cases" />
//             <span>New Cases</span>
//           </div>
//           <div className="menu-item"  onClick={() => navigate("/cm/case-meetings")}>
//             <img src={MeetingIcon} alt="Case Meetings" />
//             <span>Case Meetings</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/cm/client-docs")}>
//             <img src={DocumentIcon} alt="Documents" />
//             <span>Clients Documents</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/cm/chats")}>
//             <img src={ChatIcon} alt="Chats" />
//             <span>Chats</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/cm/payment")}>
//             <img src={PaymentIcon} alt="Payment" />
//             <span>Payment</span>
//           </div>

//           <div className="menu-item" onClick={() => navigate("/cm/support")}>
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
//               <h2 className="stat-value">04</h2>
//             </div>
//             <div className="stat-right">
//               <img src={ActiveIcon} alt="Active Case" className="stat-icon" />
//             </div>
//           </div>

//           <div className="stat-card blue">
//             <div className="stat-left">
//               <p className="stat-label">Current Cases</p>
//               <h2 className="stat-value">02</h2>
//             </div>
//             <div className="stat-right">
//               <img src={CurrentIcon} alt="Current Cases" className="stat-icon" />
//             </div>
//           </div>

//           <div className="stat-card yellow">
//             <div className="stat-left">
//               <p className="stat-label">Total Case</p>
//               <h2 className="stat-value">06</h2>
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
//         <section className="cm-new-cases">
//           <div className="cm-section-header">
//             <h3>Assigned New Cases (Oct 2025)</h3>
//             <button>View all</button>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Case ID</th>
//                 <th>Title</th>
//                 <th>Party 1</th>
//                 <th>Party 2</th>
//                 <th>Category</th>
//                 <th>Assigned to</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>#3201</td>
//                 <td>Property Dispute</td>
//                 <td>Mohan Das</td>
//                 <td>Ravi Gupta</td>
//                 <td>Property Dispute</td>
//                 <td className="cm-assigned">
//                   <img src="https://i.pravatar.cc/30" alt="avatar" /> Ajay Sharma
//                 </td>
//                 <td className="cm-status active">Active</td>
//               </tr>
//               <tr>
//                 <td>#3202</td>
//                 <td>Contract Dispute</td>
//                 <td>Sunil Rao</td>
//                 <td>Ajit Mehta</td>
//                 <td>Business</td>
//                 <td className="cm-assigned">
//                   <img src="https://i.pravatar.cc/31" alt="avatar" /> Priya Verma
//                 </td>
//                 <td className="cm-status active">Active</td>
//               </tr>
//             </tbody>
//           </table>
//         </section>
// {/* Middle Section */}
//         <section className="admin-middle">
//           {/* Meeting Scheduled */}
//           <div className="admin-meeting-section">
//             <h3 className="admin-meeting-title">Meeting Scheduled</h3>

//             <div className="admin-meeting-container">
//               <div className="admin-meeting-header">
//                 <div>
//                   <p className="admin-meeting-day">Today</p>
//                   <p className="admin-meeting-time">02:00pm - 03:00pm</p>
//                 </div>
//                 <span className="admin-meeting-date">Sep 02, 2025</span>
//               </div>

//               <div className="admin-meeting-list">
//                 <div className="admin-meeting-row">
//                   <p><strong>Case Id:</strong> #3201</p>
//                   <p><strong>Title:</strong> Property Dispute</p>
//                   <p><strong>Meeting:</strong> Manager</p>
//                 </div>
//                 <div className="admin-meeting-row">
//                   <p><strong>Case Id:</strong> #3202</p>
//                   <p><strong>Title:</strong> Property Dispute</p>
//                   <p><strong>Meeting:</strong> Manager</p>
//                 </div>
//               </div>

//               <div className="admin-meeting-footer">
//                 <button className="admin-join-btn">Join now</button>
//               </div>
//             </div>
//           </div>
          
//           {/* Right - Clients Documents */}
//           <div className="clients-documents">
//             <h3 className="clients-title">Clients Documents</h3>

//             <div className="clients-header">
//               <input
//                 type="text"
//                 placeholder="🔍 Search by case id..."
//                 className="search-input"
//               />
//               <select className="party-select">
//                 <option>Party 1</option>
//                 <option>Party 2</option>
//               </select>
//               <span className="case-id-label">Case Id: #3201</span>
//             </div>

//             <div className="client-profile">
//               <img
//                 src="https://i.pravatar.cc/80?img=68"
//                 alt="Client"
//                 className="client-img"
//               />
//               <div className="client-info">
//                 <h4>Rabindra Nath</h4>
//                 <p className="client-date">Sep 22, 2025</p>
//                 <p className="client-case">Property Dispute</p>
//               </div>
//             </div>

//             <div className="documents-list">
//               <div className="doc-row">
//                 <input type="checkbox" checked readOnly />
//                 <span>Property Papers</span>
//                 <span>Property Papers</span>
//               </div>
//               <div className="doc-row">
//                 <input type="checkbox" checked readOnly />
//                 <span>Property Papers</span>
//                 <span>Property Papers</span>
//               </div>
//               <div className="doc-row">
//                 <input type="checkbox" checked readOnly />
//                 <span>Property Papers</span>
//                 <span>Property Papers</span>
//               </div>
//               <div className="doc-row">
//                 <input type="checkbox" checked readOnly />
//                 <span>Property Papers</span>
//                 <span>Property Papers</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Coming Soon Section */}
//         <section className="coming-soon">
//           <div className="coming-card">
//             <img src={Icon1} alt="Coming Soon" />
//             <p>Coming Soon...!</p>
//           </div>
//           <div className="coming-card">
//             <img src={Icon2} alt="Coming Soon" />
//             <p>Coming Soon...!</p>
//           </div>
//           <div className="coming-card">
//             <img src={Icon3} alt="Coming Soon" />
//             <p>Coming Soon...!</p>
//           </div>
//           <div className="coming-card">
//             <img
//               src={Icon2}
//               alt="Coming Soon"
//             />
//             <p>Coming Soon...!</p>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

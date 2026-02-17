// import React from "react";
// import "./MediatorDashboard.css";
// import { useNavigate } from "react-router-dom";
// import ActiveIcon from "../assets/icons/active.png";
// import CurrentIcon from "../assets/icons/current.png";
// import TotalIcon from "../assets/icons/total.png";
// import HomeIcon from "../assets/icons/home.png";
// import CaseIcon from "../assets/icons/newcase.png";
// import MeetingIcon from "../assets/icons/meeting.png";
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
//        <aside className="sidebar">
//               <h2 className="sidebar-title">Dashboard</h2>
//               <nav className="menu">
//                 <div className="menu-item active" onClick={() => navigate("/mediator/dashboard")}>
//                   <img src={HomeIcon} alt="Home" />
//                   <span>Home</span>
//                 </div>
//                 <div className="menu-item" onClick={() => navigate("/mediator/new-cases")}>
//                   <img src={CaseIcon} alt="My Cases" />
//                   <span>My Cases</span>
//                 </div>
//                 <div className="menu-item" onClick={() => navigate("/mediator/case-meetings")}>
//                   <img src={MeetingIcon} alt="Case Meetings" />
//                   <span>Case Meetings</span>
//                 </div>
                
//                 <div className="menu-item" onClick={() => navigate("/mediator/chats")}>
//                   <img src={ChatIcon} alt="Chats" />
//                   <span>Chats</span>
//                 </div>
//                 <div className="menu-item" onClick={() => navigate("/mediator/payment")}>
//                   <img src={PaymentIcon} alt="Payment" />
//                   <span>Payment</span>
//                 </div>
//                 <div className="menu-item" onClick={() => navigate("/mediator/support")}>
//                   <img src={SupportIcon} alt="Support" />
//                   <span>Support</span>
//                 </div>
//               </nav>
//               <div className="logout">
//                 <div className="menu-item">
//                   <img src={LogoutIcon} alt="Logout" />
//                   <span>Log out</span>
//                 </div>
//               </div>
//             </aside>

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

//         {/* Meeting Section */}
//         <section className="meeting-section">
//           <h3>Meeting Scheduled</h3>
//           <div className="meeting-card">
//             <div className="meeting-header">
//               <div>
//                 <p className="meeting-day">Today</p>
//                 <p className="meeting-time">02:00pm - 03:00pm</p>
//               </div>
//               <p className="meeting-date">Sep 02, 2025</p>
//             </div>

//             <div className="meeting-list">
//               <div className="meeting-item">
//                 <span>Case Id: #3201</span>
//                 <span>Title: Property Dispute</span>
//                 <span>Meeting: P1-P2</span>
//               </div>
//               <div className="meeting-item">
//                 <span>Case Id: #3201</span>
//                 <span>Title: Property Dispute</span>
//                 <span>Meeting: P1-P2</span>
//               </div>
//             </div>

//             <button className="join-btn">Join now</button>
//           </div>
//         </section>

//         {/* Assigned Cases */}
//         <section className="assigned-section">
//           <div className="assigned-header">
//             <h3>Assigned New Cases ( Oct 2025 )</h3>
//             <button className="view-all">View all</button>
//           </div>

//           <table className="assigned-table">
//             <thead>
//               <tr>
//                 <th>Case ID</th>
//                 <th>Title</th>
//                 <th>Party 1</th>
//                 <th>Party 2</th>
//                 <th>Category</th>
//                 <th>Assigned by</th>
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
//                 <td className="assigned-by">
//                   <img src="https://i.pravatar.cc/30" alt="avatar" /> Dev Sharma
//                 </td>
//                 <td>
//                   <span className="status active">Active</span>
//                 </td>
//               </tr>
//               <tr>
//                 <td>#3201</td>
//                 <td>Property Dispute</td>
//                 <td>Mohan Das</td>
//                 <td>Ravi Gupta</td>
//                 <td>Property Dispute</td>
//                 <td className="assigned-by">
//                   <img src="https://i.pravatar.cc/31" alt="avatar" /> Dev Sharma
//                 </td>
//                 <td>
//                   <span className="status active">Active</span>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
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

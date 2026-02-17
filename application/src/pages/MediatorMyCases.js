// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCog, FaBell } from "react-icons/fa";
// import HomeIcon from "../assets/icons/home.png";
// import CaseIcon from "../assets/icons/newcase.png";
// import MeetingIcon from "../assets/icons/meeting.png";
// import ChatIcon from "../assets/icons/chat.png";
// import PaymentIcon from "../assets/icons/payment.png";
// import SupportIcon from "../assets/icons/support.png";
// import LogoutIcon from "../assets/icons/logout.png";
// import "./MediatorMyCases.css";

// const MyCases = () => {
//   const [search, setSearch] = useState("");
// const navigate = useNavigate();
//   const newCases = [
//     { id: "#3201", title: "Property Dispute", party1: "Mohan Das", party2: "Ravi Gupta", category: "Property Dispute", mediator: "Ajay Sharma", status: "Pending" },
//     { id: "#3202", title: "Property Dispute", party1: "Mohan Das", party2: "Ravi Gupta", category: "Property Dispute", mediator: "Ajay Sharma", status: "Pending" },
//     { id: "#3203", title: "Property Dispute", party1: "Mohan Das", party2: "Ravi Gupta", category: "Property Dispute", mediator: "Ajay Sharma", status: "Pending" },
//     { id: "#3204", title: "Property Dispute", party1: "Mohan Das", party2: "Ravi Gupta", category: "Property Dispute", mediator: "Ajay Sharma", status: "Pending" },
//     { id: "#3205", title: "Property Dispute", party1: "Mohan Das", party2: "Ravi Gupta", category: "Property Dispute", mediator: "Ajay Sharma", status: "Pending" },
//     { id: "#3206", title: "Property Dispute", party1: "Mohan Das", party2: "Ravi Gupta", category: "Property Dispute", mediator: "Ajay Sharma", status: "Pending" },
//     { id: "#3207", title: "Property Dispute", party1: "Mohan Das", party2: "Ravi Gupta", category: "Property Dispute", mediator: "Ajay Sharma", status: "Pending" },
//   ];

//   const handleReset = () => setSearch("");
//   const filteredCases = newCases.filter(c => c.id.includes(search));

//   return (
//     <div className="mediator-dashboard-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h2 className="sidebar-title">Dashboard</h2>
//         <nav className="menu">
//           <div className="menu-item" onClick={() => navigate("/mediator/dashboard")}>
//             <img src={HomeIcon} alt="Home" />
//             <span>Home</span>
//           </div>
//           <div className="menu-item active" onClick={() => navigate("/mediator/my-cases")}>
//             <img src={CaseIcon} alt="My Cases" />
//             <span>My Cases</span>
//           </div>
//           <div className="menu-item " onClick={() => navigate("/mediator/case-meetings")}>
//             <img src={MeetingIcon} alt="Case Meetings" />
//             <span>Case Meetings</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/mediator/chats")}>
//             <img src={ChatIcon} alt="Chats" />
//             <span>Chats</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/mediator/payments")}>
//             <img src={PaymentIcon} alt="Payment" />
//             <span>Payment</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/mediator/support")}>
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

//       {/* Main Section */}
//       <section className="main-section">
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

//         {/* Search Bar */}
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search by case id..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button className="reset-btn" onClick={handleReset}>
//             Reset
//           </button>
//         </div>

//         {/* Table Section */}
//         <div className="table-section">
//           <div className="section-header">
//             <h3>New Cases ( Oct 2025 )</h3>
//             <button className="view-all">View all</button>
//           </div>

//           <table className="cases-table">
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
//               {filteredCases.map((c, i) => (
//                 <tr key={i}>
//                   <td>{c.id}</td>
//                   <td>{c.title}</td>
//                   <td>{c.party1}</td>
//                   <td>{c.party2}</td>
//                   <td>{c.category}</td>
//                   <td>
//                     <div className="mediator-cell">
//                       <img
//                         src="https://i.pravatar.cc/30"
//                         alt="mediator"
//                         className="mediator-img"
//                       />
//                       <span>{c.mediator}</span>
//                     </div>
//                   </td>
//                   <td className={`status ${c.status.toLowerCase()}`}>
//                     {c.status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default MyCases;

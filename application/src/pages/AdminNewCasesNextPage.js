// import React from "react";
// import "./AdminNewCasesNextPage.css";
// import { useNavigate } from "react-router-dom";
// import HomeIcon from "../assets/icons/home.png";
// import FileIcon from "../assets/icons/file.png";
// import MeetingIcon from "../assets/icons/meeting.png";
// import ChatIcon from "../assets/icons/chat.png";
// import PaymentIcon from "../assets/icons/payment.png";
// import SupportIcon from "../assets/icons/support.png";
// import LogoutIcon from "../assets/icons/logout.png";
// import { FaCog, FaBell } from "react-icons/fa";

// const AdminNewCasesNextPage = () => {
//   const navigate = useNavigate();
//   const parties = [
//     {
//       id: 1,
//       role: "Party 1",
//       name: "Mohan Das",
//       email: "mohandas@1234gmail.com",
//       phone: "+91 9200 3600 90",
//       avatar: "https://i.pravatar.cc/80?img=11",
//     },
//     {
//       id: 2,
//       role: "Party 2",
//       name: "Jay Prakash",
//       email: "jayprakash@1234gmail.com",
//       phone: "+91 9200 3600 90",
//       avatar: "https://i.pravatar.cc/80?img=12",
//     },
//   ];

//   return (
//     <div className="admin-page">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="sidebar-top">
//           <h2 className="brand">Dashboard</h2>
//         </div>

//         <nav className="sidebar-nav">
//           <button className="nav-item"  onClick={() => navigate("/admin/dashboard")}>
//             <img src={HomeIcon} alt="home" /> <span>Home</span>
//           </button>
//           <button className="nav-item active"  onClick={() => navigate("/admin/new-cases-next-page")}>
//             <img src={FileIcon} alt="new cases" /> <span>New Cases</span>
//           </button>
//           <button className="nav-item" onClick={() => navigate("/admin/case-meetings")}>
//             <img src={MeetingIcon} alt="meetings" /> <span>Case Meetings</span>
//           </button>
//           <button className="nav-item" onClick={() => navigate("/admin/chats")}>
//             <img src={ChatIcon} alt="chats" /> <span>Chats</span>
//           </button>
//           <button className="nav-item" onClick={() => navigate("/admin/payment")}>
//             <img src={PaymentIcon} alt="payment" /> <span>Payment</span>
//           </button>
//           <button className="nav-item" onClick={() => navigate("/admin/support")}>
//             <img src={SupportIcon} alt="support" /> <span>Support</span>
//           </button>
//         </nav>

//         <div className="sidebar-bottom">
//           <button className="nav-item logout">
//             <img src={LogoutIcon} alt="logout" /> <span>Log out</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Area */}
//       <main className="main-area">
//         {/* Topbar */}
//         <header className="topbar">
//           <div className="topbar-left">
//             <h3>New Case Details</h3>
//           </div>
//           <div className="topbar-right">
//             <FaCog className="top-icon" />
//             <FaBell className="top-icon" />
//             <div className="profile">
//               <img src="https://i.pravatar.cc/40" alt="profile" />
//               <span>Rohan Singhania</span>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <div className="content-wrap">
//           {/* Filters */}
//           <div className="filters-card">
//             <div className="search-row">
//               <input
//                 className="search-input"
//                 placeholder="Search by case ID..."
//               />
//               <button className="reset-link">Reset</button>
//             </div>

//             <div className="filters-row">
//               <div className="filter">
//                 <label>Assign to:</label>
//                 <select>
//                   <option>Avinash Rao</option>
//                 </select>
//               </div>
//               <div className="filter">
//                 <label>Case Category:</label>
//                 <select>
//                   <option>Property Dispute</option>
//                 </select>
//               </div>
//               <div className="filter">
//                 <label>Status:</label>
//                 <select>
//                   <option>Pending</option>
//                 </select>
//               </div>
//               <div className="filter">
//                 <label>Priority:</label>
//                 <select>
//                   <option>None</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Case Details Section */}
//           <section className="case-card">
//             <div className="scroll-container">
//               {/* Case Details */}
//               <div className="case-section">
//                 <div className="section-header">Case Details</div>
//                 <div className="case-info-grid">
//                   <div className="info-item">
//                     <div className="label">Case Title:</div>
//                     <div className="value">Land Occupation</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Type:</div>
//                     <div className="value">Property Dispute</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Cause of Action:</div>
//                     <div className="value">Money</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Relief Sought:</div>
//                     <div className="value">Divide</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Value:</div>
//                     <div className="value">₹5,50,000</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Petitioner Details */}
//               <div className="case-section">
//                 <div className="section-header">Petitioner Details</div>
//                 <div className="case-info-grid">
//                   <div className="info-item">
//                     <div className="label">Case Title:</div>
//                     <div className="value">Land Occupation</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Type:</div>
//                     <div className="value">Property Dispute</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Cause of Action:</div>
//                     <div className="value">Money</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Relief Sought:</div>
//                     <div className="value">Divide</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Value:</div>
//                     <div className="value">₹5,50,000</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Defendant Details */}
//               <div className="case-section">
//                 <div className="section-header">Defendant Details</div>
//                 <div className="case-info-grid">
//                   <div className="info-item">
//                     <div className="label">Case Title:</div>
//                     <div className="value">Land Occupation</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Type:</div>
//                     <div className="value">Property Dispute</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Cause of Action:</div>
//                     <div className="value">Money</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Relief Sought:</div>
//                     <div className="value">Divide</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Value:</div>
//                     <div className="value">₹5,50,000</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Case Facts & Evidence */}
//               <div className="case-section">
//                 <div className="section-header">Case Facts & Evidence</div>
//                 <div className="case-info-grid">
//                   <div className="info-item">
//                     <div className="label">Case Title:</div>
//                     <div className="value">Land Occupation</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Type:</div>
//                     <div className="value">Property Dispute</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Cause of Action:</div>
//                     <div className="value">Money</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Relief Sought:</div>
//                     <div className="value">Divide</div>
//                   </div>
//                   <div className="info-item">
//                     <div className="label">Case Value:</div>
//                     <div className="value">₹5,50,000</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Right Panel */}
//           <aside className="right-panel">
//             {parties.map((p) => (
//               <div key={p.id} className="party-card">
//                 <div className="card-top">
//                   <span className="case-id">Case ID: #3201</span>
//                   <span className="role-chip">{p.role}</span>
//                 </div>

//                 <div className="party-body">
//                   <img className="avatar" src={p.avatar} alt={p.name} />
//                   <div className="party-info">
//                     <h4>{p.name}</h4>
//                     <div className="muted">{p.email}</div>
//                     <div className="muted">{p.phone}</div>
//                   </div>
//                 </div>

//                 <div className="party-footer">
//                   <div className="case-type">Property Dispute</div>
//                 </div>
//               </div>
//             ))}

//             <div className="action-buttons">
//               <button className="approve">✅ Approve</button>
//               <button className="discard">🗑 Decline</button>
//             </div>
//           </aside>
//         </div>

//         {/* Documents Section */}
//         <section className="documents-section">
//           <h4>Documents & ID Proofs</h4>
//           <div className="documents-row">
//             <div className="doc-preview">No document</div>
//             <div className="doc-preview">No document</div>
//             <div className="doc-preview">No document</div>
//             <div className="doc-preview">No document</div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default AdminNewCasesNextPage;

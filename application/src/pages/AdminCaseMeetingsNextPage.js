// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import HomeIcon from "../assets/icons/home.png";
// import MeetingIcon from "../assets/icons/meeting.png";
// import CaseIcon from "../assets/icons/newcase.png";
// import ChatIcon from "../assets/icons/chat.png";
// import PaymentIcon from "../assets/icons/payment.png";
// import SupportIcon from "../assets/icons/support.png";
// import LogoutIcon from "../assets/icons/logout.png";
// import "../pages/AdminCaseMeetingsNextPage.css";
// import { FaCog, FaBell, FaVideo, FaPhoneSlash, FaMicrophone, FaDesktop } from "react-icons/fa";

// const CaseMeetings = () => {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([
//     {
//       sender: "Abhishek Singh",
//       text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at it.",
//       time: "03:15 pm",
//       type: "opponent",
//     },
//     {
//       sender: "Rohan Singh",
//       text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at it.",
//       time: "03:15 pm",
//       type: "mediator",
//     },
//   ]);

//   const handleSend = () => {
//     if (message.trim() === "") return;
//     setChat([
//       ...chat,
//       {
//         sender: "You",
//         text: message,
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         type: "self",
//       },
//     ]);
//     setMessage("");
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h2 className="sidebar-title">Dashboard</h2>
//         <nav className="menu">
//           <div className="menu-item" onClick={() => navigate("/admin/dashboard")}>
//             <img src={HomeIcon} alt="Home" />
//             <span>Home</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/admin/my-cases")}>
//             <img src={CaseIcon} alt="My Cases" />
//             <span>My Cases</span>
//           </div>
//           <div className="menu-item active" onClick={() => navigate("/admin/case-meetings/call")}>
//             <img src={MeetingIcon} alt="Case Meetings" />
//             <span>Case Meetings</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/admin/chats")}>
//             <img src={ChatIcon} alt="Chats" />
//             <span>Chats</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/admin/payment")}>
//             <img src={PaymentIcon} alt="Payment" />
//             <span>Payment</span>
//           </div>
//           <div className="menu-item" onClick={() => navigate("/admin/suport")}>
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

//         {/* Meeting Section */}
//         <div className="meeting-container">
//           <div className="meeting-header">
//             <button className="ongoing-btn">On going meeting</button>
//             <button className="case-btn">Case Session</button>
//           </div>

//           <div className="video-section">
//             <div className="video-card opponent">
//               <img
//                 src="https://i.pravatar.cc/500?img=12"
//                 alt="Opponent"
//                 className="video-frame"
//               />
//               <span className="label">Opponent</span>
//             </div>
//             <div className="video-card mediator">
//               <img
//                 src="https://i.pravatar.cc/500?img=32"
//                 alt="Mediator"
//                 className="video-frame"
//               />
//               <span className="label">Mediator</span>
//             </div>

//             <div className="video-small">
//               <img
//                 src="https://i.pravatar.cc/150?img=56"
//                 alt="You"
//                 className="video-frame-small"
//               />
//             </div>
//           </div>

//           <div className="controls">
//             <FaVideo className="control-icon" />
//             <FaDesktop className="control-icon" />
//             <FaPhoneSlash className="control-icon end-call" />
//             <FaMicrophone className="control-icon" />
//             <FaCog className="control-icon" />
//           </div>

//           {/* Chat Section */}
//           <div className="chat-section">
//             <div className="chat-users">
//               <h4>Chat Box</h4>
//               <div className="chat-user">
//                 <img src="https://i.pravatar.cc/40?img=12" alt="Opponent" />
//                 <div>
//                   <p className="name">Abhishek Singh</p>
//                   <p className="role">Opponent</p>
//                 </div>
//               </div>
//               <div className="chat-user">
//                 <img src="https://i.pravatar.cc/40?img=32" alt="Mediator" />
//                 <div>
//                   <p className="name">Rohan Singh</p>
//                   <p className="role">Mediator</p>
//                 </div>
//               </div>
//             </div>

//             <div className="chat-box">
//               <div className="chat-messages">
//                 <p className="chat-date">Today</p>
//                 {chat.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`chat-message ${
//                       msg.type === "self" ? "self" : ""
//                     }`}
//                   >
//                     <p className="chat-text">{msg.text}</p>
//                     <span className="chat-time">{msg.time}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="chat-input">
//                 <input
//                   type="text"
//                   placeholder="Write a message..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 />
//                 <button onClick={handleSend}>&#9658;</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CaseMeetings;

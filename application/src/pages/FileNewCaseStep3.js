import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "./FileNewCase.css";
import {
  FaCog,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const FileNewCaseStep3 = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
          <div className="menu-item" onClick={() => navigate("/user/dashboard")}>
            <img src={HomeIcon} alt="Home" />
            {!sidebarCollapsed && <span>Home</span>}
          </div>
          <div className="menu-item" onClick={() => navigate("/user/my-profile")}>
            <img src={Vector} alt="Profile" />
            {!sidebarCollapsed && <span>My Profile</span>}
          </div>          
          <div className="menu-item active" onClick={() => navigate("/user/file-new-case/step3")}>
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
          <div className="menu-item" onClick={() => navigate("/user/documents")}>
            <img src={DocsIcon} alt="Documents" />
            {!sidebarCollapsed && <span>Documents</span>}
          </div>
          <div className="menu-item" onClick={() => navigate("/user/chats")}>
            <img src={ChatIcon} alt="Chats" />
            {!sidebarCollapsed && <span>Chats</span>}
          </div>
          <div className="menu-item" onClick={() => navigate("/user/payment")}>
            <img src={PaymentIcon} alt="Payment" />
            {!sidebarCollapsed && <span>Payment</span>}
          </div>
          <div className="menu-item" onClick={() => navigate("/user/support")}>
            <img src={SupportIcon} alt="Support" />
            {!sidebarCollapsed && <span>Support</span>}
          </div>
        </nav>

        <div className="logout">
          <div className="menu-item">
            <img src={LogoutIcon} alt="Logout" />
            {!sidebarCollapsed && <span>Log out</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className={`main-section ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Navbar */}
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="profile-img"
              />
              <span>Rohan Singhania</span>
            </div>
          </div>
        </header>

        {/* Step Progress Bar */}
        <div className="step-bar">
          <span>Step 1</span>
          <span>Step 2</span>
          <span className="active-step">Step 3</span>
        </div>

        <div className="form-content">
          <h4>Payment</h4>
          <div className="payment-box">
            <p>Payment gateway integration here</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FileNewCaseStep3;
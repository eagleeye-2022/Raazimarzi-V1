// src/pages/MyProfile.js
import React from "react";
import "./MyProfile.css";
import { useNavigate } from "react-router-dom";
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

const MyProfile = () => {
  const navigate = useNavigate();

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

          <div className="menu-item active" onClick={() => navigate("/user/my-profile")}>
            <img src={Vector} alt="Profile" />
            <span>My Profile</span>
          </div>

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

      {/* Main Section */}
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

        {/* Profile Content */}
        <section className="profile-section">
          <div className="profile-left-card">
            <img
              src="https://i.pravatar.cc/150"
              alt="Rohan"
              className="profile-avatar"
            />
            <h3>Rohan Singhania</h3>
            <p className="email">rohansinghania@gmail.com</p>
            <p className="phone">+91 8888 2222 66</p>
            <button className="save-btn">
              <span>✏️</span> Save
            </button>
          </div>

          <div className="profile-right-card">
            <h3>Rohan Singhania</h3>
            <div className="info-grid">
              <div>
                <p>Date of Birth</p>
                <h4>22 Sep, 1994</h4>
              </div>
              <div>
                <p>Gender</p>
                <h4>Male</h4>
              </div>
              <div>
                <p>City</p>
                <h4>Indore</h4>
              </div>
              <div>
                <p>Country</p>
                <h4>India</h4>
              </div>
              <div>
                <p>State</p>
                <h4>Madhya Pradesh</h4>
              </div>
              <div>
                <p>Pin Code</p>
                <h4>224670</h4>
              </div>
            </div>

            <div className="address-section">
              <p>Address</p>
              <h4>
                World cup square, Pipliyana, Scheme 200A, Indore, Madhya Pradesh, India.
              </h4>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;

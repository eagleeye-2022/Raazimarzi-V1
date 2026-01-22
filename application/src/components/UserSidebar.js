// src/components/UserSidebar.js
import React from "react";
import HomeIcon from "../assets/icons/home.png";
import FileIcon from "../assets/icons/file.png";
import CaseIcon from "../assets/icons/newcase.png";
import MeetingIcon from "../assets/icons/meeting.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";
import { useNavigate } from "react-router-dom";

const UserSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: HomeIcon, path: "/user/dashboard" },
    { name: "File New Case", icon: FileIcon, path: "/user/file-new-case/step1" },
    { name: "My Cases", icon: CaseIcon, path: "/user/my-cases" },
    { name: "Case Meetings", icon: MeetingIcon, path: "/user/case-meetings" },
    { name: "Documents", icon: DocsIcon, path: "/user/documents" },
    { name: "Chats", icon: ChatIcon, path: "/user/chats" },
    { name: "Payment", icon: PaymentIcon, path: "/user/payments" },
    { name: "Support", icon: SupportIcon, path: "/user/support" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <nav className="menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`menu-item ${window.location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <img src={item.icon} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="logout" onClick={() => navigate("/logout")}>
        <div className="menu-item">
          <img src={LogoutIcon} alt="Logout" />
          <span>Log out</span>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;

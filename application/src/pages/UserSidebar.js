import React from "react";
import { NavLink } from "react-router-dom";
import HomeIcon from "../assets/icons/home.png";
import FileIcon from "../assets/icons/file.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

const Sidebar = () => {
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
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <img src={item.icon} alt={item.name} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="logout">
        <NavLink to="/logout" className="menu-item">
          <img src={LogoutIcon} alt="Logout" />
          <span>Log out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

// src/components/UserSidebar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useUser } from "../context/userContext";

// Icons
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

const UserSidebar = ({ activePage = "dashboard" }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    setIsLoggingOut(true);
    try {
      logoutUser();
      clearUser();
      alert("✅ Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { key: "dashboard",  label: "Dashboard",    icon: HomeIcon,    path: "/user/dashboard" },
    { key: "file-case",  label: "File a case",  icon: FileIcon,    path: "/user/file-new-case/step1" },
    { key: "my-cases",   label: "My Cases",     icon: CaseIcon,    path: "/user/my-cases" },
    { key: "meetings",   label: "Meetings",     icon: MeetingIcon, path: "/user/case-meetings" },
    { key: "chats",      label: "Messages",     icon: ChatIcon,    path: "/user/chats" },
    { key: "documents",  label: "Documents",    icon: DocsIcon,    path: "/user/documents" },
    { key: "payments",   label: "Payments",     icon: PaymentIcon, path: "/user/payments" },
    { key: "support",    label: "Support",      icon: SupportIcon, path: "/user/support" },
    { key: "profile",    label: "Profile",      icon: Vector,      path: "/user/my-profile" },
  ];

  return (
<aside className={`usr-sidebar ${sidebarCollapsed ? "usr-collapsed" : ""}`}>
  <div className="usr-sidebar-header">
    <div className="usr-sidebar-toggle" onClick={toggleSidebar}>
      <span className="usr-hamburger-icon">&#8801;</span>
    </div>
  </div>

  <nav className="usr-menu">
    {menuItems.map(({ key, label, icon, path }) => {
      const isActive = activePage === key;
      return (
        <div
          key={key}
          className={`usr-menu-item ${isActive ? "usr-active" : ""}`}
          onClick={() => navigate(path)}
        >
          <img src={icon} alt={label} />
          {!sidebarCollapsed && <span>{label}</span>}
        </div>
      );
    })}
  </nav>

  <div className="usr-logout">
    <div
      className="usr-menu-item usr-logout-item"
      onClick={handleLogout}
      style={{
        cursor: isLoggingOut ? "not-allowed" : "pointer",
        opacity: isLoggingOut ? 0.6 : 1,
      }}
    >
      <img src={LogoutIcon} alt="Logout" className="usr-logout-icon" />
      {!sidebarCollapsed && (
        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
      )}
    </div>
  </div>
</aside>
  );
};

export default UserSidebar;
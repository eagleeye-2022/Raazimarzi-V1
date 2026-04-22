// src/components/AdminSidebar.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

// Icons
import Vector from "../assets/icons/Vector.png";
import HomeIcon from "../assets/icons/home.png";
import CaseIcon from "../assets/icons/newcase.png";
import MeetingIcon from "../assets/icons/meeting.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);
    try {
      localStorage.clear();
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
    { key: "dashboard", label: "Dashboard", icon: HomeIcon, path: "/admin/dashboard" },
    { key: "all-cases", label: "All Cases", icon: CaseIcon, path: "/admin/new-cases" },
    { key: "meetings", label: "Meetings", icon: MeetingIcon, path: "/admin/case-meetings" },
    { key: "chats", label: "Messages", icon: ChatIcon, path: "/admin/chats" },
    { key: "payments", label: "Payments", icon: PaymentIcon, path: "/admin/payment" },
    { key: "support", label: "Support", icon: SupportIcon, path: "/admin/support" },
    { key: "profile", label: "Profile", icon: Vector, path: "/admin/profile" },
  ];

  return (
    <aside className={`adm-sidebar ${sidebarCollapsed ? "adm-collapsed" : ""}`}>

      {/* HEADER */}
      <div className="adm-sidebar-header">
        <div className="adm-sidebar-toggle" onClick={toggleSidebar}>
          <span className="adm-bar"></span>
          <span className="adm-bar"></span>
          <span className="adm-bar"></span>
        </div>
      </div>

      {/* MENU */}
      <nav className="adm-menu">
        {menuItems.map(({ key, label, icon, path }) => {

          // ✅ FIXED ACTIVE LOGIC
         const isActive =
         location.pathname.startsWith(path) ||
        (key === "all-cases" && location.pathname.includes("/admin/view-details"));
        
          return (
            <div
              key={key}
              className={`adm-menu-item ${isActive ? "adm-active" : ""}`}
              onClick={() => navigate(path)}
            >
              <img src={icon} alt={label} />
              {!sidebarCollapsed && <span>{label}</span>}
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="adm-logout">
        <div
          className="adm-menu-item adm-logout-item"
          onClick={handleLogout}
          style={{
            cursor: isLoggingOut ? "not-allowed" : "pointer",
            opacity: isLoggingOut ? 0.6 : 1,
          }}
        >
          <img src={LogoutIcon} alt="Logout" className="adm-logout-icon" />
          {!sidebarCollapsed && (
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          )}
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;
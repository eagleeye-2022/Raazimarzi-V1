// src/components/UserNavbar.js
import React from "react";
import { useUser } from "../context/userContext";
import { FaCog, FaBell } from "react-icons/fa";

const UserNavbar = () => {
  const { user, loading, getAvatarUrl } = useUser();

  return (
    <header className="navbar">
      <div></div>
      <div className="nav-icons">
        <FaCog className="icon" />
        <FaBell className="icon" />
        <div className="profile">
          <img
            src={getAvatarUrl(user?.avatar)}
            alt="profile"
            className="profile-img"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=4F46E5&color=fff&size=200`;
            }}
          />
          <span>{loading ? "Loading..." : user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
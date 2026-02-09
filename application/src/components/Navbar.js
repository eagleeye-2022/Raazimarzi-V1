import React from "react";
import { FaCog, FaBell } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="navbar">
      <div></div>
      <div className="nav-icons">
        <FaCog className="icon" />
        <FaBell className="icon" />

        {user && (
          <div className="profile">
            <img
              src={user.avatar || "https://i.pravatar.cc/40"}
              alt="profile"
              className="profile-img"
            />
            <span>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

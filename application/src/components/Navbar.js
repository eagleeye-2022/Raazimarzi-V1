// src/components/UserNavbar.js
import React from "react";
import { useUser } from "../context/userContext";
import { FaBell } from "react-icons/fa";

const UserNavbar = () => {
  const { user, loading, disputes } = useUser();

  const activeDisputes = disputes?.filter(d => d.status === "active")?.length ?? 0;

  return (
    <>
      <header className="navbar">
        <div className="greeting">
          <h2>Hello, {loading ? "..." : user?.name || "User"} 👋</h2>
          <p>
            You have{" "}
            <span className="highlight">{activeDisputes} active disputes</span>{" "}
            requiring your attention.
          </p>
        </div>

        <div className="nav-icons">
          <FaBell className="icon" />
        </div>
      </header>
    </>
  );
};

export default UserNavbar;
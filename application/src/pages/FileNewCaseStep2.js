// src/pages/FileNewCaseStep2.js
import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";

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
import { FaCog, FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ✅ Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create CaseContext locally
const CaseContext = createContext();

const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  return context;
};

const CaseProvider = ({ children }) => {
  const [caseData, setCaseData] = useState({});

  return (
    <CaseContext.Provider value={{ caseData, setCaseData }}>
      {children}
    </CaseContext.Provider>
  );
};

// Create UserContext locally
const UserContext = createContext();

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('userData');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, clearUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

const FileNewCaseStep2Content = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearUser } = useUser();
  const { caseData } = useCaseContext();

  const storedCaseData = JSON.parse(localStorage.getItem("caseData"));
  const effectiveCaseData =
    caseData && Object.keys(caseData).length ? caseData : storedCaseData;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    caseSummary: "",
    documentTitle: "",
    documentType: "",
    witnessDetails: "",
    place: "",
    date: "",
    digitalSignature: "",
    declaration: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill previous Step2 if available
  useEffect(() => {
    if (effectiveCaseData?.step2) {
      setFormData(effectiveCaseData.step2);
    }
  }, [effectiveCaseData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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

  const handleSubmit = async () => {
    // Step1 validation
    if (
      !effectiveCaseData ||
      !effectiveCaseData.caseTitle?.trim() ||
      !effectiveCaseData.petitioner?.fullName?.trim()
    ) {
      alert("Please complete Step 1 first");
      navigate("/user/file-new-case/step1");
      return;
    }

    // Declaration mandatory
    if (!formData.declaration) {
      alert("Please accept the declaration");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // ✅ FIXED: Correct data structure matching backend expectations
      const finalData = {
        caseType: effectiveCaseData.caseType,
        caseTitle: effectiveCaseData.caseTitle,
        causeOfAction: effectiveCaseData.causeOfAction,
        reliefSought: effectiveCaseData.reliefSought,
        caseValue: effectiveCaseData.caseValue,
        petitioner: effectiveCaseData.petitioner,
        defendant: effectiveCaseData.defendant,
        caseFacts: formData,  // ✅ Changed from step2 to caseFacts
      };

      console.log("📤 Sending case data:", finalData);

      const response = await axios.post(
        `${API_URL}/api/cases/file`,
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Case filed successfully!");
      localStorage.removeItem("caseData");
      navigate("/user/my-cases");
    } catch (error) {
      console.error(
        "❌ Error submitting case:",
        error.response?.data || error.message
      );
      
      // ✅ Better error messages
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to submit case. Please try again.";
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <div className="menu-item active">
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

          <div className="menu-item">
            <img src={DocsIcon} alt="Documents" />
            {!sidebarCollapsed && <span>Documents</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/chats")}>
            <img src={ChatIcon} alt="Chats" />
            {!sidebarCollapsed && <span>Chats</span>}
          </div>

          <div className="menu-item">
            <img src={PaymentIcon} alt="Payment" />
            {!sidebarCollapsed && <span>Payment</span>}
          </div>

          <div className="menu-item">
            <img src={SupportIcon} alt="Support" />
            {!sidebarCollapsed && <span>Support</span>}
          </div>
        </nav>

        <div className="logout">
          <div 
            className="menu-item"
            onClick={handleLogout}
            style={{ 
              cursor: isLoggingOut ? "not-allowed" : "pointer", 
              opacity: isLoggingOut ? 0.6 : 1 
            }}
          >
            <img src={LogoutIcon} alt="Logout" />
            {!sidebarCollapsed && <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>}
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <section className={`main-section ${sidebarCollapsed ? 'expanded' : ''}`}>
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src="https://i.pravatar.cc/40" alt="profile" />
              <span>Rohan Singhania</span>
            </div>
          </div>
        </header>

        <div className="step-bar">
          <span>Step 1</span>
          <span className="active-step">Step 2</span>
          <span>Step 3</span>
        </div>

        <div className="form-content">
          <h4>Case Facts & Evidence</h4>

          <textarea
            name="caseSummary"
            placeholder="Case Summary"
            value={formData.caseSummary}
            onChange={handleChange}
            rows="5"
          />

          <div className="form-grid">
            <input
              name="documentTitle"
              placeholder="Document Title"
              value={formData.documentTitle}
              onChange={handleChange}
            />
            <input
              name="documentType"
              placeholder="Document Type"
              value={formData.documentType}
              onChange={handleChange}
            />
            <input
              name="witnessDetails"
              placeholder="Witness Details"
              value={formData.witnessDetails}
              onChange={handleChange}
            />
          </div>

          <h4>Verification & Affidavit</h4>
          <div className="form-grid">
            <input
              name="place"
              placeholder="Place"
              value={formData.place}
              onChange={handleChange}
            />
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />
            <input
              name="digitalSignature"
              placeholder="Digital Signature"
              value={formData.digitalSignature}
              onChange={handleChange}
            />
          </div>

          <div className="declaration">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              id="declaration-checkbox"
            />
            <label htmlFor="declaration-checkbox">
              I hereby declare that the above information is true.
            </label>
          </div>

          <div className="button-group">
            <button
              className="prev-btn"
              onClick={() => navigate("/user/file-new-case/step1")}
              disabled={isSubmitting}
            >
              ← Back
            </button>
            <button 
              className="next-btn" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Case"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Wrap with both providers before exporting
const FileNewCaseStep2 = () => {
  return (
    <UserProvider>
      <CaseProvider>
        <FileNewCaseStep2Content />
      </CaseProvider>
    </UserProvider>
  );
};

export default FileNewCaseStep2;
// src/pages/FileNewCaseStep2.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaseContext } from "../context/caseContext";

import HomeIcon from "../assets/icons/home.png";
import FileIcon from "../assets/icons/file.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

import "./FileNewCase.css";
import { FaCog, FaBell } from "react-icons/fa";

// ✅ Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FileNewCaseStep2 = () => {
  const navigate = useNavigate();
  const { caseData } = useContext(CaseContext);

  const storedCaseData = JSON.parse(localStorage.getItem("caseData"));
  const effectiveCaseData =
    caseData && Object.keys(caseData).length ? caseData : storedCaseData;

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

          <div className="menu-item active">
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
      <section className="main-section">
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

export default FileNewCaseStep2;
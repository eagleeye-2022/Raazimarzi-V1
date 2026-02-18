// src/pages/FileNewCaseStep2.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; 
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";

import "./FileNewCase.css";

const FileNewCaseStep2 = () => {
  const navigate = useNavigate();

  const storedCaseData = JSON.parse(localStorage.getItem("caseData"));

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
    if (storedCaseData?.step2) {
      setFormData(storedCaseData.step2);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      !storedCaseData ||
      !storedCaseData.caseTitle?.trim() ||
      !storedCaseData.petitioner?.fullName?.trim()
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
      const finalData = {
        caseType: storedCaseData.caseType,
        caseTitle: storedCaseData.caseTitle,
        causeOfAction: storedCaseData.causeOfAction,
        reliefSought: storedCaseData.reliefSought,
        caseValue: storedCaseData.caseValue,
        petitioner: storedCaseData.petitioner,
        defendant: storedCaseData.defendant,
        caseFacts: formData,
      };

      await api.post("/cases/file", finalData); // ✅ removed unused `response` variable

      alert("✅ Case filed successfully!");
      localStorage.removeItem("caseData");
      navigate("/user/my-cases");
    } catch (error) {
      console.error("❌ Error submitting case:", error.response?.data || error.message);

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
      <UserSidebar activePage="file-case" />

      <section className="main-section">
        <UserNavbar />

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
// src/pages/FileNewCaseStep2.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import "./FileNewCase.css";
import "./FileNewCaseStep2.css";

const CATEGORIES = [
  { id: "individual", icon: "👨‍👩‍👧", label: "Individual", sub: "Family Disputes" },
  { id: "commercial", icon: "🏢", label: "Commercial", sub: "" },
  { id: "consumer",   icon: "🛒", label: "Consumer",   sub: "" },
];

const CLAIM_RANGES = [
  { id: "low",      label: "Low",       range: "₹0-10k"   },
  { id: "moderate", label: "Moderate",  range: "₹10k-50k" },
  { id: "midrange", label: "Mid Range", range: "₹50k-2L"  },
  { id: "high",     label: "High Value",range: "₹2L+"     },
];

const FEE_MAP = {
  low: 999,
  moderate: 2499,
  midrange: 4999,
  high: 9999,
};

const FileNewCaseStep2 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "individual",
    caseTitle: "",
    isMoneyDispute: true,
    claimRange: "moderate",
    description: "",
    incidentDate: "",
    incidentLocation: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("caseData")) || {};
    if (stored.step2) setFormData((p) => ({ ...p, ...stored.step2 }));
  }, []);

  const set = (field, value) => {
    setErrors((p) => ({ ...p, [field]: "" }));
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const estimatedFee = FEE_MAP[formData.claimRange] || 2499;

  const handleSaveDraft = () => {
    const existing = JSON.parse(localStorage.getItem("caseData")) || {};
    localStorage.setItem("caseData", JSON.stringify({ ...existing, step2: formData }));
    alert("Draft saved!");
  };

  const handleNext = () => {
    const newErrors = {};
    if (!formData.caseTitle.trim())
      newErrors.caseTitle = "Case title is required";
    if (!formData.description.trim())
      newErrors.description = "Case description is required";
    else if (formData.description.trim().length < 100)
      newErrors.description = "Must be at least 100 characters";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const existing = JSON.parse(localStorage.getItem("caseData")) || {};
    localStorage.setItem("caseData", JSON.stringify({ ...existing, step2: formData }));
    navigate("/user/file-new-case/step3");
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const descLen = formData.description.trim().length;

  return (
    <div className="dashboard-container">
      <UserSidebar activePage="file-case" />

      <section className="fnc-main">
        {/* Step Progress Bar */}
        <div className="fnc-steps">
          {[
            { label: "Personal Details", icon: "👤", step: 1 },
            { label: "Case Details",     icon: "📋", step: 2 },
            { label: "Documents",        icon: "📄", step: 3 },
            { label: "Review & Payment", icon: "💳", step: 4 },
          ].map(({ label, icon, step }, i) => (
            <React.Fragment key={step}>
              <div className={`fnc-step ${step === 1 ? "completed" : step === 2 ? "active" : ""}`}>
                <div className="fnc-step-icon">
                  {step === 1 ? "✓" : icon}
                </div>
                <span>{label}</span>
              </div>
              {i < 3 && <div className={`fnc-step-line ${step === 1 ? "completed" : ""}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="fnc-body s2-body">
          <div className="s2-left">
            <h2 className="fnc-title">Case Details</h2>
            <p className="fnc-subtitle">
              Help us understand the nature of your dispute. This information allows our mediators to provide a more tailored and empathetic resolution journey.
            </p>

            {/* Category & Title */}
            <div className="s2-section">
              <h3 className="s2-section-heading">Category &amp; Title</h3>

              <div className="s2-category-row">
                {CATEGORIES.map(({ id, icon, label, sub }) => (
                  <button
                    key={id}
                    className={`s2-category-card ${formData.category === id ? "active" : ""}`}
                    onClick={() => set("category", id)}
                  >
                    <span className="s2-cat-icon">{icon}</span>
                    <span className="s2-cat-label">{label}</span>
                    {sub && <span className="s2-cat-sub">{sub}</span>}
                  </button>
                ))}
              </div>

              <div className="fnc-field" style={{ marginTop: 16 }}>
                <label>CASE TITLE <span className="req">*</span></label>
                <input
                  placeholder="e.g., Dispute regarding shared inheritance terms"
                  value={formData.caseTitle}
                  onChange={(e) => set("caseTitle", e.target.value)}
                  className={errors.caseTitle ? "err" : ""}
                />
                {errors.caseTitle && <span className="err-msg">{errors.caseTitle}</span>}
              </div>
            </div>

            {/* Claim Type */}
            <div className="s2-section">
              <h3 className="s2-section-heading">Claim Type</h3>

              <div className="s2-money-card">
                <p className="s2-money-q">Is this dispute about money?</p>
                <div className="s2-toggle-row">
                  <button
                    className={`s2-toggle-btn ${formData.isMoneyDispute ? "active" : ""}`}
                    onClick={() => set("isMoneyDispute", true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`s2-toggle-btn ${!formData.isMoneyDispute ? "active" : ""}`}
                    onClick={() => set("isMoneyDispute", false)}
                  >
                    No
                  </button>
                </div>

                {formData.isMoneyDispute && (
                  <div className="s2-range-row">
                    {CLAIM_RANGES.map(({ id, label, range }) => (
                      <button
                        key={id}
                        className={`s2-range-btn ${formData.claimRange === id ? "active" : ""}`}
                        onClick={() => set("claimRange", id)}
                      >
                        <span className="s2-range-label">{label}</span>
                        <span className="s2-range-val">{range}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Case Description */}
            <div className="s2-section">
              <h3 className="s2-section-heading">Case Description</h3>
              <div className="fnc-field">
                <textarea
                  className={`s2-textarea ${errors.description ? "err" : ""}`}
                  placeholder="Provide a detailed overview of the situation. Mention key events, parties involved, and what you hope to achieve. Guidance: Try to be as factual as possible while expressing your feelings."
                  value={formData.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                <div className="s2-desc-footer">
                  {errors.description && <span className="err-msg">{errors.description}</span>}
                  <span className={`s2-char-count ${descLen >= 100 ? "ok" : ""}`} style={{ marginLeft: "auto" }}>
                    {descLen} / min. 100 characters
                  </span>
                </div>
              </div>
            </div>

            {/* Incident Details */}
            <div className="s2-section">
              <h3 className="s2-section-heading">Incident Details</h3>
              <div className="fnc-grid-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="fnc-field">
                  <label>APPROXIMATE DATE</label>
                  <div className="fnc-date-wrap s2-icon-input">
                    <span className="s2-input-icon">📅</span>
                    <input
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => set("incidentDate", e.target.value)}
                      max={todayStr}
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                </div>
                <div className="fnc-field">
                  <label>LOCATION OF INCIDENT</label>
                  <div className="s2-icon-input">
                    <span className="s2-input-icon">📍</span>
                    <input
                      placeholder="City, State"
                      value={formData.incidentLocation}
                      onChange={(e) => set("incidentLocation", e.target.value)}
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="s2-aside">
            <div className="s2-tips-card">
              <h4 className="s2-tips-title">Filing Tips</h4>
              <ul className="s2-tips-list">
                <li>
                  <span className="s2-tip-icon">💡</span>
                  The more details you provide, the faster we can match you with the right mediator.
                </li>
                <li>
                  <span className="s2-tip-icon">🔒</span>
                  Your data is encrypted and only shared with selected professionals.
                </li>
              </ul>
              <div className="s2-progress-block">
                <p className="s2-progress-label">YOUR PROGRESS</p>
                <div className="s2-progress-bar">
                  <div className="s2-progress-fill" style={{ width: "50%" }} />
                </div>
                <p className="s2-progress-step">Step 2 of 4: Details In Progress</p>
              </div>
            </div>

            <div className="s2-support-card">
              <div className="s2-support-header">
                <span className="s2-support-title">Mediation Support</span>
                <span className="s2-support-icon">🤝</span>
              </div>
              <p className="s2-support-text">
                Need help explaining your case? Our guides are available 24/7 to assist with phrasing.
              </p>
              <button className="s2-chat-btn">Chat with an Assistant</button>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="fnc-footer">
          <button className="fnc-draft-btn" onClick={handleSaveDraft}>
            ⊞ Save as Draft
          </button>
          <button className="fnc-cancel-btn" onClick={() => navigate("/user/file-new-case/step1")}>
            Back
          </button>
          <div className="s2-fee-display">
            <span className="s2-fee-label">ESTIMATED MEDIATION FEE</span>
            <span className="s2-fee-amount">
              ₹{estimatedFee.toLocaleString("en-IN")}
              <span className="s2-fee-tax"> + taxes</span>
            </span>
          </div>
          <button className="fnc-next-btn" onClick={handleNext}>
            Continue to Documents →
          </button>
        </div>
      </section>
    </div>
  );
};

export default FileNewCaseStep2;
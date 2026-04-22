// src/pages/FileNewCaseStep4.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import "./FileNewCase.css";
import "./FileNewCaseStep4.css";

const FileNewCaseStep4 = () => {
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("caseData")) || {};
    setCaseData(stored);
  }, []);

  const mediationFee = 1200.0;
  const platformFee = 150.0;
  const taxRate = 0.08;
  const taxes = parseFloat(((mediationFee + platformFee) * taxRate).toFixed(2));
  const total = mediationFee + platformFee + taxes;

  const handleProceed = () => {
    if (!confirmed) {
      alert("Please confirm that the information is correct before proceeding.");
      return;
    }
    alert("Proceeding to payment...");
    // navigate("/user/payment") — wire up when payment page is ready
  };

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
              <div
                className={`fnc-step ${
                  step < 4 ? "completed" : step === 4 ? "active" : ""
                }`}
              >
                <div className="fnc-step-icon">
                  {step < 4 ? "✓" : icon}
                </div>
                <span>{label}</span>
              </div>
              {i < 3 && (
                <div className={`fnc-step-line ${step < 4 ? "completed" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="fnc-body">
          <h2 className="fnc-title">Review &amp; Payment</h2>
          <p className="fnc-subtitle">
            Please review your case details carefully before proceeding to secure payment.
            Once submitted, some details may require mediation to alter.
          </p>

          <div className="s4-layout">
            {/* LEFT — Case Summary */}
            <div className="s4-left">
              <div className="s4-summary-card">
                <div className="s4-summary-header">
                  <h3 className="s4-summary-title">Case Summary</h3>
                  <button
                    className="s4-edit-btn"
                    onClick={() => navigate("/user/file-new-case/step2")}
                  >
                    ✎ Edit Details
                  </button>
                </div>

                <div className="s4-summary-grid">
                  <div className="s4-summary-field">
                    <span className="s4-field-label">CASE TITLE</span>
                    <span className="s4-field-value">
                      {caseData.caseTitle || "Post-Divorce Asset Distribution Agreement"}
                    </span>
                  </div>
                  <div className="s4-summary-field">
                    <span className="s4-field-label">CATEGORY</span>
                    <span className="s4-field-value">
                      {caseData.category || "Individual Dispute"}
                    </span>
                  </div>
                  <div className="s4-summary-field">
                    <span className="s4-field-label">OPPONENT(S)</span>
                    <span className="s4-field-value">
                      {caseData.opponents || "Dharma"}
                    </span>
                  </div>
                  <div className="s4-summary-field">
                    <span className="s4-field-label">CLAIM TYPE</span>
                    <span className="s4-field-value">
                      <span className="s4-claim-badge">
                        {caseData.claimType || "Money : ₹50k-2L"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="s4-brief-section">
                  <span className="s4-field-label">CASE BRIEF PREVIEW</span>
                  <div className="s4-brief-box">
                    <p>
                      {caseData.caseBrief ||
                        `"The applicant seeks a formal mediation regarding the distribution of joint property located at 44 Willow Lane. Both parties have agreed to explore 'The Empathetic Sanctuary' protocols for a non-adversarial resolution..."`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation checkbox */}
              <div className="s4-confirm-card">
                <label className="s4-confirm-label">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="s4-checkbox"
                  />
                  <div className="s4-confirm-text">
                    <span className="s4-confirm-heading">I confirm the information is correct</span>
                    <span className="s4-confirm-sub">
                      I have reviewed all the documents and details provided. I understand that
                      submitting this case initiates a formal mediation process.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* RIGHT — Fee Breakdown */}
            <div className="s4-right">
              <div className="s4-fee-card">
                <h3 className="s4-fee-title">Fee Breakdown</h3>

                <div className="s4-fee-rows">
                  <div className="s4-fee-row">
                    <span className="s4-fee-label">Mediation Fee</span>
                    <span className="s4-fee-amount">₹{mediationFee.toFixed(2)}</span>
                  </div>
                  <div className="s4-fee-row">
                    <span className="s4-fee-label">Filing Platform Fee</span>
                    <span className="s4-fee-amount">₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="s4-fee-row">
                    <span className="s4-fee-label">Estimated Taxes (8%)</span>
                    <span className="s4-fee-amount">₹{taxes.toFixed(2)}</span>
                  </div>
                </div>

                <div className="s4-fee-divider" />

                <div className="s4-fee-total-row">
                  <span className="s4-fee-total-label">TOTAL AMOUNT</span>
                  <span className="s4-fee-currency">INR</span>
                </div>
                <p className="s4-fee-total-amount">₹{total.toFixed(2)}</p>

                <button
                  className="s4-pay-btn"
                  onClick={handleProceed}
                  disabled={!confirmed}
                >
                  Proceed to Payment 💳
                </button>

                <button
                  className="s4-back-proofs-btn"
                  onClick={() => navigate("/user/file-new-case/step3")}
                >
                  Back to Proofs
                </button>
              </div>

              {/* Need a hand? */}
              <div className="s4-help-card">
                <div className="s4-help-header">
                  <div className="s4-help-icon-wrap">
                    <span className="s4-help-icon">🧭</span>
                  </div>
                  <div className="s4-help-texts">
                    <span className="s4-help-title">Need a hand?</span>
                    <span className="s4-help-icon-right">🤝</span>
                  </div>
                </div>
                <p className="s4-help-desc">
                  Our case managers are here to guide you through the financial aspect of your journey.
                </p>
                <button className="s4-chat-btn">Chat with an Assistant</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FileNewCaseStep4;
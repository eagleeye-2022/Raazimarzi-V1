// src/pages/FileNewCaseStep1.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";


import "./FileNewCase.css";

const FileNewCaseStep1 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    petitioner: {
      fullName: "",
      mobile: "",
      email: "",
      dob: "",
      gender: "",
      address: "",
    },
    defendants: [
      {
        fullName: "",
        mobile: "",
        email: "",
        dob: "",
        gender: "",
        address: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});

  // Pre-fill if data exists in localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("caseData"));
    if (storedData) setFormData(storedData);
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateDate  = (d) => d && new Date(d) <= new Date();

  const handlePetitionerChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [`petitioner.${field}`]: "" }));
    setFormData((prev) => ({
      ...prev,
      petitioner: { ...prev.petitioner, [field]: value },
    }));
  };

  const handleDefendantChange = (index, field, value) => {
    setErrors((prev) => ({ ...prev, [`defendant.${index}.${field}`]: "" }));
    setFormData((prev) => {
      const updated = [...prev.defendants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, defendants: updated };
    });
  };

  const addOpponent = () => {
    setFormData((prev) => ({
      ...prev,
      defendants: [
        ...prev.defendants,
        { fullName: "", mobile: "", email: "", dob: "", gender: "", address: "" },
      ],
    }));
  };

  const removeOpponent = (index) => {
    if (formData.defendants.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      defendants: prev.defendants.filter((_, i) => i !== index),
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem("caseData", JSON.stringify(formData));
    alert("Draft saved!");
  };

  const handleNext = () => {
    const newErrors = {};

    // Petitioner validations
    if (!formData.petitioner.fullName.trim())
      newErrors["petitioner.fullName"] = "Full name is required";
    if (!formData.petitioner.mobile.trim())
      newErrors["petitioner.mobile"] = "Phone number is required";
    else if (!validatePhone(formData.petitioner.mobile))
      newErrors["petitioner.mobile"] = "Must be 10 digits";
    if (formData.petitioner.email && !validateEmail(formData.petitioner.email))
      newErrors["petitioner.email"] = "Invalid email format";
    if (!formData.petitioner.dob)
      newErrors["petitioner.dob"] = "Date of birth is required";
    else if (!validateDate(formData.petitioner.dob))
      newErrors["petitioner.dob"] = "Invalid date";
    if (!formData.petitioner.address.trim())
      newErrors["petitioner.address"] = "Address is required";

    // Defendant validations
    formData.defendants.forEach((def, i) => {
      if (!def.fullName.trim())
        newErrors[`defendant.${i}.fullName`] = "Full name is required";
      if (!def.mobile.trim())
        newErrors[`defendant.${i}.mobile`] = "Phone number is required";
      else if (!validatePhone(def.mobile))
        newErrors[`defendant.${i}.mobile`] = "Must be 10 digits";
      if (def.email && !validateEmail(def.email))
        newErrors[`defendant.${i}.email`] = "Invalid email format";
      if (!def.address.trim())
        newErrors[`defendant.${i}.address`] = "Address is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    localStorage.setItem("caseData", JSON.stringify(formData));
    navigate("/user/file-new-case/step2");
  };

  const todayStr = new Date().toISOString().split("T")[0];

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
              <div className={`fnc-step ${step === 1 ? "active" : ""}`}>
                <div className="fnc-step-icon">{icon}</div>
                <span>{label}</span>
              </div>
              {i < 3 && <div className="fnc-step-line" />}
            </React.Fragment>
          ))}
        </div>

        {/* Page content */}
        <div className="fnc-body">
          <h2 className="fnc-title">People Involved</h2>
          <p className="fnc-subtitle">
            To begin your case filing, we need to know who is involved. Your information is pre-filled from your profile.
          </p>

          {/* ── Petitioner ── */}
          <div className="fnc-section-card">
            <h3 className="fnc-section-title">
              <span className="fnc-section-icon">👤</span> Petitioner Information
            </h3>

            <div className="fnc-grid-3">
              {/* Row 1 */}
              <div className="fnc-field">
                <label>FULL NAME AS PER AADHAAR <span className="req">*</span></label>
                <input
                  value={formData.petitioner.fullName}
                  onChange={(e) => handlePetitionerChange("fullName", e.target.value)}
                  className={errors["petitioner.fullName"] ? "err" : ""}
                />
                {errors["petitioner.fullName"] && <span className="err-msg">{errors["petitioner.fullName"]}</span>}
              </div>

              <div className="fnc-field">
                <label>PHONE NUMBER <span className="req">*</span></label>
                <input
                  value={formData.petitioner.mobile}
                  onChange={(e) => handlePetitionerChange("mobile", e.target.value)}
                  maxLength="10"
                  className={errors["petitioner.mobile"] ? "err" : ""}
                />
                {errors["petitioner.mobile"] && <span className="err-msg">{errors["petitioner.mobile"]}</span>}
              </div>

              <div className="fnc-field">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={formData.petitioner.email}
                  onChange={(e) => handlePetitionerChange("email", e.target.value)}
                  className={errors["petitioner.email"] ? "err" : ""}
                />
                {errors["petitioner.email"] && <span className="err-msg">{errors["petitioner.email"]}</span>}
              </div>

              {/* Row 2 */}
              <div className="fnc-field">
                <label>DATE OF BIRTH <span className="req">*</span></label>
                <div className="fnc-date-wrap">
                  <input
                    type="date"
                    value={formData.petitioner.dob}
                    onChange={(e) => handlePetitionerChange("dob", e.target.value)}
                    max={todayStr}
                    className={errors["petitioner.dob"] ? "err" : ""}
                  />
                </div>
                {errors["petitioner.dob"] && <span className="err-msg">{errors["petitioner.dob"]}</span>}
              </div>

              <div className="fnc-field">
                <label>GENDER</label>
                <div className="fnc-select-wrap">
                  <select
                    value={formData.petitioner.gender}
                    onChange={(e) => handlePetitionerChange("gender", e.target.value)}
                  >
                    <option value=""></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="select-chevron">⌃</span>
                </div>
              </div>

              <div className="fnc-field">
                <label>ADDRESS AS PER AADHAAR <span className="req">*</span></label>
                <input
                  value={formData.petitioner.address}
                  onChange={(e) => handlePetitionerChange("address", e.target.value)}
                  className={errors["petitioner.address"] ? "err" : ""}
                />
                {errors["petitioner.address"] && <span className="err-msg">{errors["petitioner.address"]}</span>}
              </div>
            </div>
          </div>

          {/* ── Respondents ── */}
          {formData.defendants.map((def, idx) => (
            <div className="fnc-section-card" key={idx}>
              <div className="fnc-section-title-row">
                <h3 className="fnc-section-title">
                  <span className="fnc-section-icon">👥</span>
                  {formData.defendants.length > 1 ? `Respondent ${idx + 1} Information` : "Respondent Information"}
                </h3>
                {formData.defendants.length > 1 && (
                  <button className="fnc-remove-btn" onClick={() => removeOpponent(idx)}>✕ Remove</button>
                )}
              </div>

              <div className="fnc-grid-3">
                <div className="fnc-field">
                  <label>RESPONDENT FULL NAME <span className="req">*</span></label>
                  <input
                    value={def.fullName}
                    onChange={(e) => handleDefendantChange(idx, "fullName", e.target.value)}
                    className={errors[`defendant.${idx}.fullName`] ? "err" : ""}
                  />
                  {errors[`defendant.${idx}.fullName`] && <span className="err-msg">{errors[`defendant.${idx}.fullName`]}</span>}
                </div>

                <div className="fnc-field">
                  <label>PHONE NUMBER <span className="req">*</span></label>
                  <input
                    value={def.mobile}
                    onChange={(e) => handleDefendantChange(idx, "mobile", e.target.value)}
                    maxLength="10"
                    className={errors[`defendant.${idx}.mobile`] ? "err" : ""}
                  />
                  {errors[`defendant.${idx}.mobile`] && <span className="err-msg">{errors[`defendant.${idx}.mobile`]}</span>}
                </div>

                <div className="fnc-field">
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={def.email}
                    onChange={(e) => handleDefendantChange(idx, "email", e.target.value)}
                    className={errors[`defendant.${idx}.email`] ? "err" : ""}
                  />
                  {errors[`defendant.${idx}.email`] && <span className="err-msg">{errors[`defendant.${idx}.email`]}</span>}
                </div>

                <div className="fnc-field">
                  <label>DATE OF BIRTH</label>
                  <div className="fnc-date-wrap">
                    <input
                      type="date"
                      value={def.dob}
                      onChange={(e) => handleDefendantChange(idx, "dob", e.target.value)}
                      max={todayStr}
                    />
                  </div>
                </div>

                <div className="fnc-field">
                  <label>GENDER</label>
                  <div className="fnc-select-wrap">
                    <select
                      value={def.gender}
                      onChange={(e) => handleDefendantChange(idx, "gender", e.target.value)}
                    >
                      <option value=""></option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="select-chevron">⌃</span>
                  </div>
                </div>

                <div className="fnc-field">
                  <label>RESPONDENT ADDRESS <span className="req">*</span></label>
                  <input
                    value={def.address}
                    onChange={(e) => handleDefendantChange(idx, "address", e.target.value)}
                    className={errors[`defendant.${idx}.address`] ? "err" : ""}
                  />
                  {errors[`defendant.${idx}.address`] && <span className="err-msg">{errors[`defendant.${idx}.address`]}</span>}
                </div>
              </div>
            </div>
          ))}

          {/* Add Another Opponent */}
          <button className="fnc-add-opponent" onClick={addOpponent}>
            <span className="fnc-add-icon">👥+</span> Add Another Opponent
          </button>

          {/* Why do we need this */}
          <div className="fnc-info-box">
            <div className="fnc-info-icon">✦</div>
            <div>
              <p className="fnc-info-title">Why do we need this?</p>
              <p className="fnc-info-text">
                Identifying everyone involved helps our system generate the correct legal templates and ensures communications
                are sent to the right parties during the mediation process.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fnc-footer">
          <button className="fnc-draft-btn" onClick={handleSaveDraft}>
            ⊞ Save as Draft
          </button>
          <button className="fnc-cancel-btn" onClick={() => navigate("/user/dashboard")}>
            Cancel
          </button>
          <button className="fnc-next-btn" onClick={handleNext}>
            Continue to Details →
          </button>
        </div>
      </section>
    </div>
  );
};

export default FileNewCaseStep1;
// src/pages/FileNewCaseStep1.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";

import "./FileNewCase.css";

const FileNewCaseStep1 = () => {
  const navigate = useNavigate();

  const Required = () => <span style={{ color: "red" }}> *</span>;

  const [formData, setFormData] = useState({
    caseType: "",
    caseTitle: "",
    causeOfAction: "",
    reliefSought: "",
    caseValue: "",
    petitioner: {
      fullName: "",
      fatherName: "",
      gender: "",
      dob: "",
      mobile: "",
      email: "",
      idType: "",
      idProof: "",
      address: "",
    },
    defendant: {
      fullName: "",
      fatherName: "",
      gender: "",
      dob: "",
      mobile: "",
      email: "",
      idDetails: "",
    },
  });

  const [errors, setErrors] = useState({});

  // ✅ Pre-fill Step1 if data exists in localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("caseData"));
    if (storedData) setFormData(storedData);
  }, []);

  const handleChange = (e, section, field) => {
    // Clear error for this field when user starts typing
    if (section) {
      setErrors({ ...errors, [`${section}.${field}`]: "" });
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: e.target.value },
      });
    } else {
      setErrors({ ...errors, [e.target.name]: "" });
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ Phone validation (10 digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // ✅ Date validation (not future date)
  const validateDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date <= today;
  };

  const handleNext = () => {
    const newErrors = {};

    // Mandatory field validation
    if (!formData.caseType.trim()) {
      newErrors.caseType = "Case type is required";
    }

    if (!formData.caseTitle.trim()) {
      newErrors.caseTitle = "Case title is required";
    }

    // Petitioner validations
    if (!formData.petitioner.fullName.trim()) {
      newErrors["petitioner.fullName"] = "Petitioner full name is required";
    }

    if (!formData.petitioner.gender.trim()) {
      newErrors["petitioner.gender"] = "Gender is required";
    }

    if (!formData.petitioner.dob) {
      newErrors["petitioner.dob"] = "Date of birth is required";
    } else if (!validateDate(formData.petitioner.dob)) {
      newErrors["petitioner.dob"] = "Invalid date of birth";
    }

    if (!formData.petitioner.mobile.trim()) {
      newErrors["petitioner.mobile"] = "Mobile number is required";
    } else if (!validatePhone(formData.petitioner.mobile)) {
      newErrors["petitioner.mobile"] = "Mobile number must be 10 digits";
    }

    if (!formData.petitioner.email.trim()) {
      newErrors["petitioner.email"] = "Email is required";
    } else if (!validateEmail(formData.petitioner.email)) {
      newErrors["petitioner.email"] = "Invalid email format";
    }

    // Defendant validations
    if (!formData.defendant.fullName.trim()) {
      newErrors["defendant.fullName"] = "Defendant full name is required";
    }

    if (!formData.defendant.mobile.trim()) {
      newErrors["defendant.mobile"] = "Mobile number is required";
    } else if (!validatePhone(formData.defendant.mobile)) {
      newErrors["defendant.mobile"] = "Mobile number must be 10 digits";
    }

    if (!formData.defendant.email.trim()) {
      newErrors["defendant.email"] = "Email is required";
    } else if (!validateEmail(formData.defendant.email)) {
      newErrors["defendant.email"] = "Invalid email format";
    }

    // If there are errors, show them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix all validation errors before proceeding");
      return;
    }

    // Save Step1 data in localStorage
    localStorage.setItem("caseData", JSON.stringify(formData));

    // Navigate to Step2
    navigate("/user/file-new-case/step2");
  };

  return (
    <div className="dashboard-container">
      {/* Reusable Sidebar */}
      <UserSidebar activePage="file-case" />

      {/* Main Section */}
      <section className="main-section">
        {/* Reusable Navbar */}
        <UserNavbar />

        <div className="step-bar">
          <span className="active-step">Step 1</span>
          <span>Step 2</span>
          <span>Step 3</span>
        </div>

        <div className="form-content">
          <h4>Case Details</h4>
          <div className="form-grid">
            <div>
              <span>Case Type<Required /></span>
              <input
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                placeholder="Case Type"
                className={errors.caseType ? "error-input" : ""}
              />
              {errors.caseType && <span className="error-text">{errors.caseType}</span>}
            </div>

            <div>
              <span>Case Title<Required /></span>
              <input
                name="caseTitle"
                value={formData.caseTitle}
                onChange={handleChange}
                placeholder="Case Title"
                className={errors.caseTitle ? "error-input" : ""}
              />
              {errors.caseTitle && <span className="error-text">{errors.caseTitle}</span>}
            </div>

            <input
              name="causeOfAction"
              value={formData.causeOfAction}
              onChange={handleChange}
              placeholder="Cause of Action"
            />
            <input
              name="reliefSought"
              value={formData.reliefSought}
              onChange={handleChange}
              placeholder="Relief Sought"
            />
            <input
              name="caseValue"
              value={formData.caseValue}
              onChange={handleChange}
              placeholder="Case Value"
            />
          </div>

          <h4>Petitioner Details</h4>
          <div className="form-grid">
            <div>
              <span>Full Name<Required /></span>
              <input
                value={formData.petitioner.fullName}
                onChange={(e) => handleChange(e, "petitioner", "fullName")}
                placeholder="Full Name"
                className={errors["petitioner.fullName"] ? "error-input" : ""}
              />
              {errors["petitioner.fullName"] && (
                <span className="error-text">{errors["petitioner.fullName"]}</span>
              )}
            </div>

            <input
              value={formData.petitioner.fatherName}
              onChange={(e) => handleChange(e, "petitioner", "fatherName")}
              placeholder="Father/Spouse Name"
            />

            <div>
              <span>Gender<Required /></span>
              <select
                value={formData.petitioner.gender}
                onChange={(e) => handleChange(e, "petitioner", "gender")}
                className={errors["petitioner.gender"] ? "error-input" : ""}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors["petitioner.gender"] && (
                <span className="error-text">{errors["petitioner.gender"]}</span>
              )}
            </div>

            <div>
              <span>DOB<Required /></span>
              <input
                type="date"
                value={formData.petitioner.dob}
                onChange={(e) => handleChange(e, "petitioner", "dob")}
                max={new Date().toISOString().split("T")[0]}
                className={errors["petitioner.dob"] ? "error-input" : ""}
              />
              {errors["petitioner.dob"] && (
                <span className="error-text">{errors["petitioner.dob"]}</span>
              )}
            </div>

            <div>
              <span>Mobile Number<Required /></span>
              <input
                value={formData.petitioner.mobile}
                onChange={(e) => handleChange(e, "petitioner", "mobile")}
                placeholder="10-digit mobile number"
                maxLength="10"
                className={errors["petitioner.mobile"] ? "error-input" : ""}
              />
              {errors["petitioner.mobile"] && (
                <span className="error-text">{errors["petitioner.mobile"]}</span>
              )}
            </div>

            <div>
              <span>Email ID<Required /></span>
              <input
                type="email"
                value={formData.petitioner.email}
                onChange={(e) => handleChange(e, "petitioner", "email")}
                placeholder="Email ID"
                className={errors["petitioner.email"] ? "error-input" : ""}
              />
              {errors["petitioner.email"] && (
                <span className="error-text">{errors["petitioner.email"]}</span>
              )}
            </div>

            <input
              value={formData.petitioner.idType}
              onChange={(e) => handleChange(e, "petitioner", "idType")}
              placeholder="ID Proof Type"
            />
            <input
              value={formData.petitioner.idProof}
              onChange={(e) => handleChange(e, "petitioner", "idProof")}
              placeholder="Upload ID Proof"
            />
            <input
              className="full-width"
              value={formData.petitioner.address}
              onChange={(e) => handleChange(e, "petitioner", "address")}
              placeholder="Full Address"
            />
          </div>

          <h4>Defendant Details</h4>
          <div className="form-grid">
            <div>
              <span>Full Name<Required /></span>
              <input
                value={formData.defendant.fullName}
                onChange={(e) => handleChange(e, "defendant", "fullName")}
                placeholder="Full Name"
                className={errors["defendant.fullName"] ? "error-input" : ""}
              />
              {errors["defendant.fullName"] && (
                <span className="error-text">{errors["defendant.fullName"]}</span>
              )}
            </div>

            <input
              value={formData.defendant.fatherName}
              onChange={(e) => handleChange(e, "defendant", "fatherName")}
              placeholder="Father/Spouse Name"
            />

            <select
              value={formData.defendant.gender}
              onChange={(e) => handleChange(e, "defendant", "gender")}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              value={formData.defendant.dob}
              onChange={(e) => handleChange(e, "defendant", "dob")}
              max={new Date().toISOString().split("T")[0]}
            />

            <div>
              <span>Mobile Number<Required /></span>
              <input
                value={formData.defendant.mobile}
                onChange={(e) => handleChange(e, "defendant", "mobile")}
                placeholder="10-digit mobile number"
                maxLength="10"
                className={errors["defendant.mobile"] ? "error-input" : ""}
              />
              {errors["defendant.mobile"] && (
                <span className="error-text">{errors["defendant.mobile"]}</span>
              )}
            </div>

            <div>
              <span>Email ID<Required /></span>
              <input
                type="email"
                value={formData.defendant.email}
                onChange={(e) => handleChange(e, "defendant", "email")}
                placeholder="Email ID"
                className={errors["defendant.email"] ? "error-input" : ""}
              />
              {errors["defendant.email"] && (
                <span className="error-text">{errors["defendant.email"]}</span>
              )}
            </div>

            <input
              value={formData.defendant.idDetails}
              onChange={(e) => handleChange(e, "defendant", "idDetails")}
              placeholder="Any Identification Details"
            />
          </div>

          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default FileNewCaseStep1;
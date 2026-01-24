import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { FaCog, FaBell } from "react-icons/fa";
import { CaseContext } from "../context/caseContext";

const FileNewCaseStep1 = () => {
  const navigate = useNavigate();
  const { setCaseData } = useContext(CaseContext);

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

  const handleChange = (e, section, field) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: e.target.value },
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
const handleNext = () => {
  // Mandatory field validation
  if (
    !formData.caseType.trim() ||
    !formData.caseTitle.trim() ||
    !formData.petitioner.fullName.trim() ||
    !formData.petitioner.gender.trim() ||
    !formData.petitioner.dob ||
    !formData.petitioner.mobile.trim() ||
    !formData.petitioner.email.trim() ||
    !formData.defendant.fullName.trim() ||
    !formData.defendant.mobile.trim() ||
    !formData.defendant.email.trim()
  ) {
    alert("Please fill all mandatory (*) fields");
    return;
  }

  setCaseData(formData);
  localStorage.setItem("caseData", JSON.stringify(formData));
  navigate("/user/file-new-case/step2");
};


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <nav className="menu">
                 <div className="menu-item active" onClick={() => navigate("/user/dashboard")}>
                   <img src={HomeIcon} alt="Home" />
                   <span>Home</span>
                 </div>
       
                 <div className="menu-item" onClick={() => navigate("/user/my-profile")}>
                   <img src={Vector} alt="Profile" />
                   <span>My Profile</span>
                 </div>
       
                 <div className="menu-item" onClick={() => navigate("/user/file-new-case/step1")}>
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
       
                 <div className="menu-item" onClick={() => navigate("/user/chats")}>
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

      {/* Main Content */}
      <section className="main-section">
        <header className="navbar">
          <div></div>
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img src="https://i.pravatar.cc/40" alt="profile" className="profile-img" />
              <span>Rohan Singhania</span>
            </div>
          </div>
        </header>

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
              />
            </div>

            <input
              name="caseTitle"
              value={formData.caseTitle}
              onChange={handleChange}
              placeholder="Case Title"
            />
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
              />
            </div>

            <input
              value={formData.petitioner.fatherName}
              onChange={(e) => handleChange(e, "petitioner", "fatherName")}
              placeholder="Father/Spouse Name"
            />

            <div>
              <span>Gender<Required /></span>
              <input
                value={formData.petitioner.gender}
                onChange={(e) => handleChange(e, "petitioner", "gender")}
                placeholder="Gender"
              />
            </div>

            <div>
              <span>DOB<Required /></span>
              <input
                type="date"
                value={formData.petitioner.dob}
                onChange={(e) => handleChange(e, "petitioner", "dob")}
              />
            </div>

            <div>
              <span>Mobile Number<Required /></span>
              <input
                value={formData.petitioner.mobile}
                onChange={(e) => handleChange(e, "petitioner", "mobile")}
                placeholder="Mobile Number"
              />
            </div>

            <div>
              <span>Email ID<Required /></span>
              <input
                value={formData.petitioner.email}
                onChange={(e) => handleChange(e, "petitioner", "email")}
                placeholder="Email ID"
              />
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
              />
            </div>

            <input
              value={formData.defendant.fatherName}
              onChange={(e) => handleChange(e, "defendant", "fatherName")}
              placeholder="Father/Spouse Name"
            />

            <input
              value={formData.defendant.gender}
              onChange={(e) => handleChange(e, "defendant", "gender")}
              placeholder="Gender"
            />

            <input
              type="date"
              value={formData.defendant.dob}
              onChange={(e) => handleChange(e, "defendant", "dob")}
            />

            <div>
              <span>Mobile Number<Required /></span>
              <input
                value={formData.defendant.mobile}
                onChange={(e) => handleChange(e, "defendant", "mobile")}
                placeholder="Mobile Number"
              />
            </div>

            <div>
              <span>Email ID<Required /></span>
              <input
                value={formData.defendant.email}
                onChange={(e) => handleChange(e, "defendant", "email")}
                placeholder="Email ID"
              />
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

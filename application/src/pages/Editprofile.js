// src/pages/EditProfile.js
import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../api/axios";

// Icons
import Vector from "../assets/icons/Vector.png";
import HomeIcon from "../assets/icons/home.png";
import FileIcon from "../assets/icons/file.png";
import MeetingIcon from "../assets/icons/meeting.png";
import CaseIcon from "../assets/icons/newcase.png";
import DocsIcon from "../assets/icons/document.png";
import ChatIcon from "../assets/icons/chat.png";
import PaymentIcon from "../assets/icons/payment.png";
import SupportIcon from "../assets/icons/support.png";
import LogoutIcon from "../assets/icons/logout.png";

import { FaCog, FaBell, FaChevronLeft, FaChevronRight, FaCamera } from "react-icons/fa";
import "./EditProfile.css";

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

const EditProfileContent = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearUser } = useUser();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/me");
        const profile = res.data;
        
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          dob: profile.dob || "",
          gender: profile.gender || "",
          city: profile.city || "",
          state: profile.state || "",
          country: profile.country || "India",
          pincode: profile.pincode || "",
          address: profile.address || "",
        });

        if (profile.avatar) {
          setImagePreview(profile.avatar);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);

    try {
      logoutUser();
      clearUser();
      localStorage.removeItem("token");
      alert("✅ Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix all errors before submitting");
      return;
    }

    setSaving(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image if selected
      if (imageFile) {
        formDataToSend.append("avatar", imageFile);
      }

      const res = await api.put("/api/users/update-profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Profile updated successfully!");
      navigate("/user/my-profile");
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update profile. Please try again.";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading profile...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
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

          <div className="menu-item active" onClick={() => navigate("/user/my-profile")}>
            <img src={Vector} alt="Profile" />
            {!sidebarCollapsed && <span>My Profile</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/file-new-case/step1")}>
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

          <div className="menu-item" onClick={() => navigate("/user/documents")}>
            <img src={DocsIcon} alt="Documents" />
            {!sidebarCollapsed && <span>Documents</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/chats")}>
            <img src={ChatIcon} alt="Chats" />
            {!sidebarCollapsed && <span>Chats</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/payments")}>
            <img src={PaymentIcon} alt="Payment" />
            {!sidebarCollapsed && <span>Payment</span>}
          </div>

          <div className="menu-item" onClick={() => navigate("/user/support")}>
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
      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        {/* Navbar */}
        <header className="navbar">
          <div />
          <div className="nav-icons">
            <FaCog className="icon" />
            <FaBell className="icon" />
            <div className="profile">
              <img
                src={imagePreview || "https://i.pravatar.cc/40"}
                alt="profile"
                className="profile-img"
              />
              <span>{formData.name}</span>
            </div>
          </div>
        </header>

        {/* Edit Profile Form */}
        <section className="edit-profile-section">
          <div className="profile-header">
            <h2>Edit Profile</h2>
            <button
              className="cancel-btn"
              onClick={() => navigate("/user/my-profile")}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className="profile-picture-section">
              <div className="image-upload-container">
                <div className="image-preview">
                  <img
                    src={imagePreview || "https://i.pravatar.cc/150"}
                    alt="Profile"
                  />
                  <label htmlFor="avatar-upload" className="camera-icon">
                    <FaCamera />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="upload-info">
                  <h4>Profile Picture</h4>
                  <p>Click the camera icon to upload a new photo</p>
                  <p className="upload-hint">Max size: 5MB | Formats: JPG, PNG, GIF</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error-input" : ""}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error-input" : ""}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    className={errors.phone ? "error-input" : ""}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    placeholder="6-digit pincode"
                    className={errors.pincode ? "error-input" : ""}
                  />
                  {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

// Wrap with UserProvider before exporting
const EditProfile = () => {
  return (
    <UserProvider>
      <EditProfileContent />
    </UserProvider>
  );
};

export default EditProfile;
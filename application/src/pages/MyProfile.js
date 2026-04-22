// src/pages/MyProfile.js
import React, { useState } from "react";
import "./MyProfile.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/Navbar";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, loading, getAvatarUrl } = useUser();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    realtime: true,
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const toggleNotif = (key) =>
    setNotifications((p) => ({ ...p, [key]: !p[key] }));

  if (loading) {
    return <div style={{ padding: 40 }}>Loading profile...</div>;
  }

  // Profile strength: count filled fields
  const fields = [user?.name, user?.email, user?.phone, user?.dob, user?.gender, user?.address, user?.city, user?.state, user?.pincode, user?.fatherSpouseName];
  const filled = fields.filter(Boolean).length;
  const strength = Math.round((filled / fields.length) * 100);

  return (
    <div className="dashboard-container">
      <UserSidebar activePage="profile" />

      <main className="main-content">
        <UserNavbar />

        {/* Page header */}
        <div className="mp-header">
          <div>
            <h2 className="mp-page-title">My Profile</h2>
            <p className="mp-page-sub">Manage your personal details and account settings</p>
          </div>
        </div>

        <section className="mp-section">
          {/* ── LEFT COLUMN ── */}
          <div className="mp-left">

            {/* Avatar card */}
            <div className="mp-card mp-avatar-card">
              <div className="mp-avatar-wrap">
                <img
                  src={getAvatarUrl(user?.avatar)}
                  alt="User"
                  className="mp-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=778aff&color=fff&size=200`;
                  }}
                />
                <span className="mp-verified-badge">✔ Verified</span>
                <button className="mp-avatar-cam" title="Change photo">📷</button>
              </div>

              <h3 className="mp-name">{user?.name || "—"}</h3>
              <p className="mp-email">{user?.email || "—"}</p>
              <p className="mp-phone">{user?.phone || "—"}</p>

              <button
                className="mp-edit-btn"
                onClick={() => navigate("/user/edit-profile")}
              >
                ✏️ Edit Profile
              </button>
            </div>

            {/* Profile strength */}
            <div className="mp-card mp-strength-card">
              <div className="mp-strength-row">
                <span className="mp-strength-label">Profile Strength</span>
                <span className="mp-strength-pct">{strength}%</span>
              </div>
              <div className="mp-strength-bar">
                <div className="mp-strength-fill" style={{ width: `${strength}%` }} />
              </div>
              <p className="mp-strength-hint">
                Complete your identity verification to unlock fast-track dispute filing features.
              </p>
            </div>

            {/* Identity verification */}
            <div className="mp-card mp-id-card">
              <p className="mp-id-heading">IDENTITY VERIFICATION</p>

              <div className="mp-id-row">
                <span className="mp-id-icon">🪪</span>
                <div>
                  <p className="mp-id-label">ID Type</p>
                  <p className="mp-id-val">Aadhaar Card (India)</p>
                </div>
              </div>

              <div className="mp-id-row">
                <span className="mp-id-icon">🔢</span>
                <div>
                  <p className="mp-id-label">ID Number</p>
                  <p className="mp-id-val">XXXX-XXXX-1234</p>
                </div>
              </div>

              <div className="mp-id-preview">
                <span className="mp-id-eye">👁️</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="mp-right">

            {/* Personal Information */}
            <div className="mp-card">
              <div className="mp-card-header">
                <div className="mp-card-title-row">
                  <span className="mp-card-icon">ℹ️</span>
                  <h3 className="mp-card-title">Personal Information</h3>
                </div>
                <button
                  className="mp-inline-edit"
                  onClick={() => navigate("/user/edit-profile")}
                >
                  ✏️ Edit
                </button>
              </div>

              <div className="mp-info-grid">
                <div className="mp-info-item">
                  <p className="mp-info-label">FULL NAME</p>
                  <p className="mp-info-val">{user?.name || "—"}</p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">EMAIL ADDRESS</p>
                  <p className="mp-info-val">{user?.email || "—"}</p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">PHONE NUMBER</p>
                  <p className="mp-info-val">{user?.phone ? `+91 ${user.phone}` : "—"}</p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">FATHER/SPOUSE NAME</p>
                  <p className="mp-info-val">{user?.fatherSpouseName || "—"}</p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">DATE OF BIRTH</p>
                  <p className="mp-info-val">
                    {user?.dob
                      ? new Date(user.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
                      : "—"}
                  </p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">GENDER</p>
                  <p className="mp-info-val">{user?.gender || "—"}</p>
                </div>
              </div>

              <div className="mp-divider" />

              <p className="mp-section-sub">CURRENT ADDRESS</p>
              <div className="mp-info-grid" style={{ marginTop: 14 }}>
                <div className="mp-info-item" style={{ gridColumn: "1 / -1" }}>
                  <p className="mp-info-label">ADDRESS LINE 1</p>
                  <p className="mp-info-val">{user?.address || "—"}</p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">CITY</p>
                  <p className="mp-info-val">{user?.city || "—"}</p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">STATE</p>
                  <p className="mp-info-val">{user?.state || "—"}</p>
                </div>
                <div className="mp-info-item">
                  <p className="mp-info-label">PINCODE</p>
                  <p className="mp-info-val">{user?.pincode || "—"}</p>
                </div>
              </div>
            </div>

            {/* Notifications + Security */}
            <div className="mp-bottom-row">

              {/* Notifications */}
              <div className="mp-card mp-notif-card">
                <div className="mp-card-title-row" style={{ marginBottom: 20 }}>
                  <span className="mp-card-icon">🔔</span>
                  <h3 className="mp-card-title">Notifications</h3>
                </div>

                {[
                  { key: "email",    label: "Email Notifications",      sub: "Monthly case reports & legal news" },
                  { key: "sms",      label: "SMS Alerts",                sub: "Critical case filing updates" },
                  { key: "realtime", label: "Real-time Case Updates",    sub: "In-app activity tracking" },
                ].map(({ key, label, sub }) => (
                  <div className="mp-toggle-row" key={key}>
                    <div>
                      <p className="mp-toggle-label">{label}</p>
                      <p className="mp-toggle-sub">{sub}</p>
                    </div>
                    <button
                      className={`mp-toggle ${notifications[key] ? "on" : ""}`}
                      onClick={() => toggleNotif(key)}
                    >
                      <span className="mp-toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Security */}
              <div className="mp-card mp-security-card">
                <div className="mp-card-title-row" style={{ marginBottom: 20 }}>
                  <span className="mp-card-icon">🛡️</span>
                  <h3 className="mp-card-title">Security</h3>
                </div>

                <button className="mp-security-row">
                  <span className="mp-security-label">Change Password</span>
                  <span className="mp-security-arrow">›</span>
                </button>

                <div className="mp-toggle-row" style={{ marginTop: 16 }}>
                  <div>
                    <p className="mp-toggle-label">Two-Factor Auth</p>
                  </div>
                  <button
                    className={`mp-toggle ${twoFactor ? "on" : ""}`}
                    onClick={() => setTwoFactor((p) => !p)}
                  >
                    <span className="mp-toggle-thumb" />
                  </button>
                </div>

                <div className="mp-divider" style={{ margin: "20px 0" }} />

                <button className="mp-logout-other">
                  <span>Logout from other devices</span>
                  <span className="mp-logout-icon">↪</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;
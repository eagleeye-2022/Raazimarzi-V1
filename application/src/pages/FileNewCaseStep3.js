// src/pages/FileNewCaseStep3.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import "./FileNewCase.css";
import "./FileNewCaseStep3.css";

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const getFileIcon = (type) => {
  if (type === "application/pdf") return "📄";
  if (type.startsWith("image/")) return "🖼️";
  return "📎";
};

const formatSize = (bytes) => {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
};

const truncateName = (name, max = 24) =>
  name.length > max ? name.slice(0, max - 3) + "..." : name;

const FileNewCaseStep3 = () => {
  const navigate = useNavigate();
  const inputRef = useRef();

  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  // Restore from localStorage (metadata only — not actual File objects)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("caseData")) || {};
    if (stored.step3Files) setFiles(stored.step3Files);
  }, []);

  const persistMeta = (list) => {
    const meta = list.map(({ name, size, type, status }) => ({ name, size, type, status }));
    const existing = JSON.parse(localStorage.getItem("caseData")) || {};
    localStorage.setItem("caseData", JSON.stringify({ ...existing, step3Files: meta }));
  };

  const addFiles = (incoming) => {
    setError("");
    const valid = [];
    for (const f of incoming) {
      if (!ACCEPTED.includes(f.type)) {
        setError(`"${f.name}" is not supported. Use PDF, JPG, or PNG.`);
        continue;
      }
      if (f.size > MAX_SIZE) {
        setError(`"${f.name}" exceeds 10 MB limit.`);
        continue;
      }
      if (files.find((x) => x.name === f.name && x.size === f.size)) continue;
      valid.push({ name: f.name, size: f.size, type: f.type, status: "Complete" });
    }
    const updated = [...files, ...valid];
    setFiles(updated);
    persistMeta(updated);
  };

  const removeFile = (idx) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    persistMeta(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleBrowse = (e) => {
    addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleSaveDraft = () => {
    persistMeta(files);
    alert("Draft saved!");
  };

  const handleNext = () => {
    persistMeta(files);
    navigate("/user/file-new-case/step4");
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
                  step < 3 ? "completed" : step === 3 ? "active" : ""
                }`}
              >
                <div className="fnc-step-icon">
                  {step < 3 ? "✓" : icon}
                </div>
                <span>{label}</span>
              </div>
              {i < 3 && (
                <div className={`fnc-step-line ${step < 3 ? "completed" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="fnc-body">
          <h2 className="fnc-title">Upload Documents</h2>
          <p className="fnc-subtitle">
            Support your case with relevant documents, images, or records. This information remains confidential within the sanctuary.
          </p>

          {/* Info banner */}
          <div className="s3-info-banner">
            <span className="s3-banner-icon">❗</span>
            <p>
              "Please upload a valid ID proof (Aadhaar, PAN, or Driving License) of petitioner. Aadhaar is recommended for faster verification."
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className={`s3-dropzone ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: "none" }}
              onChange={handleBrowse}
            />

            <div className="s3-drop-icon-wrap">
              <span className="s3-drop-icon">📁</span>
            </div>
            <p className="s3-drop-title">Drag and drop files here</p>
            <p className="s3-drop-sub">Supports PDF, JPG, and PNG files to build your case foundation.</p>

            <button
              className="s3-browse-btn"
              onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
            >
              + Browse
            </button>

            <p className="s3-drop-limit">Maximum file size: 10MB</p>
          </div>

          {/* Error */}
          {error && <p className="s3-error">{error}</p>}

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="s3-files-section">
              <h3 className="s3-files-heading">Uploaded Files ({files.length})</h3>
              <div className="s3-files-grid">
                {files.map((f, idx) => (
                  <div className="s3-file-card" key={idx}>
                    <div className="s3-file-icon-wrap">
                      <span className="s3-file-icon">{getFileIcon(f.type)}</span>
                    </div>
                    <div className="s3-file-info">
                      <span className="s3-file-name">{truncateName(f.name)}</span>
                      <span className="s3-file-meta">
                        {formatSize(f.size)} • {f.status}
                      </span>
                    </div>
                    <button
                      className="s3-file-delete"
                      onClick={() => removeFile(idx)}
                      title="Remove file"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="fnc-footer">
          <button className="fnc-draft-btn" onClick={handleSaveDraft}>
            ⊞ Save as Draft
          </button>
          
          <button
            className="fnc-cancel-btn"
            onClick={() => navigate("/user/file-new-case/step2")}
          >
            ← Back
          </button>
          <button className="fnc-next-btn" style={{ marginLeft: "auto" }} onClick={handleNext}>
            Continue to Review →
          </button>
        </div>
      </section>
    </div>
  );
};

export default FileNewCaseStep3;
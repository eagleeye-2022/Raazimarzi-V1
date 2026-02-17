// src/pages/UploadEvidence.js
import { useState } from "react";
import api from "../api/axios";

export default function UploadEvidence({ caseId }) {
  const [evidence, setEvidence] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!evidence.trim()) {
      setMessage("Evidence cannot be empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role"); 

      const res = await api.put(
        `/${role}/cases/${caseId}/evidence`,
        { evidence },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Evidence uploaded successfully");
      setEvidence("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h3>Upload Evidence</h3>
      <form onSubmit={handleUpload}>
        <textarea
          placeholder="Enter your evidence details"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}

// src/pages/UploadEvidence.js
import { useState } from "react";
import api from "../api/axios";

export default function UploadEvidence({ caseId }) {
  const [evidence, setEvidence] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role"); //  dynamic (party1 or party2)

      const res = await api.put(
        `/${role}/cases/${caseId}/evidence`, //  auto-switches between party1/party2
        { evidence },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
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
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

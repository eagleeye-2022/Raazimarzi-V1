// src/pages/CreateCase.js
import { useState } from "react";
import api from "../api/axios";

export default function CreateCase() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role"); // 👈 party1 or party2

    const res = await api.post(
  `/${role}/cases`,
  { title, description },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

setMessage(`Case "${res.data.title}" created successfully ✅`);


      setMessage("Case created successfully ✅");
      setTitle("");
      setDescription("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Case creation failed ❌");
    }
  };

  return (
    <div className="case-container">
      <h2>Create a New Case</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Case Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Case Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Create Case</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

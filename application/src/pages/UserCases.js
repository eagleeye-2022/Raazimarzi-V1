"use client";

import React, { useEffect, useState } from "react";
import { createCase, getMyCases } from "../services/userservice";

function Party1Cases() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cases on mount
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyCases();
      setCases(data);
    } catch (err) {
      console.error("❌ Failed to fetch cases:", err);
      setError("Failed to load cases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    try {
      await createCase(form);
      setForm({ title: "", description: "" });
      fetchCases(); // Refresh list
    } catch (err) {
      console.error("❌ Failed to create case:", err);
      setError("Failed to create case. Please try again.");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading cases...</p>;

  return (
    <div className="party1-cases">
      <h1>My Cases</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit">Add Case</button>
      </form>

      <ul>
        {cases.length === 0 ? (
          <li>No cases found.</li>
        ) : (
          cases.map((c) => (
            <li key={c._id}>
              <strong>{c.title}</strong>: {c.description}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Party1Cases;

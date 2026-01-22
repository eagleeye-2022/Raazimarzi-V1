import React, { useEffect, useState } from "react";
import { createCase, getMyCases } from "../services/userservice";

function Party1Cases() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const data = await getMyCases();
      setCases(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCase(form);
      setForm({ title: "", description: "" });
      fetchCases(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>My Cases</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add Case</button>
      </form>

      <ul>
        {cases.map((c) => (
          <li key={c._id}>
            <strong>{c.title}</strong>: {c.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cases;

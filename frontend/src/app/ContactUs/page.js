"use client";
import { useState } from "react";
import "@/styles/contact.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted successfully!");
  };

  return (
    <section className="contact-wrapper">
      <div className="contact-card">
        {/* Logo */}
        <img
          src="/assets/images/logo.png"
          alt="RaaziMarzi"
          className="contact-logo"
        />

        <h2>Let’s Connect and Get Solution..!</h2>
        <p className="sub-text">Your solution is awaits for you.</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">✉️</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">📱</span>
            <input
              type="tel"
              name="phone"
              placeholder="Phone no."
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn">
            Get Solution
          </button>
        </form>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/aboutUs.css";
import Link from "next/link";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("Cases");

  const tabs = [
    "Cases",
    "Money",
    "Policies",
    "Resolve Cases",
    "Victory %",
    "Ordinary",
  ];

  const questions = [
    "What should I do if I think the contract has been breached?",
    "How do I resolve disputes with landlords or tenants?",
    "Can small business disputes be resolved online?",
    "What documents are required for filing a complaint?",
    "How long does it take to resolve a dispute online?",
  ];

  // Use environment variable for base URL in production
  const APP_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="about-hero-exact">
        <img src="/assets/icons/left-circle.png" alt="" className="about-circle left" />
        <img src="/assets/icons/right-circle.png" alt="" className="about-circle right" />

        <div className="about-hero-content">
          <span className="about-pill">About Us</span>

          <h1>
            Empowering <span className="highlight">Fair & Fast</span> Online <br />
            Dispute Resolution
          </h1>

          <p>
            RaaziMarzi is an ODR platform helping individuals, businesses, and
            professionals resolve disputes quickly and transparently.
          </p>

          <div className="about-hero-buttons">
            <button
              className="btn-primary"
              onClick={() =>
                (window.location.href = `${APP_BASE_URL}/login?redirect=/user/file-new-case/step1`)
              }
            >
              File A Case
            </button>

            <Link href="/ContactUs" className="btn-dark">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story-exact">
        <div className="about-story-box">
          <h2>Our Story</h2>
          <p className="story-subtitle">The story you should know</p>

          <div className="story-grid-exact">
            {[
              {
                title: "Why was RaaziMarzi created?",
                items: [
                  "To solve the growing problem of delayed justice and overloaded courts in India.",
                  "To provide a simple, accessible, and affordable way for people to resolve their disputes.",
                  "To eliminate stress, paperwork, and long waiting periods for common disputes.",
                ],
              },
              {
                title: "What problem do we aim to solve?",
                items: [
                  "Traditional legal processes are slow, expensive, and confusing for most individuals and businesses.",
                  "Most disputes are small but still end up taking months or years to resolve.",
                  "People hesitate to take legal action due to lack of guidance and high costs.",
                ],
              },
              {
                title: "What inspired the idea of an Online Dispute Resolution platform?",
                items: [
                  "The rising need for digital solutions in legal services.",
                  "Government push towards ODR and online justice systems.",
                  "A vision to modernize justice and make it as simple as filing a complaint online.",
                ],
              },
              {
                title: "Who is RaaziMarzi built for?",
                items: [
                  "Anyone who wants fair, fast, and stress-free conflict resolution.",
                  "Individuals who face consumer, rental, employment, or money recovery disputes.",
                  "Small businesses & startups who want quick business resolution.",
                  "Professionals and partners dealing with contract or partnership disputes.",
                ],
              },
            ].map(({ title, items }) => (
              <div key={title} className="story-item">
                <h4>{title}</h4>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="about-mv">
        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-image">
              <img src="/assets/images/mission.png" alt="Mission" />
            </div>
            <h4>Our Mission</h4>
            <p>
              To simplify dispute resolution through technology, making justice accessible, affordable, and efficient.
            </p>
          </div>

          <div className="mv-card">
            <div className="mv-image">
              <img src="/assets/images/vision-1.png" alt="Vision" />
            </div>
            <h4>Our Vision</h4>
            <p>
              Building India’s most trusted online ecosystem for resolving disputes without stress or delays.
            </p>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <section className="what-we-do-exact">
        <div className="what-we-do-container">
          <div className="what-we-do-image">
            <img src="/assets/images/CD.png" alt="What RaaziMarzi Do" />
          </div>

          <div className="what-we-do-content">
            <h3>What RaaziMarzi Do?</h3>
            <div className="what-we-do-list">
              {[
                "Consumer Disputes",
                "Property & Rental Disputes",
                "Contract Disputes",
                "Partnership Disputes",
              ].map((item) => (
                <div key={item} className="what-we-do-item">
                  <div>
                    <h4>{item}</h4>
                    <p>When one party fails to fulfil their contractual obligations...</p>
                  </div>
                  <span className="what-we-do-arrow">›</span>
                </div>
              ))}
            </div>
            <button className="what-we-do-btn">See More</button>
          </div>
        </div>
      </section>

      {/* Our Value */}
      <section className="our-value-exact">
        <div className="our-value-container">
          <h2>Our Value</h2>
          <p className="our-value-sub">The story you should know</p>

          <div className="our-value-grid">
            {["Responsibility","Integrity","Transparency","Empathy","Innovation","Security"].map((item) => (
              <div key={item} className="our-value-item">
                <div className="our-value-circle">
                  <img src={`/assets/icons/${item}.png`} alt={item} />
                </div>
                <p className="our-value-label">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="team-exact">
        <div className="team-container">
          <h2>Meet Our Team</h2>
          <p className="team-sub">The story you should know</p>

          <div className="team-grid-exact">
            {[1, 2, 3].map((i) => (
              <div key={i} className="team-card-exact">
                <div className="team-image-exact" />
                <div className="team-info-exact">
                  <span>Founders</span>
                  <h4>Mr. Jaideep Singh</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="cd-why-exact">
        <div className="cd-container">
          <h2>Why Choose Us</h2>
          <p className="cd-why-sub">
            Resolve business, customer, or personal conflicts through a secure,
            transparent online platform.
          </p>

          <div className="cd-why-grid">
            {[
              ["Fast.png", "Fast Resolution"],
              ["Legally.png", "Legally Compliant"],
              ["Secure.png", "Secure & Confidential"],
              ["Neutral.png", "Neutral Experts"],
              ["24.png", "24/7 Access"],
            ].map(([icon, title]) => (
              <div key={title} className="cd-why-item">
                <img src={`/assets/icons/${icon}`} alt={title} />
                <h4>{title}</h4>
                <p>
                  Resolve business, customer, or personal conflicts through a secure.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="pd-container">
          <h2 className="faq-title">Frequently Asked Questions (FAQ)</h2>
          <p className="faq-subtitle">
            Resolve business, customer, or personal conflicts through a secure,
            transparent online platform.
          </p>

          <div className="faq-container">
            <div className="faq-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`faq-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="faq-list">
              {questions.map((q, index) => (
                <div key={index} className="faq-item">
                  <span>{q}</span>
                  <span className="faq-arrow">›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

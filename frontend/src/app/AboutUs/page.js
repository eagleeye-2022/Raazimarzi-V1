"use client";
import React from "react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/aboutUs.css";

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
      "What should I do if I think the contract has been breached?",
      "What should I do if I think the contract has been breached?",
      "What should I do if I think the contract has been breached?",
      "What should I do if I think the contract has been breached?",
    ];
  
  return (
    <>
      <Header />
{/*Hero*/}
      <section className="about-hero-exact">
    {/* Left circle */}
  <img
    src="/assets/icons/left circle.png"
    alt=""
    className="about-circle left"
  />

  {/* Right circle */}
  <img
    src="/assets/icons/right circle.png"
    alt=""
    className="about-circle right"
  />


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
      <button className="btn-primary">File A Case</button>
      <button className="btn-dark">Contact Us</button>
    </div>
  </div>
</section>

      {/* OUR STORY */}
<section className="about-story-exact">
  <div className="about-story-box">
    <h2>Our Story</h2>
    <p className="story-subtitle">The story you should know</p>

    <div className="story-grid-exact">
      {/* Box 1 */}
      <div className="story-item">
        <h4>Why was RaaziMarzi created?</h4>
        <ul>
          <li>
            To solve the growing problem of delayed justice and overloaded
            courts in India.
          </li>
          <li>
            To provide a simple, accessible, and affordable way for people to
            resolve their disputes.
          </li>
          <li>
            To eliminate stress, paperwork, and long waiting periods for common
            disputes.
          </li>
        </ul>
      </div>

      {/* Box 2 */}
      <div className="story-item">
        <h4>What problem do we aim to solve?</h4>
        <ul>
          <li>
            Traditional legal processes are slow, expensive, and confusing for
            most individuals and businesses.
          </li>
          <li>
            Most disputes are small but still end up taking months or years to
            resolve.
          </li>
          <li>
            People hesitate to take legal action due to lack of guidance and
            high costs.
          </li>
        </ul>
      </div>

      {/* Box 3 */}
      <div className="story-item">
        <h4>
          What inspired the idea of an Online Dispute Resolution platform?
        </h4>
        <ul>
          <li>The rising need for digital solutions in legal services.</li>
          <li>
            Government push towards ODR and online justice systems.
          </li>
          <li>
            A vision to modernize justice and make it as simple as filing a
            complaint online.
          </li>
        </ul>
      </div>

      {/* Box 4 */}
      <div className="story-item">
        <h4>Who is RaaziMarzi built for?</h4>
        <ul>
          <li>
            Anyone who wants fair, fast, and stress-free conflict resolution.
          </li>
          <li>
            Individuals who face consumer, rental, employment, or money recovery
            disputes.
          </li>
          <li>
            Small businesses & startups who want quick business resolution.
          </li>
          <li>
            Professionals and partners dealing with contract or partnership
            disputes.
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>


      {/* MISSION & VISION */}
      <section className="about-mv">
        <div className="about-container mv-grid">
          <div className="mv-card">
            <img src="/assets/images/mission.png" alt="Mission" />
            <h4>Our Mission</h4>
            <p>
              To simplify dispute resolution through technology, making justice
              accessible, affordable, and efficient.
            </p>
          </div>

          <div className="mv-card">
            <img src="/assets/images/vision (1).png" alt="Vision" />
            <h4>Our Vision</h4>
            <p>
              Building India’s most trusted online ecosystem for resolving
              disputes without stress or delays.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO – IMAGE EXACT SECTION */}
<section className="what-we-do-exact">
  <div className="what-we-do-container">
    
    {/* Left Image */}
    <div className="what-we-do-image">
      <img src="/assets/images/CD.png" alt="What RaaziMarzi Do" />
    </div>

    {/* Right Content */}
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

     {/* OUR VALUE – ICON CIRCLE SECTION */}
<section className="our-value-exact">
  <div className="our-value-container">
    <h2>Our Value</h2>
    <p className="our-value-sub">The story you should know</p>

    <div className="our-value-grid">
      {[
        "Responsibility",
        "Integrity",
        "Transparency",
        "Empathy",
        "Innovation",
        "Security",
      ].map((item) => (
        <div key={item} className="our-value-item">
          <div className="our-value-circle">
            <img
              src={`/assets/icons/${item}.png`}
              alt={item}
            />
          </div>
          <p className="our-value-label">{item}</p>
        </div>
      ))}
    </div>
  </div>
</section>

     {/* MEET OUR TEAM – EXACT SECTION */}
<section className="team-exact">
  <div className="team-container">
    <h2>Meet Our Team</h2>
    <p className="team-sub">The story you should know</p>

    <div className="team-grid-exact">
      {[1, 2, 3].map((i) => (
        <div key={i} className="team-card-exact">
          {/* Image Placeholder */}
          <div className="team-image-exact" />

          {/* Content */}
          <div className="team-info-exact">
            <span>Founders</span>
            <h4>Mr. Jaideep Singh</h4>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

   {/* WHY CHOOSE US */}
<section className="cd-why-exact">
  <div className="cd-container">
    <h2>Why Choose Us</h2>
    <p className="cd-why-sub">
      Resolve business, customer, or personal conflicts through a secure,
      transparent online platform.
    </p>

    <div className="cd-why-grid">
      <div className="cd-why-item">
        <img src="/assets/icons/Fast.png" alt="Fast Resolution" />
        <h4>Fast Resolution</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="cd-why-item">
        <img src="/assets/icons/Legally.png" alt="Legally Compliant" />
        <h4>Legally Compliant</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="cd-why-item">
        <img src="/assets/icons/Secure.png" alt="Secure & Confidential" />
        <h4>Secure & Confidential</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="cd-why-item">
        <img src="/assets/icons/Neutral.png" alt="Neutral Experts" />
        <h4>Neutral Experts</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="cd-why-item">
        <img src="/assets/icons/24.png" alt="24/7 Access" />
        <h4>24/7 Access</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>
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
            {/* Tabs */}
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

            {/* FAQ Questions */}
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

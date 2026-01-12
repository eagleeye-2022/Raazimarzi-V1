"use client";
import React from "react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/partnershipDisputes.css";


export default function PartnershipDisputes() {
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
      
 {/* HERO */}

<section className="cd-hero-exact">
  {/* Decorative Circles*/}
  <img
    src="/assets/icons/left circle.png"
    alt=""
    className="figma-circle left"
  />

  <img
    src="/assets/icons/right circle.png"
    alt=""
    className="figma-circle right"
  />
  {/* Glow behind heading */}
  <div className="hero-glow"></div>

  <div className="cd-hero-content">
    <span className="cd-pill-exact">Partnership Disputes</span>

    <h1>
      Resolve<span className="highlight">Partnership</span> Disputes <br />
      <span className="highlight-light">Quickly</span> & professionally
    </h1>

    <p>
      Streamline conflict resolution between business partners with our efficient Online Dispute Resolution platform.
    </p>

    <div className="hero-buttons">
      <button className="btn-primary-exact">File A Case</button>
      <button className="btn-dark-exact">Talk To Expert</button>
    </div>
  </div>
</section>
      {/* WHAT ARE PARTNERSHIP DISPUTES */}
      <section className="pd-diagonal">
        <div className="pd-container pd-diagonal-inner">

          <div className="pd-diagonal-img">
            <img src="/assets/images/PD 1.png" alt="Partnership discussion" />
          </div>

          <div className="pd-diagonal-text">
            <h2>What Are Partnership Disputes?</h2>
            <p>
              Partnership disputes occur when partners disagree on finances, responsibilities, business decisions, or the direction of the company. These conflicts can impact performance, trust, and long-term growth. Our platform helps partners resolve conflicts privately, fairly, and without lengthy court battles. Partnership disputes occur when partners disagree on finances, responsibilities, business decisions, or the direction of the company. These conflicts can impact performance, trust, and long-term growth. Our platform helps partners resolve conflicts privately, fairly, and without lengthy court battles.
            </p>
          </div>

        </div>
      </section>

      {/* COMMON PARTNERSHIP DISPUTE ISSUES */}
      <section className="pd-diagonal reverse">
        <div className="pd-container pd-diagonal-inner">

          <div className="pd-diagonal-img">
            <img src="/assets/images/PD 2.png" alt="Business dispute discussion" />
          </div>

          <div className="pd-diagonal-text">
            <h2>Common Partnership Dispute Issues?</h2>
            <p>
           Partnership disputes occur when partners disagree on finances, responsibilities, business decisions, or the direction of the company. These conflicts can impact performance, trust, and long-term growth. Our platform helps partners resolve conflicts privately, fairly, and without lengthy court battles. Partnership disputes occur when partners disagree on finances, responsibilities, business decisions, or the direction of the company. These conflicts can impact performance, trust, and long-term growth. Our platform helps partners resolve conflicts privately, fairly, and without lengthy court battles.
            </p>
          </div>

        </div>
      </section>


      {/* WHY PARTNERSHIP DISPUTES OCCUR */}
      <section className="pd-occur-exact">
        <div className="pd-occur-wrapper">
          <h2>Why Partnership Disputes Occur?</h2>
          <p className="pd-occur-sub">
            Streamline conflict resolution between business partners with our
            efficient Online Dispute Resolution platform.
          </p>

          <div className="pd-occur-cards">
            <div className="pd-occur-card">
              <img src="/assets/icons/Lack.png" alt="Lack of clarity" />
              <p>Lack of clarity in partnership agreement</p>
            </div>

            <div className="pd-occur-card">
              <img src="/assets/icons/Financial.png" alt="Financial issues" />
              <p>Financial transparency issues</p>
            </div>

            <div className="pd-occur-card">
              <img src="/assets/icons/Differences.png" alt="Differences" />
              <p>Differences in vision or leadership style</p>
            </div>

            <div className="pd-occur-card">
              <img src="/assets/icons/Poor.png" alt="Documentation" />
              <p>Poor documentation & Delayed</p>
            </div>

            <div className="pd-occur-card">
              <img src="/assets/icons/Mistrust.png" alt="Mistrust" />
              <p>Mistrust or miscommunication</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP DISAGREEMENTS */}
      <section className="pd-disagree">
        <div className="pd-container pd-disagree-grid">

          {/* Left Image */}
          <div className="pd-disagree-img">
            <img src="/assets/images/CD.png" alt="Partnership disagreement" />
          </div>

          {/* Right Content */}
          <div className="pd-disagree-content">
            <h3>Partnership disagreements</h3>

            <div className="pd-disagree-item active">
              <div>
                <h4>Franchise Agreement Disputes</h4>
                <p>When one party fails to fulfill their contractual obligations...</p>
              </div>
              <span className="pd-arrow">›</span>
            </div>

            <div className="pd-disagree-item">
              <div>
                <h4>Real Estate / Commercial & Contract Disputes</h4>
                <p>When one party fails to fulfill their contractual obligations...</p>
              </div>
              <span className="pd-arrow">›</span>
            </div>

            <div className="pd-disagree-item">
              <div>
                <h4>Profit-sharing disputes</h4>
                <p>When one party fails to fulfill their contractual obligations...</p>
              </div>
              <span className="pd-arrow">›</span>
            </div>

            <div className="pd-disagree-item">
              <div>
                <h4>Business dissolution disputes</h4>
                <p>When one party fails to fulfill their contractual obligations...</p>
              </div>
              <span className="pd-arrow">›</span>
            </div>

            <button className="pd-see-more">See More</button>
          </div>

        </div>
      </section>


      {/* TYPES OF PARTNERSHIP DISPUTES */}
      <section className="types-disputes-section">
        <div className="types-container">
          <h2>Types of Partnership Disputes</h2>
          <p className="types-subtitle">Common Employment Conflicts We Handle</p>

          <div className="types-grid">
            <div className="types-card">
              <img src="/assets/icons/Profit.png" alt="Profit Sharing" />
              <div className="types-content">
                <h4>Profit-Sharing Disputes</h4>
                <p>
                  Conflicts about how profits or losses should be distributed among
                  partners.
                </p>
              </div>
            </div>


            <div className="types-card">
              <img src="/assets/icons/Decision.png" alt="Decision Making" />
              <div className="types-content">
                <h4>Decision-Making Conflicts</h4>
                <p>
                  Disagreements on business decisions, strategies, or direction of the
                  company.
                </p>
              </div>
            </div>


            <div className="types-card">
              <img src="/assets/icons/Breach.png" alt="Breach" />
              <div className="types-content">
                <h4>Breach of Partnership Agreement</h4>
                <p>
                  When a partner violates the agreed terms (roles, responsibilities,
                  duties, or conditions).
                </p>
              </div>
            </div>


            <div className="types-card">
              <img src="/assets/icons/Mismanagement.png" alt="Mismanagement" />
              <div className="types-content">
                <h4>Mismanagement or Negligence</h4>
                <p>
                  A partner failing to perform duties properly, causing financial or
                  reputational harm.
                </p>
              </div>
            </div>

            <div className="types-card">
              <img src="/assets/icons/Capital.png" alt="Capital Contribution" />
              <div className="types-content">
                <h4>Capital Contribution Disputes</h4>
                <p>
                  Issues about how much money each partner contributed or should
                  contribute to the business.
                </p>
              </div>
            </div>


            <div className="types-card">
              <img src="/assets/icons/Misuse.png" alt="Misuse Funds" />
              <div className="types-content">
                <h4>Misuse of Partnership Funds</h4>
                <p>
                  A partner using company money for personal benefits or without
                  authorization.
                </p>
              </div>
            </div>


            <div className="types-card">
              <img src="/assets/icons/Role.png" alt="Role Conflict" />
              <div className="types-content">
                <h4>Role & Responsibility Conflicts</h4>
                <p>
                  Arguments over unclear or unequal distribution of tasks between
                  partners.
                </p>
              </div>
            </div>

            <div className="types-card">
              <img src="/assets/icons/Authority.png" alt="Authority" />
              <div className="types-content">
                <h4>Authority Disputes</h4>
                <p>
                  When partners disagree over who has the right to make certain
                  decisions.
                </p>
              </div>
            </div>

            <div className="types-card">
              <img src="/assets/icons/Fraud.png" alt="Fraud" />
              <div className="types-content">
                <h4>Fraud or Misrepresentation</h4>
                <p>
                  One partner hiding information, falsifying accounts, or misleading
                  others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
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


      <section className="contract-cta">
  <div className="contract-cta-box">

    {/* LEFT CONTENT */}
    <div className="contract-cta-content">
      <h2>Protect Your Business. Preserve Relationships..</h2>

      <p>
        Handle partnership conflicts professionally with structured online dispute resolution guided by experienced legal experts.
      </p>

      <div className="contract-cta-buttons">
        <button className="cta-primary">File A Case</button>
        <button className="cta-secondary">Talk to Expert</button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="contract-cta-image">
      <img src="/assets/images/relationships.png" alt="Contract Resolution" />
    </div>

  </div>
</section>

      <Footer />
    </>
  );
}

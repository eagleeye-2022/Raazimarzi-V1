"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/partnershipDisputes.css";

export default function PartnershipDisputes() {
  const [activeTab, setActiveTab] = useState("Cases");
  const router = useRouter();

  const tabs = [
    "Cases",
    "Money",
    "Policies",
    "Resolve Cases",
    "Victory %",
    "Ordinary",
  ];

  const questions = [
    "How do I handle disagreements in profit-sharing?",
    "What if a partner violates the partnership agreement?",
    "Can partnership disputes be resolved without court?",
    "How long does it take to resolve disputes?",
    "What evidence is needed for a partnership dispute?",
  ];

  const APP_PATH = "/app"; // ✅ centralized base path

  function AccordionItem({ title }) {
    const [open, setOpen] = useState(false);

    return (
      <div className={`pd-accordion-item ${open ? "open" : ""}`}>
        <div className="pd-accordion-header" onClick={() => setOpen(!open)}>
          <div>
            <h4>{title}</h4>
            <p>When one party fails to fulfill their partnership obligations...</p>
          </div>
          <span className="pd-accordion-arrow">›</span>
        </div>

        {open && (
          <div className="pd-accordion-body">
            Detailed explanation about {title.toLowerCase()} and how we help
            resolve such disputes efficiently.
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="cd-hero-exact">
        <img src="/assets/icons/left-circle.png" alt="" className="figma-circle left" />
        <img src="/assets/icons/right-circle.png" alt="" className="figma-circle right" />
        <div className="hero-glow"></div>

        <div className="cd-hero-content">
          <span className="cd-pill-exact">Partnership Disputes</span>

          <h1>
            Resolve <span className="highlight">Partnership</span> Disputes <br />
            <span className="highlight-light">Quickly</span> & Professionally
          </h1>

          <p>
            Streamline conflict resolution between business partners with our efficient Online Dispute Resolution platform.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() =>
                router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/file-new-case/step1`)
              }
            >
              File A Case
            </button>
            <button
              className="btn-dark-exact"
              onClick={() =>
                router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/chats`)
              }
            >
              Talk To Expert
            </button>
          </div>
        </div>
      </section>

      {/* WHAT ARE PARTNERSHIP DISPUTES */}
      <section className="pd-diagonal">
        <div className="pd-container pd-diagonal-inner">
          <div className="pd-diagonal-img">
            <img src="/assets/images/pd-1.png" alt="Partnership discussion" />
          </div>

          <div className="pd-diagonal-text">
            <h2>What Are Partnership Disputes?</h2>
            <p>
              Partnership disputes occur when partners disagree on finances, responsibilities, business decisions, or the direction of the company. These conflicts can impact performance, trust, and long-term growth. Our platform helps partners resolve conflicts privately, fairly, and without lengthy court battles.
            </p>
          </div>
        </div>
      </section>

      {/* COMMON PARTNERSHIP DISPUTE ISSUES */}
      <section className="pd-diagonal reverse">
        <div className="pd-container pd-diagonal-inner">
          <div className="pd-diagonal-img">
            <img src="/assets/images/pd-2.png" alt="Business dispute discussion" />
          </div>

          <div className="pd-diagonal-text">
            <h2>Common Partnership Dispute Issues</h2>
            <p>
              Partners may disagree on finances, responsibilities, or business decisions. These disputes can affect performance, trust, and long-term growth. Our platform helps partners resolve conflicts privately, fairly, and efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* WHY PARTNERSHIP DISPUTES OCCUR */}
      <section className="pd-occur-exact">
        <div className="pd-occur-wrapper">
          <h2>Why Partnership Disputes Occur?</h2>

          <p className="pd-occur-sub">
            Streamline conflict resolution between business partners with our efficient
            Online Dispute Resolution platform.
          </p>

          <div className="pd-occur-cards">

            <div className="pd-occur-card">
              <img
                src="/assets/icons/lack.png"
                alt="Lack of clarity in partnership agreement"
              />
              <p>Lack of clarity in partnership agreement</p>
            </div>

            <div className="pd-occur-card">
              <img
                src="/assets/icons/financial.png"
                alt="Financial transparency issues"
              />
              <p>Financial transparency issues</p>
            </div>

            <div className="pd-occur-card">
              <img
                src="/assets/icons/differences.png"
                alt="Differences in vision or leadership style"
              />
              <p>Differences in vision or leadership style</p>
            </div>

            <div className="pd-occur-card">
              <img
                src="/assets/icons/poor.png"
                alt="Poor documentation & delayed decisions"
              />
              <p>Poor documentation & delayed decisions</p>
            </div>

            <div className="pd-occur-card">
              <img
                src="/assets/icons/mistrust.png"
                alt="Mistrust or miscommunication"
              />
              <p>Mistrust or miscommunication</p>
            </div>

          </div>
        </div>
      </section>

      {/* PARTNERSHIP DISAGREEMENTS */}
      <section className="pd-disagree">
        <div className="pd-container pd-disagree-grid">
          <div className="pd-disagree-img">
            <img src="/assets/images/cd.png" alt="Partnership disagreement" />
          </div>

          <div className="pd-disagree-content">
            <h3>Partnership disagreements</h3>

            {[
              "Franchise Agreement Disputes",
              "Real Estate / Commercial & Contract Disputes",
              "Profit-sharing disputes",
              "Business dissolution disputes",
            ].map((title) => (
              <div className="pd-disagree-item" key={title}>
                <div>
                  <h4>{title}</h4>
                  <p>When one party fails to fulfill their contractual obligations...</p>
                </div>
                <span className="pd-arrow">›</span>
              </div>
            ))}

            <button className="pd-see-more">See More</button>
          </div>
        </div>
      </section>

      {/* TYPES OF PARTNERSHIP DISPUTES */}
      <section className="types-disputes-section">
        <div className="types-container">
          <h2>Types of Partnership Disputes</h2>
          <p className="types-subtitle">Common Issues We Handle</p>

          <div className="types-grid">
            {[
              ["Profit.png", "Profit-Sharing Disputes", "Conflicts about how profits or losses should be distributed among partners."],
              ["Decision.png", "Decision-Making Conflicts", "Disagreements on business decisions, strategies, or direction of the company."],
              ["Breach.png", "Breach of Partnership Agreement", "When a partner violates the agreed terms (roles, responsibilities, duties, or conditions)."],
              ["Mismanagement.png", "Mismanagement or Negligence", "A partner failing to perform duties properly, causing financial or reputational harm."],
              ["Capital.png", "Capital Contribution Disputes", "Issues about how much money each partner contributed or should contribute to the business."],
              ["Misuse.png", "Misuse of Partnership Funds", "A partner using company money for personal benefits or without authorization."],
              ["Role.png", "Role & Responsibility Conflicts", "Arguments over unclear or unequal distribution of tasks between partners."],
              ["Authority.png", "Authority Disputes", "When partners disagree over who has the right to make certain decisions."],
              ["Fraud.png", "Fraud or Misrepresentation", "One partner hiding information, falsifying accounts, or misleading others."],
            ].map(([icon, title, desc]) => (
              <div className="types-card" key={title}>
                <img src={`/assets/icons/${icon}`} alt={title} />
                <div className="types-content">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="pd-container">
          <h2 className="faq-title">Frequently Asked Questions (FAQ)</h2>

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
      </section>

      {/* CTA */}
      <section className="contract-cta">
        <div className="contract-cta-box">
          <div className="contract-cta-content">
            <h2>Protect Your Business. Preserve Relationships.</h2>
            <p>
              Handle partnership conflicts professionally with structured online dispute resolution guided by experienced legal experts.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() =>
                  router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/file-new-case/step1`)
                }
              >
                File A Case
              </button>
              <button
                className="cta-secondary"
                onClick={() =>
                  router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/chats`)
                }
              >
                Talk To Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img src="/assets/images/relationships.png" alt="Business relationship protection" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

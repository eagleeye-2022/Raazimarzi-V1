"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/partnershipDisputes.css";

export default function PartnershipDisputes() {
  const [activeTab, setActiveTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

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

  const partnershipDisagreements = [
    "Franchise Agreement Disputes",
    "Real Estate / Commercial & Contract Disputes",
    "Profit-sharing disputes",
    "Business dissolution disputes",
  ];

  const whyDisputesOccur = [
    { icon: "lack.png", text: "Lack of clarity in partnership agreement" },
    { icon: "financial.png", text: "Financial transparency issues" },
    { icon: "differences.png", text: "Differences in vision or leadership style" },
    { icon: "poor.png", text: "Poor documentation & delayed decisions" },
    { icon: "mistrust.png", text: "Mistrust or miscommunication" },
  ];

  const disputeTypes = [
    {
      icon: "Profit.png",
      title: "Profit-Sharing Disputes",
      desc: "Conflicts about how profits or losses should be distributed among partners.",
    },
    {
      icon: "Decision.png",
      title: "Decision-Making Conflicts",
      desc: "Disagreements on business decisions, strategies, or direction of the company.",
    },
    {
      icon: "Breach.png",
      title: "Breach of Partnership Agreement",
      desc: "When a partner violates the agreed terms (roles, responsibilities, duties, or conditions).",
    },
    {
      icon: "Mismanagement.png",
      title: "Mismanagement or Negligence",
      desc: "A partner failing to perform duties properly, causing financial or reputational harm.",
    },
    {
      icon: "Capital.png",
      title: "Capital Contribution Disputes",
      desc: "Issues about how much money each partner contributed or should contribute to the business.",
    },
    {
      icon: "Misuse.png",
      title: "Misuse of Partnership Funds",
      desc: "A partner using company money for personal benefits or without authorization.",
    },
    {
      icon: "Role.png",
      title: "Role & Responsibility Conflicts",
      desc: "Arguments over unclear or unequal distribution of tasks between partners.",
    },
    {
      icon: "Authority.png",
      title: "Authority Disputes",
      desc: "When partners disagree over who has the right to make certain decisions.",
    },
    {
      icon: "Fraud.png",
      title: "Fraud or Misrepresentation",
      desc: "One partner hiding information, falsifying accounts, or misleading others.",
    },
  ];

  /* NAVIGATE TO REACT APP */
  const navigateToApp = useCallback((path = "/login", queryParams = {}) => {
    try {
      const searchParams = new URLSearchParams(queryParams);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
      const appUrl = `${APP_BASE_PATH}${path}${query}`;
      window.location.href = appUrl;
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = `${APP_BASE_PATH}/login`;
    }
  }, []);

  /* FAQ TOGGLE */
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  /* ACCORDION TOGGLE */
  const toggleAccordion = (index) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
  };

  /* KEYBOARD HANDLER */
  const handleKeyDown = (e, index, toggleFunc) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFunc(index);
    }
  };

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="cd-hero-exact">
        <img
          src="/assets/icons/left-circle.png"
          alt=""
          className="figma-circle left"
          aria-hidden="true"
        />
        <img
          src="/assets/icons/right-circle.png"
          alt=""
          className="figma-circle right"
          aria-hidden="true"
        />
        <div className="hero-glow" aria-hidden="true"></div>

        <div className="cd-hero-content">
          <span className="cd-pill-exact">Partnership Disputes</span>

          <h1>
            Resolve <span className="highlight">Partnership</span> Disputes
            <br />
            <span className="highlight-light">Quickly</span> &
            Professionally
          </h1>

          <p>
            Streamline conflict resolution between business partners with our
            efficient Online Dispute Resolution platform.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() => navigateToApp("/user/file-new-case/step1")}
              aria-label="File a new partnership dispute case"
            >
              File A Case
            </button>

            <button
              className="btn-dark-exact"
              onClick={() => navigateToApp("/user/chats")}
              aria-label="Talk to a legal expert"
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
            <img 
              src="/assets/images/pd-1.png" 
              alt="Business partners in discussion"
            />
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
            <img 
              src="/assets/images/pd-2.png" 
              alt="Business dispute resolution discussion"
            />
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
            {whyDisputesOccur.map(({ icon, text }) => (
              <div className="pd-occur-card" key={text}>
                <img 
                  src={`/assets/icons/${icon}`} 
                  alt="" 
                  aria-hidden="true"
                />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP DISAGREEMENTS */}
      <section className="pd-disagree">
        <div className="pd-container pd-disagree-grid">
          <div className="pd-disagree-img">
            <img 
              src="/assets/images/cd.png" 
              alt="Partnership disagreement resolution"
            />
          </div>

          <div className="pd-disagree-content">
            <h3>Partnership disagreements</h3>

            {partnershipDisagreements.map((title, index) => (
              <div 
                className="pd-disagree-item" 
                key={title}
                onClick={() => toggleAccordion(index)}
                onKeyDown={(e) => handleKeyDown(e, index, toggleAccordion)}
                role="button"
                tabIndex={0}
                aria-expanded={openAccordionIndex === index}
              >
                <div>
                  <h4>{title}</h4>
                  <p>When one party fails to fulfill their contractual obligations...</p>
                </div>
                <span className="pd-arrow" aria-hidden="true">›</span>
              </div>
            ))}

            <button 
              className="pd-see-more"
              onClick={() => navigateToApp("/user/file-new-case/step1")}
              aria-label="See more dispute types and file a case"
            >
              See More
            </button>
          </div>
        </div>
      </section>

      {/* TYPES OF PARTNERSHIP DISPUTES */}
      <section className="types-disputes-section">
        <div className="types-container">
          <h2>Types of Partnership Disputes</h2>
          <p className="types-subtitle">Common Issues We Handle</p>

          <div className="types-grid">
            {disputeTypes.map(({ icon, title, desc }) => (
              <div className="types-card" key={title}>
                <img 
                  src={`/assets/icons/${icon}`} 
                  alt="" 
                  aria-hidden="true"
                />
                <div className="types-content">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION – expandable */}
      <section className="faq-section">
        <div className="pd-container">
          <h2 className="faq-title">Frequently Asked Questions (FAQ)</h2>

          <div className="faq-tabs" role="tablist" aria-label="FAQ categories">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`faq-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`faq-panel-${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div 
            className="faq-list"
            role="tabpanel"
            id={`faq-panel-${activeTab}`}
          >
            {questions.map((q, i) => (
              <div key={i}>
                <div
                  className="faq-item"
                  onClick={() => toggleFaq(i)}
                  onKeyDown={(e) => handleKeyDown(e, i, toggleFaq)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openFaqIndex === i}
                  aria-label={q}
                >
                  <span>{q}</span>
                  <span className="faq-arrow" aria-hidden="true">
                    {openFaqIndex === i ? "−" : "›"}
                  </span>
                </div>

                {openFaqIndex === i && (
                  <div
                    className="faq-answer"
                    style={{
                      padding: "12px 10px",
                      fontSize: "13px",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    }}
                    role="region"
                    aria-label="Answer"
                  >
                    This is the answer for <strong>{q}</strong>. Replace with actual FAQ answer.
                  </div>
                )}
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
              Handle partnership conflicts professionally with structured
              online dispute resolution guided by experienced legal experts.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() => navigateToApp("/user/file-new-case/step1")}
                aria-label="File a partnership dispute case"
              >
                File A Case
              </button>

              <button
                className="cta-secondary"
                onClick={() => navigateToApp("/user/chats")}
                aria-label="Talk to an expert about partnership disputes"
              >
                Talk To Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img
              src="/assets/images/relationships.png"
              alt="Business partnership protection services"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
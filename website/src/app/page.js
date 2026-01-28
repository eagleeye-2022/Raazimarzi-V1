"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/home.css";
import { APP_BASE_PATH } from "@/config/next.config.js";
export default function HomePage() {
  const [animate, setAnimate] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

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

  /* FAQ KEYBOARD HANDLER */
  const handleFaqKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFaq(index);
    }
  };

  const faqTabs = [
    "Cases",
    "Money",
    "Policies",
    "Resolve Cases",
    "Victory %",
    "Ordinary",
  ];

  const faqQuestions = [
    "What should I do if I think the contract has been breached?",
    "How can I resolve landlord/tenant disputes?",
    "How does the platform handle small business disputes?",
    "What documents are needed to file a case?",
    "How long does online dispute resolution take?",
  ];

  const howItWorksSteps = [
    {
      title: "Submit your dispute online",
      desc: "Once you raise your case after sign in / sign up.",
    },
    {
      title: "Admin Approved",
      desc: "It will reflect on admin's dashboard. He/She will assign a case manager.",
    },
    {
      title: "Assign to Case Manager",
      desc: "Case manager reviews the whole document then assigns to mediator.",
    },
    {
      title: "Mediator Dashboard",
      desc: "Mediator will start the session as per the assigned date.",
    },
  ];

  const whyChooseItems = [
    { icon: "faster", text: "Faster than court" },
    { icon: "cost", text: "Cost-effective" },
    { icon: "confidential", text: "Confidential & secure" },
    { icon: "neutral2", text: "Neutral & Unbiased" },
    { icon: "personal", text: "Personal & Professional" },
    { icon: "legal2", text: "Legally compliant process" },
  ];

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="hero-wrapper">
        <div className="hero-content">
          <span className="hero-badge">
            Settle Conflicts Without Court – 100% Online
          </span>

          <h1 className="hero-title">
            Resolve <span className="blue">Disputes</span> Online Fair,
            <br />
            Fast & Hassle-<span className="blue">Free</span>
          </h1>

          <p className="hero-desc">
            Say goodbye to endless court visits and delays. Our Online Dispute
            Resolution platform helps individuals, businesses, and lawyers
            settle disputes securely, transparently, and from anywhere.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigateToApp("/user/file-new-case/step1")}
              aria-label="File a new case"
            >
              File A Case
            </button>

            <button 
              className="btn-dark" 
              onClick={() => navigateToApp("/user/chats")}
              aria-label="Talk to a legal expert"
            >
              Talk To Expert
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <span className={`raazi ${animate ? "show" : ""}`} aria-hidden="true">
            RAAZI
          </span>
          <img
            src="/assets/images/statue.png"
            className={`statue ${animate ? "drop" : ""}`}
            alt="Justice statue representing fair dispute resolution"
          />
          <span className={`marzi ${animate ? "show" : ""}`} aria-hidden="true">
            MARZI
          </span>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="dashboard-section">
        <img
          src="/assets/images/dashboard.png"
          alt="Platform dashboard preview showing case management interface"
          className="dashboard-img"
        />
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <h2 className="how-title">How Raazimerzi Works (Step-by-Step)</h2>
        <p className="how-subtitle">
          Say goodbye to endless court visits and delays. Our Online Dispute
          Resolution platform helps individuals.
        </p>

        <div className="how-cards">
          {howItWorksSteps.map((step, i) => (
            <div key={i} className="how-card">
              <div className="how-icon">
                <img 
                  src="/assets/icons/right.png" 
                  alt="" 
                  aria-hidden="true"
                />
              </div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND STRIP */}
      <section className="brand-strip">
        <img 
          src="/assets/images/rzmz-frame.png" 
          alt="Raazimerzi platform showcase"
        />
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <h2 className="why-title">Why Choose Our Raazimerzi Platform</h2>
        <p className="why-subtitle">
          Say goodbye to endless court visits and delays. Our Online Dispute
          Resolution platform helps individuals.
        </p>

        <div className="why-items">
          {whyChooseItems.map((item, i) => (
            <div key={i} className="why-item">
              <img 
                src={`/assets/icons/${item.icon}.png`} 
                alt="" 
                aria-hidden="true"
              />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-subtitle">
          Clear answers to common questions about our platform
        </p>

        <div className="faq-box">
          {/* TABS */}
          <div className="faq-tabs" role="tablist" aria-label="FAQ categories">
            {faqTabs.map((tab) => (
              <button
                key={tab}
                className={`faq-tab ${activeFaqTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveFaqTab(tab);
                  setOpenFaqIndex(null);
                }}
                role="tab"
                aria-selected={activeFaqTab === tab}
                aria-controls={`faq-panel-${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* QUESTIONS */}
          <div 
            className="faq-questions"
            role="tabpanel"
            id={`faq-panel-${activeFaqTab}`}
            aria-labelledby={`tab-${activeFaqTab}`}
          >
            {faqQuestions.map((question, index) => (
              <div key={index}>
                <div
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  onKeyDown={(e) => handleFaqKeyDown(e, index)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openFaqIndex === index}
                  aria-label={question}
                >
                  <span>{question}</span>
                  <span className="faq-arrow" aria-hidden="true">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </div>

                {openFaqIndex === index && (
                  <div
                    className="faq-answer"
                    style={{
                      padding: "12px 18px",
                      background: "#ffffff",
                      fontSize: "13px",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    }}
                    role="region"
                    aria-label="Answer"
                  >
                    This is the answer for: <strong>{question}</strong>. Replace this text
                    with the actual answer content.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="contract-cta">
        <div className="contract-cta-box">
          <div className="contract-cta-content">
            <h2>Resolve Disputes Online. Faster. Smarter. Peacefully.</h2>
            <p>
              Settle legal disputes without long court processes. RaaziMerzi
              connects you with expert mediators and lawyers for secure,
              transparent online resolution.
            </p>
            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() => navigateToApp("/user/file-new-case/step1")}
                aria-label="File a case to start dispute resolution"
              >
                File A Case
              </button>
              <button
                className="cta-secondary"
                onClick={() => navigateToApp("/user/chats")}
                aria-label="Talk to an expert mediator"
              >
                Talk To Expert
              </button>
            </div>
          </div>
          <div className="contract-cta-image">
            <img
              src="/assets/images/cta-home.png"
              alt="Online dispute resolution services"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import "@/styles/home.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [animate, setAnimate] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState("Cases");

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  useEffect(() => {
    setAnimate(true);
  }, []);

  const goToLogin = (redirectPath = "") => {
    const redirectQuery = redirectPath ? `?redirect=${redirectPath}` : "";
    window.location.href = `${APP_URL}/login${redirectQuery}`;
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

  return (
    <>
      <Header />

      {/* HERO */}
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
              onClick={() => goToLogin("/user/file-new-case/step1")}
            >
              File A Case
            </button>

            <button className="btn-dark" onClick={() => goToLogin()}>
              Talk To Expert
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <span className={`raazi ${animate ? "show" : ""}`}>RAAZI</span>
          <img
            src="/assets/images/statue.png"
            className={`statue ${animate ? "drop" : ""}`}
            alt="Justice Statue"
          />
          <span className={`marzi ${animate ? "show" : ""}`}>MARZI</span>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="dashboard-section">
        <img
          src="/assets/images/user-dashboard.png"
          alt="Dashboard"
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
          {[
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
          ].map((step, i) => (
            <div key={i} className="how-card">
              <div className="how-icon">
                <img src="/assets/icons/right.png" alt="step" />
              </div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND STRIP */}
      <section className="brand-strip">
        <img src="/assets/images/rzmz-frame.png" alt="Raazimerzi" />
      </section>

      {/* WHY CHOOSE */}
      <section className="why-section">
        <h2 className="why-title">Why Choose Our Raazimerzi Platform</h2>
        <p className="why-subtitle">
          Say goodbye to endless court visits and delays. Our Online Dispute
          Resolution platform helps individuals.
        </p>

        <div className="why-items">
          {[
            ["faster.png", "Faster than court"],
            ["cost.png", "Cost-effective"],
            ["confidential.png", "Confidential & secure"],
            ["neutral-2.png", "Neutral & Unbiased"],
            ["personal.png", "Personal & Professional"],
            ["legally-2.png", "Legally compliant process"],
          ].map(([icon, text]) => (
            <div key={text} className="why-item">
              <img src={`/assets/icons/${icon}`} alt={text} />
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DISPUTES */}
      <section className="dispute-section">
        <div className="dispute-grid">
          {["Professional Disputes", "Personal Disputes"].map((type) => (
            <div key={type} className="dispute-card">
              <img src="/assets/images/rzmz.png" alt="" className="shadow-bg" />
              <h3>{type}</h3>
              <p>
                Say goodbye to endless court visits and delays. Our Online Dispute
                Resolution platform helps individuals. Repeat as necessary for content.
              </p>
              <img src="/assets/images/rzmz.png" alt="" className="card-icon" />
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE HELP */}
      <section className="who-help-section">
        <h2>Who We Help?</h2>
        <p>Say goodbye to endless court visits and delays. Our platform helps individuals.</p>

        <div className="who-help-list">
          {[
            { icon: "individuals.png", label: "Individuals" },
            { icon: "businesses.png", label: "Businesses & Startups" },
            { icon: "proffesionals.png", label: "Professionals (Freelancers, SMEs, Consultants)" },
          ].map(({ icon, label }) => (
            <div key={label} className="help-card">
              <div className="icon-circle">
                <img src={`/assets/icons/${icon}`} alt={label} />
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>Raazimarzi Features</h2>
        <p>Say goodbye to endless court visits and delays. Our Online Dispute Resolution platform helps individuals.</p>

        <div className="features-wrapper">
          <svg className="feature-arrows" viewBox="0 0 1200 260" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 L12 6 L0 12" fill="none" stroke="#5f73ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            <path d="M200 130 C280 80, 340 80, 405 130" markerEnd="url(#arrowhead)" />
            <path d="M420 130 C500 180, 560 180, 625 130" markerEnd="url(#arrowhead)" />
            <path d="M640 130 C720 80, 780 80, 845 130" markerEnd="url(#arrowhead)" />
            <path d="M860 130 C940 180, 1000 180, 1065 130" markerEnd="url(#arrowhead)" />
          </svg>

          {[
            ["secure-2.png", "Secure communication dashboard"],
            ["documents.png", "Document upload & e-signing"],
            ["auto.png", "Case tracking"],
            ["case.png", "Auto reminders"],
            ["chat.png", "Chat/video mediation"],
          ].map(([icon, text]) => (
            <div key={text} className="feature-item">
              <div className="circle">
                <img src={`/assets/icons/${icon}`} alt={text} />
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="rz-testimonials">
        <div className="rz-testimonials-box">
          <div className="rz-testimonials-left">
            <h2>What Our Customer Says</h2>
            <p>At Raazimarzi, we are deeply committed to delivering high-quality services.</p>
            <button className="rz-btn">Read more →</button>
          </div>

          <div className="rz-testimonials-right">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rz-testimonial-card card-${i}`}>
                <img src="/assets/images/women.png" alt="" />
                <div>
                  <h4>Alisha Anand</h4>
                  <p>At Raazimarzi, we are deeply committed to delivering high-quality services.</p>
                </div>
                <span className="rz-quote">“”</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions (FAQ)</h2>
        <p className="faq-subtitle">
          Resolve business, customer, or personal conflicts through a secure, transparent online platform.
        </p>

        <div className="faq-box">
          <div className="faq-tabs">
            {faqTabs.map((tab) => (
              <button
                key={tab}
                className={`faq-tab ${activeFaqTab === tab ? "active" : ""}`}
                onClick={() => setActiveFaqTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="faq-questions">
            {faqQuestions.map((q, i) => (
              <div key={i} className="faq-question">
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
            <h2>Resolve Disputes Online. Faster. Smarter. Peacefully.</h2>
            <p>Settle legal disputes without long court processes. RaaziMerzi connects you with expert mediators and lawyers for secure, transparent online resolution.</p>
            <div className="contract-cta-buttons">
              <button className="cta-primary" onClick={() => goToLogin("/user/file-new-case/step1")}>
                File A Case
              </button>
              <button className="cta-secondary" onClick={() => goToLogin()}>
                Talk To Expert
              </button>
            </div>
          </div>
          <div className="contract-cta-image">
            <img src="/assets/images/cta-home.png" alt="Contract Resolution" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

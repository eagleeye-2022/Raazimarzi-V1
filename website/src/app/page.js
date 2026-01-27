"use client";

import { useState, useEffect } from "react";
import "@/styles/home.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_BASE_PATH } from "@/config/appConfig";

export default function HomePage() {
  const [animate, setAnimate] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const goToLogin = (redirectPath = "") => {
    const redirectQuery = redirectPath ? `?redirect=${redirectPath}` : "";
    window.location.href = `${APP_BASE_PATH}/login${redirectQuery}`;
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
          src="/assets/images/dashboard.png"
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
            ["faster", "Faster than court"],
            ["cost", "Cost-effective"],
            ["confidential", "Confidential & secure"],
            ["neutral2", "Neutral & Unbiased"],
            ["personal", "Personal & Professional"],
            ["legal2", "Legally compliant process"],
          ].map(([icon, text], i) => (
            <div key={i} className="why-item">
              <img src={`/assets/icons/${icon}.png`} alt={text} />
              <p>{text}</p>
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
          <div className="faq-tabs">
            {faqTabs.map((tab) => (
              <button
                key={tab}
                className={`faq-tab ${activeFaqTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveFaqTab(tab);
                  setOpenFaqIndex(null);
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* QUESTIONS */}
          <div className="faq-questions">
            {faqQuestions.map((question, index) => (
              <div key={index}>
                <div
                  className="faq-question"
                  onClick={() =>
                    setOpenFaqIndex(
                      openFaqIndex === index ? null : index
                    )
                  }
                >
                  <span>{question}</span>
                  <span className="faq-arrow">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </div>

                {openFaqIndex === index && (
                  <div
                    style={{
                      padding: "12px 18px",
                      background: "#ffffff",
                      fontSize: "13px",
                      color: "#4b5563",
                      lineHeight: "1.6",
                    }}
                  >
                    This is the answer for: <b>{question}</b>. Replace this text
                    with the actual answer content.
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
            <h2>Resolve Disputes Online. Faster. Smarter. Peacefully.</h2>
            <p>
              Settle legal disputes without long court processes. RaaziMerzi
              connects you with expert mediators and lawyers for secure,
              transparent online resolution.
            </p>
            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() => goToLogin("/user/file-new-case/step1")}
              >
                File A Case
              </button>
              <button
                className="cta-secondary"
                onClick={() => goToLogin()}
              >
                Talk To Expert
              </button>
            </div>
          </div>
          <div className="contract-cta-image">
            <img
              src="/assets/images/cta-home.png"
              alt="Contract Resolution"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

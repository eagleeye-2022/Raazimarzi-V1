"use client";

import { useState, useEffect } from "react";
import "@/styles/home.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [animate, setAnimate] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState("Cases");

  // Updated: point to /app for the application path
  const APP_PATH = "/app";

  useEffect(() => {
    setAnimate(true);
  }, []);

  const goToLogin = (redirectPath = "") => {
    // Updated to use relative path instead of localhost
    const redirectQuery = redirectPath ? `?redirect=${redirectPath}` : "";
    window.location.href = `${APP_PATH}/login${redirectQuery}`;
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
            src="/assets/images/statuee.png"
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
          <div className="why-item">
            <img src="/assets/icons/faster.png" alt="Faster than court" />
            <p>Faster than court</p>
          </div>

          <div className="why-item">
            <img src="/assets/icons/cost.png" alt="Cost-effective" />
            <p>Cost-effective</p>
          </div>

          <div className="why-item">
            <img src="/assets/icons/confidential.png" alt="Confidential & secure" />
            <p>Confidential & secure</p>
          </div>

          <div className="why-item">
            <img src="/assets/icons/neutral2.png" alt="Neutral & Unbiased" />
            <p>Neutral & Unbiased</p>
          </div>

          <div className="why-item">
            <img src="/assets/icons/personal.png" alt="Personal & Professional" />
            <p>Personal & Professional</p>
          </div>

          <div className="why-item">
            <img src="/assets/icons/legal2.png" alt="Legally compliant process" />
            <p>Legally compliant process</p>
          </div>
        </div>
      </section>

      {/* Remaining sections unchanged */}
      {/* Make sure any button linking to app uses goToLogin() */}
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

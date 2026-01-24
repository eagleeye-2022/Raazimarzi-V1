"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/contractDisputes.css";

export default function ContractDisputes() {
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
    "What should I do if I think the contract has been breached?",
    "How long does a contract dispute take to resolve?",
    "Can disputes be settled without going to court?",
    "What evidence is required for a contract dispute?",
    "What compensation can I claim?",
  ];

  function AccordionItem({ title }) {
    const [open, setOpen] = useState(false);

    return (
      <div className={`cd-accordion-item ${open ? "open" : ""}`}>
        <div className="cd-accordion-header" onClick={() => setOpen(!open)}>
          <div>
            <h4>{title}</h4>
            <p>When one party fails to fulfill their contractual obligations...</p>
          </div>
          <span className="cd-accordion-arrow">›</span>
        </div>

        {open && (
          <div className="cd-accordion-body">
            Detailed explanation about {title.toLowerCase()} and how we help
            resolve such disputes efficiently.
          </div>
        )}
      </div>
    );
  }

  // ✅ Use APP_PATH for all links
  const APP_PATH = "/app";

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="cd-hero-exact">
        <img src="/assets/icons/left-circle.png" alt="" className="figma-circle left" />
        <img src="/assets/icons/right-circle.png" alt="" className="figma-circle right" />
        <div className="hero-glow"></div>

        <div className="cd-hero-content">
          <span className="cd-pill-exact">Contract Disputes</span>

          <h1>
            Protecting Your <span className="highlight">Rights</span> and <br />
            <span className="highlight-light">Resolving</span> Conflicts Efficiently
          </h1>

          <p>
            Clear guidance, strategic solutions, and strong advocacy for individuals and
            businesses involved in contract disagreements.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() => router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/file-new-case/step1`)}
            >
              File A Case
            </button>

            <button
              className="btn-dark-exact"
              onClick={() => router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/chats`)}
            >
              Talk To Expert
            </button>
          </div>
        </div>
      </section>

      {/* WHAT IS CONTRACT DISPUTES */}
      <section className="cd-what-figma">
        <div className="cd-what-box">
          <div className="cd-what-circles">
            <img src="/assets/icons/circle1.png" alt="" className="circle c1" />
            <img src="/assets/icons/circle2.png" alt="" className="circle c2" />
            <img src="/assets/icons/circle3.png" alt="" className="circle c3" />
          </div>

          <div className="cd-what-content">
            <h2>What is Contract Disputes?</h2>

            <p className="cd-what-desc">
              Contract disputes arise when one or more parties believe that the terms
              of an agreement have not been met. These disagreements can disrupt
              business operations, damage relationships, and lead to financial losses.
            </p>

            <div className="cd-divider"></div>

            <div className="cd-what-points">
              <ul>
                <li>
                  Our team helps clients understand their rights, assess their options,
                  and take strategic steps toward resolving the conflict efficiently.
                </li>
              </ul>

              <ul>
                <li>
                  Whether you're facing a breach of contract, payment issues, or
                  disagreement over contract terms, we provide clear, practical
                  support.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Dispute List */}
      <section className="cd-list-figma">
        <div className="cd-list-container">
          <div className="cd-list-image">
            <img src="/assets/images/CD.png" alt="Contract Disputes" />
          </div>

          <div className="cd-list-content">
            <h2>Contract Disputes</h2>

            <div className="cd-accordion-figma">
              {["Breach of Contract","Payment Disputes","Non-performance","Delay in Delivery"].map((title, index) => (
                <AccordionItem key={index} title={title} />
              ))}
            </div>

            <button className="cd-see-more">See More</button>
          </div>
        </div>
      </section>

      {/* HOW WE RESOLVE */}
      <section className="cd-how-exact">
        <div className="cd-how-box">
          <h2>How We Resolve Contract Disputes?</h2>
          <p className="cd-how-sub">Common Contract Conflicts We Handle</p>

          <div className="cd-how-grid">
            <div className="cd-how-item">
              <img src="/assets/icons/contract.png" alt="" />
              <span>Contract Review & Legal Assessment</span>
            </div>

            <div className="cd-how-item">
              <img src="/assets/icons/evidance.png" alt="" />
              <span>Evidence Collection & Case Evaluation</span>
            </div>

            <div className="cd-how-item">
              <img src="/assets/icons/negotiation.png" alt="" />
              <span>Negotiation & Settlement</span>
            </div>

            <div className="cd-how-item">
              <img src="/assets/icons/meditiation.png" alt="" />
              <span>Mediation & ADR</span>
            </div>

            <div className="cd-how-item">
              <img src="/assets/icons/litigation.png" alt="" />
              <span>Litigation (If Required)</span>
            </div>
          </div>
        </div>
      </section>

      {/* BREACH SECTION */}
      <section className="cd-breach">
        <div className="cd-container cd-breach-wrap">
          <div className="cd-breach-left">
            <h2>Breach Of Contract</h2>

            {["Material Breach","Minor Breach","Fundamental Breach","Anticipatory Breach"].map((item) => (
              <div className="cd-breach-item" key={item}>
                <div>
                  <h4>{item}</h4>
                  <p>Failure to fulfill contractual obligations.</p>
                </div>
                <span className="cd-arrow">›</span>
              </div>
            ))}

            <button className="cd-breach-btn">See More</button>
          </div>

          <div className="cd-breach-right">
            <img src="/assets/images/breach.png" alt="" />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <h2 className="why-choose-title">Why Choose Us</h2>
          <p className="why-choose-subtitle">
            Resolve business, customer, or personal conflicts through a secure,
            transparent online platform.
          </p>

          <div className="why-choose-grid">
            {[
              ["fast.png", "Fast Resolution", "Resolve disputes fast and efficiently."],
              ["legal.png", "Legally Compliant", "All processes follow legal standards."],
              ["secure.png", "Secure & Confidential", "Your data is fully protected."],
              ["neutral.png", "Neutral Experts", "Fair and unbiased mediation."],
              ["24.png", "24/7 Access", "Access assistance anytime, anywhere."],
            ].map(([icon, title, desc]) => (
              <div key={title} className="why-choose-item">
                <div className="why-icon-circle">
                  <img src={`/assets/icons/${icon}`} alt={title} />
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="pd-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>

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
            {questions.map((q, i) => (
              <div className="faq-item" key={i}>
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
            <h2>Resolve Contract Disputes Without Court Delays</h2>

            <p>
              Whether it’s a breach of contract, unpaid dues, or service agreement
              issues, RaaziMarzi helps you resolve contract disputes online—securely,
              legally, and efficiently.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() => router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/file-new-case/step1`)}
              >
                Start Contract Resolution
              </button>

              <button
                className="cta-secondary"
                onClick={() => router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/chats`)}
              >
                Consult a Legal Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img src="/assets/images/contract.png" alt="Contract Resolution" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/contractDisputes.css";

export default function ContractDisputes() {
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
      <button className="btn-primary-exact">File A Case</button>
      <button className="btn-dark-exact">Talk To Expert</button>
    </div>
  </div>
</section>

{/* WHAT IS CONTRACT DISPUTES */}
<section className="cd-what-figma">
  <div className="cd-what-box">

    {/* LEFT – CIRCLES */}
    <div className="cd-what-circles">
      <img src="/assets/icons/circle1.png" alt="" className="circle c1" />
      <img src="/assets/icons/circle2.png" alt="" className="circle c2" />
      <img src="/assets/icons/circle3.png" alt="" className="circle c3" />
    </div>

    {/* RIGHT – CONTENT */}
    <div className="cd-what-content">
      <h2>What is Contract Disputes?</h2>

      <p className="cd-what-desc">
        Contract disputes arise when one or more parties believe that the terms
        of an agreement have not been met. These disagreements can disrupt
        business operations, damage relationships, and lead to financial losses.
      </p>

      {/* DIVIDER */}
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

    {/* LEFT IMAGE */}
    <div className="cd-list-image">
      <img src="/assets/images/CD.png" alt="Contract Disputes" />
    </div>

    {/* RIGHT CONTENT */}
    <div className="cd-list-content">
      <h2>Contract Disputes</h2>

      <div className="cd-accordion-figma">
        {[
          "Breach of Contract",
          "Payment Disputes",
          "Non-performance",
          "Delay in Delivery",
        ].map((title, index) => (
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
          <p className="cd-how-sub">Common Employment Conflicts We Handle</p>

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

            {[
              "Material Breach",
              "Minor Breach",
              "Fundamental Breach",
              "Anticipatory Breach",
            ].map((item) => (
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

      <div className="why-choose-item">
        <div className="why-icon-circle">
          <img src="/assets/icons/Fast.png" alt="Fast Resolution" />
        </div>
        <h4>Fast Resolution</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="why-choose-item">
        <div className="why-icon-circle">
          <img src="/assets/icons/Legally.png" alt="Legally Compliant" />
        </div>
        <h4>Legally Compliant</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="why-choose-item">
        <div className="why-icon-circle">
          <img src="/assets/icons/Secure.png" alt="Secure & Confidential" />
        </div>
        <h4>Secure & Confidential</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="why-choose-item">
        <div className="why-icon-circle">
          <img src="/assets/icons/Neutral.png" alt="Neutral Experts" />
        </div>
        <h4>Neutral Experts</h4>
        <p>
          Resolve business, customer, or personal conflicts through a secure.
        </p>
      </div>

      <div className="why-choose-item">
        <div className="why-icon-circle">
          <img src="/assets/icons/24.png" alt="24/7 Access" />
        </div>
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

      
      <section className="contract-cta">
  <div className="contract-cta-box">

    {/* LEFT CONTENT */}
    <div className="contract-cta-content">
      <h2>Resolve Contract Disputes Without Court Delays</h2>

      <p>
        Whether it’s a breach of contract, unpaid dues, or service agreement
        issues, RaaziMerzi helps you resolve contract disputes online—securely,
        legally, and efficiently.
      </p>

      <div className="contract-cta-buttons">
        <button className="cta-primary">Start Contract Resolution</button>
        <button className="cta-secondary">Consult a Legal Expert</button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="contract-cta-image">
      <img src="/assets/images/contract.png" alt="Contract Resolution" />
    </div>

  </div>
</section>


      <Footer />
    </>
  );
}

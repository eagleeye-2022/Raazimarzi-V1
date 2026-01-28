"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/contractDisputes.css";

export default function ContractDisputes() {
  const [activeTab, setActiveTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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

  const contractDisputeTypes = [
    "Breach of Contract",
    "Payment Disputes",
    "Non-performance",
    "Delay in Delivery",
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

  /* FAQ KEYBOARD HANDLER */
  const handleFaqKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFaq(index);
    }
  };

  /* ACCORDION COMPONENT */
  function AccordionItem({ title, index, open, onToggle }) {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle(index);
      }
    };

    return (
      <div className={`cd-accordion-item ${open ? "open" : ""}`}>
        <div
          className="cd-accordion-header"
          onClick={() => onToggle(index)}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-label={title}
        >
          <div>
            <h4>{title}</h4>
            <p>
              When one party fails to fulfill their contractual
              obligations...
            </p>
          </div>
          <span className="cd-accordion-arrow" aria-hidden="true">
            {open ? "−" : "›"}
          </span>
        </div>

        {open && (
          <div 
            className="cd-accordion-body"
            role="region"
            aria-label="Dispute type details"
          >
            Detailed explanation about{" "}
            {title.toLowerCase()} and how we help resolve such
            disputes efficiently.
          </div>
        )}
      </div>
    );
  }

  /* ACCORDION STATE MANAGEMENT */
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  
  const toggleAccordion = (index) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
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
          <span className="cd-pill-exact">
            Contract Disputes
          </span>

          <h1>
            Protecting Your{" "}
            <span className="highlight">Rights</span> and <br />
            <span className="highlight-light">
              Resolving
            </span>{" "}
            Conflicts Efficiently
          </h1>

          <p>
            Clear guidance, strategic solutions, and strong
            advocacy for individuals and businesses involved
            in contract disagreements.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() => navigateToApp("/user/file-new-case/step1")}
              aria-label="File a new case"
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

      {/* WHAT IS CONTRACT DISPUTE */}
      <section className="cd-what-figma">
        <div className="cd-what-box">
          <div className="cd-what-circles">
            <img 
              src="/assets/icons/circle1.png" 
              alt="" 
              className="circle c1"
              aria-hidden="true"
            />
            <img 
              src="/assets/icons/circle2.png" 
              alt="" 
              className="circle c2"
              aria-hidden="true"
            />
            <img 
              src="/assets/icons/circle3.png" 
              alt="" 
              className="circle c3"
              aria-hidden="true"
            />
          </div>

          <div className="cd-what-content">
            <h2>What is Contract Dispute?</h2>

            <p className="cd-what-desc">
              Contract disputes arise when one or more parties
              believe that the terms of an agreement have not
              been met. These disagreements can disrupt
              business operations, damage relationships, and
              lead to financial losses.
            </p>

            <div className="cd-divider" aria-hidden="true"></div>

            <div className="cd-what-points">
              <ul>
                <li>
                  Our team helps clients understand their
                  rights, assess their options, and take
                  strategic steps toward resolving the
                  conflict efficiently.
                </li>
              </ul>

              <ul>
                <li>
                  Whether you're facing a breach of contract,
                  payment issues, or disagreement over
                  contract terms, we provide clear, practical
                  support.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTRACT DISPUTE LIST */}
      <section className="cd-list-figma">
        <div className="cd-list-container">
          <div className="cd-list-image">
            <img 
              src="/assets/images/CD.png" 
              alt="Contract dispute resolution services illustration"
            />
          </div>

          <div className="cd-list-content">
            <h2>Contract Disputes</h2>

            <div className="cd-accordion-figma">
              {contractDisputeTypes.map((title, index) => (
                <AccordionItem 
                  key={index} 
                  title={title}
                  index={index}
                  open={openAccordionIndex === index}
                  onToggle={toggleAccordion}
                />
              ))}
            </div>

            <button 
              className="cd-see-more"
              onClick={() => navigateToApp("/user/file-new-case/step1")}
              aria-label="See more dispute types and file a case"
            >
              See More
            </button>
          </div>
        </div>
      </section>

      {/* FAQ – EXPAND / COLLAPSE */}
      <section className="faq-section">
        <div className="pd-container">
          <h2 className="faq-title">Frequently Asked Questions</h2>

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
                  onKeyDown={(e) => handleFaqKeyDown(e, i)}
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
            <h2>Resolve Contract Disputes Without Court Delays</h2>

            <p>
              Whether it's a breach of contract, unpaid dues,
              or service agreement issues, RaaziMarzi helps
              you resolve contract disputes online—securely,
              legally, and efficiently.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() => navigateToApp("/user/file-new-case/step1")}
                aria-label="Start contract resolution process"
              >
                Start Contract Resolution
              </button>

              <button
                className="cta-secondary"
                onClick={() => navigateToApp("/user/chats")}
                aria-label="Consult with a legal expert"
              >
                Consult a Legal Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img
              src="/assets/images/contract.png"
              alt="Contract resolution services"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/consumerDisputes.css";

export default function ConsumerDisputePage() {
  const [activeTab, setActiveTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const consumerTypes = [
    {
      title: "Defective or Faulty Products",
      desc: "Product not working, damaged, or poor quality.",
      icon: "/assets/icons/defective.png",
    },
    {
      title: "Poor or Incomplete Services",
      desc: "Service not delivered as promised (e.g., repair, installation, travel service, etc.).",
      icon: "/assets/icons/services.png",
    },
    {
      title: "Overcharging or Hidden Fees",
      desc: "Customer charged extra without clear reason.",
      icon: "/assets/icons/overcharge.png",
    },
    {
      title: "Wrong or Delayed Delivery",
      desc: "Item delivered late, wrong item, or not delivered.",
      icon: "/assets/icons/delivery.png",
    },
    {
      title: "Misleading Advertisements",
      desc: "False claims about products or services.",
      icon: "/assets/icons/ads.png",
    },
    {
      title: "Warranty or Guarantee Issues",
      desc: "Company refusing repair or replacement even within warranty.",
      icon: "/assets/icons/warranty.png",
    },
    {
      title: "Refund / Return Problems",
      desc: "Refund not given, return denied, or replacement delayed.",
      icon: "/assets/icons/refund.png",
    },
    {
      title: "Online Shopping Disputes",
      desc: "Fake products, damaged delivery, order cancellation issues.",
      icon: "/assets/icons/online.png",
    },
  ];

  const rights = [
    "Right to Safety",
    "Right to Information",
    "Right to Choose",
    "Right to Redressal",
    "Right to Consumer Education",
  ];

  const whoCanFile = [
    "Individual consumers",
    "Online shoppers",
    "Service users (repair, installation etc.)",
    "Buyers of electronics, home appliances, furniture etc.",
    "Subscribers of telecom, OTT, internet, electricity etc.",
  ];

  const faqTabs = [
    "Cases",
    "Money",
    "Policies",
    "Resolve Cases",
    "Victory %",
    "Ordinary",
  ];

  const faqQuestions = [
    "What steps should I take if a product is defective?",
    "How long does online dispute resolution take?",
    "Can I file a dispute for services not delivered?",
    "Is my personal information secure on the platform?",
    "Are the decisions legally binding?",
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

  /* KEYBOARD HANDLER */
  const handleFaqKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFaq(index);
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
          <span className="cd-pill-exact">Consumer Disputes</span>

          <h1>
            Resolve Your <span className="highlight">Consumer</span> <br />
            <span className="highlight-light">Related</span> Conflicts Easily
          </h1>

          <p>
            Solve product and service-related conflicts between consumers and
            businesses through a fast, transparent, and legally guided Online
            Dispute Resolution process.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() => navigateToApp("/user/file-new-case/step1")}
              aria-label="File a consumer dispute case"
            >
              File A Case
            </button>

            <button
              className="btn-dark-exact"
              onClick={() => navigateToApp("/user/chats")}
              aria-label="Talk to a consumer rights expert"
            >
              Talk To Expert
            </button>
          </div>
        </div>
      </section>

      {/* WHAT ARE CONSUMER DISPUTES */}
      <section className="info-section">
        <div className="info-grid">
          <img 
            src="/assets/images/consumer.png" 
            alt="Consumer dispute resolution illustration"
          />
          <div>
            <h2>What Are Consumer Disputes?</h2>
            <p>
              Consumer disputes are conflicts that arise between a consumer and
              a seller, service provider, manufacturer, or business when the
              consumer feels they have been treated unfairly.
            </p>
            <p>
              These disputes usually occur when goods or services are defective,
              delayed, overpriced, misrepresented, or not delivered as agreed.
            </p>
          </div>
        </div>
      </section>

      {/* COMMON TYPES */}
      <section className="consumer-types">
        <h2>Common Types of Consumer Disputes</h2>
        <p className="subtitle">Common Conflicts We Handle</p>

        <div className="types-grid">
          {consumerTypes.map((item, i) => (
            <div className="type-card" key={i}>
              <div className="type-icon">
                <img src={item.icon} alt="" aria-hidden="true" />
              </div>
              <div className="type-content">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO CAN FILE */}
      <section className="who-can-file">
        <h2>Who Can File a Consumer Dispute?</h2>
        <p className="subtitle">We Help You Recover Money From</p>

        <div className="flow-container">
          <div className="flow-items">
            {whoCanFile.map((label, i) => (
              <div key={i} className="flow-item">
                <div className="circle" aria-hidden="true"></div>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHTS */}
      <section className="rights-section">
        <h2>Consumer Rights Awareness</h2>
        <p className="rights-subtitle">Inform users about basic rights:</p>

        <div className="rights-cards">
          {rights.map((title, i) => (
            <div className="rights-card" key={i}>
              <p>{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ – EXPAND / COLLAPSE */}
      <section className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions (FAQ)</h2>

          <p className="faq-subtitle">
            Resolve business, customer, or personal conflicts securely.
          </p>

          <div className="faq-box">
            <div className="faq-tabs" role="tablist" aria-label="FAQ categories">
              {faqTabs.map((tab) => (
                <button 
                  key={tab} 
                  className={`faq-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setOpenFaqIndex(null);
                  }}
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
              {faqQuestions.map((q, i) => (
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
                      This is the answer for <strong>{q}</strong>. Replace this text with
                      the actual FAQ answer.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="contract-cta">
        <div className="contract-cta-box">
          <div className="contract-cta-content">
            <h2>Resolve Consumer Complaints Without Court Stress</h2>

            <p>
              Don't let unresolved complaints go unheard. Resolve consumer
              disputes through a secure and legally compliant online process.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() => navigateToApp("/user/file-new-case/step1")}
                aria-label="File a consumer dispute case"
              >
                File A Case
              </button>

              <button
                className="cta-secondary"
                onClick={() => navigateToApp("/user/chats")}
                aria-label="Consult with a consumer rights expert"
              >
                Talk To Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img
              src="/assets/images/consumer-ct.png"
              alt="Consumer dispute resolution services"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/consumerDisputes.css";
import { APP_BASE_PATH } from "@/config/appConfig";

export default function ConsumerDisputePage() {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const consumerTypes = [
    {
      title: "Defective or Faulty Products",
      desc: "Product not working, damaged, or poor quality.",
      icon: "/assets/icons/defective.png",
    },
    {
      title: "Poor or Incomplete Services",
      desc:
        "Service not delivered as promised (e.g., repair, installation, travel service, etc.).",
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
      desc:
        "Company refusing repair or replacement even within warranty.",
      icon: "/assets/icons/warranty.png",
    },
    {
      title: "Refund / Return Problems",
      desc:
        "Refund not given, return denied, or replacement delayed.",
      icon: "/assets/icons/refund.png",
    },
    {
      title: "Online Shopping Disputes",
      desc:
        "Fake products, damaged delivery, order cancellation issues.",
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

  const faqQuestions = [
    "What steps should I take if a product is defective?",
    "How long does online dispute resolution take?",
    "Can I file a dispute for services not delivered?",
    "Is my personal information secure on the platform?",
    "Are the decisions legally binding?",
  ];

  const goToLogin = (redirectPath = "") => {
    const redirectQuery = redirectPath ? `?redirect=${redirectPath}` : "";
    router.push(`${APP_BASE_PATH}/login${redirectQuery}`);
  };

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="cd-hero-exact">
        <img src="/assets/icons/left-circle.png" alt="" className="figma-circle left" />
        <img src="/assets/icons/right-circle.png" alt="" className="figma-circle right" />
        <div className="hero-glow"></div>

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
              onClick={() => goToLogin("/user/file-new-case/step1")}
            >
              File A Case
            </button>

            <button
              className="btn-dark-exact"
              onClick={() => goToLogin()}
            >
              Talk To Expert
            </button>
          </div>
        </div>
      </section>

      {/* WHAT ARE CONSUMER DISPUTES */}
      <section className="info-section">
        <div className="info-grid">
          <img src="/assets/images/consumer.png" alt="Consumer Dispute" />
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
                <img src={item.icon} alt={item.title} />
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
            {[
              "Individual consumers",
              "Online shoppers",
              "Service users (repair, installation etc.)",
              "Buyers of electronics, home appliances, furniture etc.",
              "Subscribers of telecom, OTT, internet, electricity etc.",
            ].map((label, i) => (
              <div key={i} className="flow-item">
                <div className="circle"></div>
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
            <div className="faq-tabs">
              {[
                "Cases",
                "Money",
                "Policies",
                "Resolve Cases",
                "Victory %",
                "Ordinary",
              ].map((tab) => (
                <button key={tab} className="faq-tab">
                  {tab}
                </button>
              ))}
            </div>

            <div className="faq-list">
              {faqQuestions.map((q, i) => (
                <div key={i}>
                  <div
                    className="faq-item"
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === i ? null : i)
                    }
                  >
                    <span>{q}</span>
                    <span className="faq-arrow">
                      {openFaqIndex === i ? "−" : "›"}
                    </span>
                  </div>

                  {openFaqIndex === i && (
                    <div
                      style={{
                        padding: "12px 10px",
                        fontSize: "13px",
                        color: "#4b5563",
                        lineHeight: "1.6",
                      }}
                    >
                      This is the answer for <b>{q}</b>. Replace this text with
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
              Don’t let unresolved complaints go unheard. Resolve consumer
              disputes through a secure and legally compliant online process.
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
              src="/assets/images/consumer-ct.png"
              alt="Consumer Resolution"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

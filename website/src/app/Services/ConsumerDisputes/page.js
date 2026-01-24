"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/consumerDisputes.css";

// ✅ Define base paths
const WEBSITE_PATH = "/website";
const APP_PATH = "/app";

export default function ConsumerDisputePage() {

  const router = useRouter();

  const consumerTypes = [
    { title: "Defective or Faulty Products", desc: "Product not working, damaged, or poor quality.", icon: "/assets/icons/defective.png" },
    { title: "Poor or Incomplete Services", desc: "Service not delivered as promised (e.g., repair, installation, travel service, etc.).", icon: "/assets/icons/services.png" },
    { title: "Overcharging or Hidden Fees", desc: "Customer charged extra without clear reason.", icon: "/assets/icons/overcharge.png" },
    { title: "Wrong or Delayed Delivery", desc: "Item delivered late, wrong item, or not delivered.", icon: "/assets/icons/delivery.png" },
    { title: "Misleading Advertisements", desc: "False claims about products or services.", icon: "/assets/icons/ads.png" },
    { title: "Warranty or Guarantee Issues", desc: "Company refusing repair or replacement even within warranty.", icon: "/assets/icons/warranty.png" },
    { title: "Refund / Return Problems", desc: "Refund not given, return denied, or replacement delayed.", icon: "/assets/icons/refund.png" },
    { title: "Online Shopping Disputes", desc: "Fake products, damaged delivery, order cancellation issues.", icon: "/assets/icons/online.png" },
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
              onClick={() =>
                router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/file-new-case/step1`)
              }
            >
              File A Case
            </button>

            <button
              className="btn-dark-exact"
              onClick={() =>
                router.push(`${APP_PATH}/login`)
              }
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
          <svg className="flow-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M150 100 C250 40, 350 40, 450 100" />
            <path d="M450 100 C550 160, 650 160, 750 100" />
            <path d="M750 100 C850 40, 950 40, 1050 100" />
            <path d="M1050 100 C1150 160, 1250 160, 1350 100" />
          </svg>

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
              <div className="arc"></div>
              <p>{title}</p>
              <div className="wave"></div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <h2 className="why-choose-title">Why Choose Us</h2>

          <p className="why-choose-subtitle">
            Resolve conflicts through a secure, transparent online platform.
          </p>

          <div className="why-choose-grid">
            {[
              ["fast.png", "Fast Resolution", "Get disputes resolved faster than traditional court procedures."],
              ["secure.png", "Secure Platform", "Your data and communication remain encrypted and protected."],
              ["legal.png", "Legally Compliant", "We follow all legal standards and compliance requirements."],
              ["neutral.png", "Neutral Experts", "Work with unbiased mediators and legal professionals."],
              ["24.png", "24/7 Support", "Access assistance and case updates anytime, anywhere."],
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
        <div className="faq-container">
          <h2>Frequently Asked Questions (FAQ)</h2>

          <p className="faq-subtitle">
            Resolve business, customer, or personal conflicts securely.
          </p>

          <div className="faq-box">
            <div className="faq-tabs">
              {["Cases","Money","Policies","Resolve Cases","Victory %","Ordinary"].map((tab, i) => (
                <button key={i} className={`faq-tab ${i===0 ? "active" : ""}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="faq-list">
              {faqQuestions.map((q,i)=>(
                <div key={i} className="faq-item">
                  <span>{q}</span>
                  <span className="faq-arrow">›</span>
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
              Don’t let unresolved complaints go unheard. Resolve consumer disputes
              through a secure and legally compliant online process.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() =>
                  router.push(`${APP_PATH}/login?redirect=${APP_PATH}/user/file-new-case/step1`)
                }
              >
                File A Case
              </button>

              <button
                className="cta-secondary"
                onClick={() =>
                  router.push(`${APP_PATH}/login`)
                }
              >
                Talk To Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img src="/assets/images/consumer-ct.png" alt="Contract Resolution" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/consumerDisputes.css";

export default function ConsumerDisputePage() {
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
    <span className="cd-pill-exact">Consumer Disputes</span>

    <h1>
      Resolve Your <span className="highlight">Consumer</span> <br />
      <span className="highlight-light">Related</span> Conflits Easily
    </h1>

    <p>
     Solve product and service-related conflicts between consumers and businesses through a
     fast, transparent, and legally guided Online Dispute Resolution process.
    </p>

    <div className="hero-buttons">
      <button className="btn-primary-exact">File A Case</button>
      <button className="btn-dark-exact">Talk To Expert</button>
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

    {/* COMMON TYPES OF CONSUMER DISPUTES */}
<section className="consumer-types">
  <h2>Common Types of Consumer Disputes</h2>
  <p className="subtitle">Common Employment Conflicts We Handle</p>

  <div className="types-grid">
    {[
      {
        title: "Defective or Faulty Products",
        desc: "Product not working, damaged, or poor quality.",
        icon: "/assets/icons/defective.g",
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
      {
        title: "Overcharging or Hidden Fees",
        desc: "Customer charged extra without clear reason.",
        icon: "/assets/icons/overcharge.svg",
      },
    ].map((item, index) => (
      <div className="type-card" key={index}>
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

{/* WHO CAN FILE A CONSUMER DISPUTE */}
<section className="who-can-file">
  <h2>Who Can File a Consumer Dispute?</h2>
  <p className="subtitle">We Help You Recover Money From</p>

  <div className="flow-container">
    {/* SVG CONNECTORS */}
    <svg
      className="flow-svg"
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
    >
      <path d="M150 100 C250 40, 350 40, 450 100" />
      <path d="M450 100 C550 160, 650 160, 750 100" />
      <path d="M750 100 C850 40, 950 40, 1050 100" />
      <path d="M1050 100 C1150 160, 1250 160, 1350 100" />
    </svg>

    {/* CIRCLES */}
    <div className="flow-items">
      <div className="flow-item">
        <div className="circle"></div>
        <p>Individual<br />consumers</p>
      </div>

      <div className="flow-item">
        <div className="circle"></div>
        <p>Online shoppers</p>
      </div>

      <div className="flow-item">
        <div className="circle"></div>
        <p>
          Service users (repair,<br />
          installation etc.)
        </p>
      </div>

      <div className="flow-item">
        <div className="circle"></div>
        <p>
          Buyers of electronic items,<br />
          home appliances, furniture, etc.
        </p>
      </div>

      <div className="flow-item">
        <div className="circle"></div>
        <p>
          Subscribers of telecom, OTT,<br />
          internet, electricity, etc.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* RIGHTS */}
     <section className="rights-section">
  <h2>Consumer Rights Awareness</h2>
  <p className="rights-subtitle">Inform users about basic rights:</p>

  <div className="rights-cards">
    {[
      "Right to Safety",
      "Right to Information",
      "Right to Choose",
      "Right to Redressal",
      "Right to Consumer Education",
    ].map((title, i) => (
      <div className="rights-card" key={i}>
        <div className="arc"></div>
        <p>{title}</p>
        <div className="wave"></div>
      </div>
    ))}
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
  <div className="faq-container">
    <h2>Frequently Asked Questions (FAQ)</h2>
    <p className="faq-subtitle">
      Resolve business, customer, or personal conflicts through a secure,
      transparent online platform.
    </p>

    <div className="faq-box">
      {/* Tabs */}
      <div className="faq-tabs">
        <button className="faq-tab active">Cases</button>
        <button className="faq-tab">Money</button>
        <button className="faq-tab">Policies</button>
        <button className="faq-tab">Resolve Cases</button>
        <button className="faq-tab">Victory %</button>
        <button className="faq-tab">Ordinary</button>
      </div>

      {/* Questions */}
      <div className="faq-list">
        <div className="faq-item">
          <span>What should I do if I think the contract has been breached?</span>
          <span className="faq-arrow">›</span>
        </div>
        <div className="faq-item">
          <span>What should I do if I think the contract has been breached?</span>
          <span className="faq-arrow">›</span>
        </div>
        <div className="faq-item">
          <span>What should I do if I think the contract has been breached?</span>
          <span className="faq-arrow">›</span>
        </div>
        <div className="faq-item">
          <span>What should I do if I think the contract has been breached?</span>
          <span className="faq-arrow">›</span>
        </div>
        <div className="faq-item">
          <span>What should I do if I think the contract has been breached?</span>
          <span className="faq-arrow">›</span>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* CTA */}
      
      
      <section className="contract-cta">
  <div className="contract-cta-box">

    {/* LEFT CONTENT */}
    <div className="contract-cta-content">
      <h2>Resolve Consumer Complaints Without Court Stress</h2>

      <p>
        Don’t let unresolved complaints go unheard. Resolve consumer disputes through a secure and legally compliant online process.
      </p>

      <div className="contract-cta-buttons">
        <button className="cta-primary">File A Case</button>
        <button className="cta-secondary">Talk To Expert</button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="contract-cta-image">
      <img src="/assets/images/consumer ct.png" alt="Contract Resolution" />
    </div>

  </div>
</section>


      <Footer />
    </>
  );
}

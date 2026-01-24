"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/property&rentalDispute.css";

export default function PropertyRentalDispute() {
  const [activeTab, setActiveTab] = useState("Cases");
  const router = useRouter();

  const tabs = ["Cases", "Money", "Policies", "Resolve Cases", "Victory %", "Ordinary"];
  const questions = [
    "What should I do if I think the contract has been breached?",
    "How do I handle disputes with tenants or landlords?",
    "Can property disputes be resolved online?",
    "What documentation is needed for rental disputes?",
    "How long does it take to resolve a property or rental dispute?",
  ];

  function AccordionItem({ title }) {
    const [open, setOpen] = useState(false);
    return (
      <div className={`prd-accordion-item ${open ? "open" : ""}`}>
        <div className="prd-accordion-header" onClick={() => setOpen(!open)}>
          <div>
            <h4>{title}</h4>
            <p>Explanation of {title.toLowerCase()} and how we help resolve it.</p>
          </div>
          <span className="prd-accordion-arrow">›</span>
        </div>
        {open && (
          <div className="prd-accordion-body">
            Detailed guidance on {title.toLowerCase()} disputes and how our platform
            handles them efficiently and legally.
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
        <img src="/assets/icons/left-circle.png" alt="" className="figma-circle left" />
        <img src="/assets/icons/right-circle.png" alt="" className="figma-circle right" />
        <div className="hero-glow"></div>

        <div className="cd-hero-content">
          <span className="cd-pill-exact">Property & Rental Dispute Resolution (ODR)</span>

          <h1>
            <span className="highlight">Property</span> & <span className="highlight-light">Rental</span> Dispute <br />
            Resolution (ODR)
          </h1>

          <p>
            Fast, fair, and hassle-free Online Dispute Resolution for landlords, tenants,
            property owners, builders, and housing societies.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() => router.push("/login?redirect=/user/file-new-case/step1")}
            >
              File A Case
            </button>
            <button
              className="btn-dark-exact"
              onClick={() => router.push("/login?redirect=/user/chats")}
            >
              Talk To Expert
            </button>
          </div>
        </div>
      </section>

      {/* PROPERTY DISPUTES */}
      <section className="prd-diagonal">
        <div className="prd-container prd-diagonal-inner">
          <div className="prd-diagonal-img">
            <img src="/assets/images/pd.png" alt="Property disputes" />
          </div>
          <div className="prd-diagonal-text">
            <h2>What Are Property Disputes?</h2>
            <p>
              Property disputes arise when conflicts occur over ownership, use,
              transfer, or boundaries of a property. They may involve individuals,
              families, businesses, tenants, landlords, builders, or authorities.
              <br /><br />
              Usually caused by confusion, misunderstanding, or conflict over rights,
              responsibilities, or legal ownership of property.
            </p>
          </div>
        </div>
      </section>

      {/* RENTAL DISPUTES */}
      <section className="prd-diagonal reverse">
        <div className="prd-container prd-diagonal-inner">
          <div className="prd-diagonal-img">
            <img src="/assets/images/rd.png" alt="Rental disputes" />
          </div>
          <div className="prd-diagonal-text">
            <h2>What Are Rental Disputes?</h2>
            <p>
              Rental disputes are conflicts between landlords and tenants regarding rental properties.
              <br /><br />
              Common issues include violations of rental agreements, rent disagreements,
              maintenance problems, deposits, eviction, or property conditions.
            </p>
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="prd-examples-section">
        <div className="prd-container">
          <div className="prd-examples-card">
            <div className="prd-examples-col">
              <h3>Examples of Property Disputes</h3>
              <ul>
                <li>Dispute over ownership</li>
                <li>Arguments about rent or security deposit</li>
                <li>Boundary or land measurement disputes</li>
                <li>Non-payment of rent</li>
                <li>Illegal eviction</li>
                <li>Builder delaying possession</li>
              </ul>
            </div>
            <div className="prd-examples-icon">
              <img src="/assets/icons/house.png" alt="Property Icon" />
            </div>
            <div className="prd-examples-col">
              <h3>Examples of Rental Disputes</h3>
              <ul>
                <li>Non-payment or late payment of rent</li>
                <li>Security deposit conflicts</li>
                <li>Illegal rent increase</li>
                <li>Disagreements about maintenance</li>
                <li>Damage to property</li>
                <li>Eviction or notice period disputes</li>
                <li>Breach of rental agreement terms</li>
              </ul>
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
              <div key={i} className="faq-item">
                <span>{q}</span>
                <span className="faq-arrow">›</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <h2 className="why-choose-title">Why Choose Us</h2>
          <p className="why-choose-subtitle">
            Resolve property and rental conflicts securely, transparently, and legally.
          </p>
          <div className="why-choose-grid">
            {[
              ["fast.png", "Fast Resolution"],
              ["legal.png", "Legally Compliant"],
              ["secure.png", "Secure & Confidential"],
              ["neutral.png", "Neutral Experts"],
              ["24.png", "24/7 Access"],
            ].map(([icon, title]) => (
              <div className="why-choose-item" key={title}>
                <div className="why-icon-circle">
                  <img src={`/assets/icons/${icon}`} alt={title} />
                </div>
                <h4>{title}</h4>
                <p>Resolve disputes quickly and legally through our secure platform.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="contract-cta">
        <div className="contract-cta-box">
          <div className="contract-cta-content">
            <h2>Settle Property & Rental Disputes the Right Way</h2>
            <p>
              From rent disagreements to property ownership disputes, RaaziMarzi
              helps you resolve matters online—fairly, confidentially, and legally.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() => router.push("/login?redirect=/user/file-new-case/step1")}
              >
                Start Property Resolution
              </button>
              <button
                className="cta-secondary"
                onClick={() => router.push("/login?redirect=/user/chats")}
              >
                Consult a Legal Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img src="/assets/images/property.png" alt="Property Resolution" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

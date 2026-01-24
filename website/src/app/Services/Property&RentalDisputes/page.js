"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/property&rentalDispute.css";

export default function PropertyRentalDispute() {
  const [activeTab, setActiveTab] = useState("Cases");

  const tabs = ["Cases", "Money", "Policies", "Resolve Cases", "Victory %", "Ordinary"];

  const questions = [
    "What should I do if I think the contract has been breached?",
    "How do I handle disputes with tenants or landlords?",
    "Can property disputes be resolved online?",
    "What documentation is needed for rental disputes?",
    "How long does it take to resolve a property or rental dispute?",
  ];

  // Use environment variable or fallback
  const APP_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace("https://", "https://app.")
    : "http://localhost:3001";

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
            <span className="highlight">Property</span> &
            <span className="highlight-light">Rental</span> Dispute <br />
            Resolution (ODR)
          </h1>

          <p>
            Fast, fair, and hassle-free Online Dispute Resolution for landlords, tenants, property owners, builders, and housing societies.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() =>
                (window.location.href = `${APP_BASE_URL}/login?redirect=/user/file-new-case/step1`)
              }
            >
              File A Case
            </button>
            <button
              className="btn-dark-exact"
              onClick={() =>
                (window.location.href = `${APP_BASE_URL}/login?redirect=/user/chats`)
              }
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
            <img src="/assets/images/PD.png" alt="Property disputes" />
          </div>
          <div className="prd-diagonal-text">
            <h2>What Are Property Disputes?</h2>
            <p>
              Property disputes arise when conflicts occur over ownership, use, transfer, or boundaries of a property. These disputes may involve individuals, families, businesses, tenants, landlords, builders, or government authorities.
              <br />
              <br />
              They usually occur when there is confusion, misunderstanding, or conflict over rights, responsibilities, or legal ownership of property.
            </p>
          </div>
        </div>
      </section>

      {/* RENTAL DISPUTES */}
      <section className="prd-diagonal reverse">
        <div className="prd-container prd-diagonal-inner">
          <div className="prd-diagonal-img">
            <img src="/assets/images/RD.png" alt="Rental disputes" />
          </div>
          <div className="prd-diagonal-text">
            <h2>What Are Rental Disputes?</h2>
            <p>
              Rental disputes are conflicts or disagreements that occur between a landlord and a tenant regarding a rental property.
              <br /><br />
              These disputes usually arise when either party does not follow the rental agreement, or when there are issues related to rent, maintenance, deposit, eviction, or property conditions.
            </p>
          </div>
        </div>
      </section>

      {/* EXAMPLES SECTION */}
      <section className="prd-examples-section">
        <div className="prd-container">
          <div className="prd-examples-card">
            <div className="prd-examples-col">
              <h3>Examples of Property Disputes</h3>
              <ul>
                <li>Dispute over who owns the property</li>
                <li>Arguments about rent or security deposit</li>
                <li>Boundary or land measurement disputes</li>
                <li>Non-payment of rent</li>
                <li>Illegal eviction or possession issues</li>
                <li>Builder delaying the possession</li>
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
                <li>Disagreements about repairs or maintenance</li>
                <li>Damage to property</li>
                <li>Eviction or notice period disputes</li>
                <li>Breach of rental agreement terms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TYPES OF PROPERTY & RENTAL DISPUTES */}
      <section className="types-prd-section">
        <div className="types-prd-container">
          <h2 className="types-prd-title">Types of Property & Rental Disputes</h2>
          <p className="types-prd-subtitle">
            Resolve business, customer, or personal conflicts through a secure, transparent online platform.
          </p>

          <div className="types-prd-grid">
            {[
              ["Landlord–Tenant Disputes", [
                "Non-payment or delayed rent",
                "Illegal rent increase",
                "Security deposit disputes",
                "Eviction disagreements",
                "Property damage issues",
                "Violation of rental agreement terms",
                "Maintenance & repair disputes",
                "Notice period conflicts",
              ]],
              ["Rental Agreement Disputes", [
                "Dispute over agreement clauses",
                "Early termination disputes",
                "Renewal of rental agreement",
                "Unfair terms or hidden conditions",
              ]],
              ["Property Possession Disputes", [
                "Delayed possession by builders",
                "Forced eviction",
                "Unlawful possession by tenants",
              ]],
              ["Builder–Buyer Disputes", [
                "Delay in handing over property",
                "Poor construction quality",
                "Misrepresentation of property features",
                "Hidden charges & cost escalation",
                "Refusal to refund advance",
              ]],
              ["Neighbourhood & Society Disputes", [
                "Parking disputes",
                "Noise complaints",
                "Common area usage issues",
              ]],
              ["Commercial Property Disputes", [
                "Commercial lease disagreements",
                "Unauthorized subletting",
                "Rent escalation issues",
                "Breach of commercial tenancy agreements",
              ]],
              ["Property Damage & Maintenance Disputes", [
                "Who is responsible for repairs",
                "Excessive maintenance charges",
                "Disputes after property handover",
              ]],
            ].map(([title, items]) => (
              <div className="types-prd-card" key={title}>
                <h4>{title}</h4>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
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
            Resolve business, customer, or personal conflicts through a secure, transparent online platform.
          </p>

          <div className="why-choose-grid">
            {[
              ["Fast.png", "Fast Resolution"],
              ["Legally.png", "Legally Compliant"],
              ["Secure.png", "Secure & Confidential"],
              ["Neutral.png", "Neutral Experts"],
              ["24.png", "24/7 Access"],
            ].map(([icon, title]) => (
              <div className="why-choose-item" key={title}>
                <div className="why-icon-circle">
                  <img src={`/assets/icons/${icon}`} alt={title} />
                </div>
                <h4>{title}</h4>
                <p>Resolve business, customer, or personal conflicts through a secure.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO CAN USE */}
      <section className="who-service-section">
        <div className="who-container">
          <h2>Who Can Use This Service?</h2>
          <p className="who-subtitle">
            Resolve business, customer, or personal conflicts through a secure, transparent online platform.
          </p>

          <div className="who-grid">
            {["Landlords", "Tenants", "Property buyers", "Housing societies", "Real estate agents", "Builders & developers", "Commercial property owners"].map((user) => (
              <div className="who-card" key={user}>{user}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions (FAQ)</h2>
          <p className="faq-subtitle">
            Resolve business, customer, or personal conflicts through a secure, transparent online platform.
          </p>

          <div className="faq-box">
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
              {questions.map((q, idx) => (
                <div className="faq-item" key={idx}>
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
            <h2>Settle Property & Rental Disputes the Right Way</h2>
            <p>
              From rent disagreements and possession issues to maintenance and property ownership disputes, RaaziMerzi helps you resolve matters online—fairly, confidentially, and legally.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() =>
                  (window.location.href = `${APP_BASE_URL}/login?redirect=/user/file-new-case/step1`)
                }
              >
                Start Property Resolution
              </button>
              <button
                className="cta-secondary"
                onClick={() =>
                  (window.location.href = `${APP_BASE_URL}/login?redirect=/user/chats`)
                }
              >
                Consult a Legal Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img src="/assets/images/property.png" alt="Contract Resolution" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

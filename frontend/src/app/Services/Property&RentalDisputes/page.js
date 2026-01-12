"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/property&rentalDispute.css";

export default function PropertyRentalDispute() {
  const [activeTab, setActiveTab] = useState("Cases");

  const tabs = ["Cases", "Money", "Policies", "Resolve Cases", "Victory %", "Ordinary"];

  const questions = Array(5).fill(
    "What should I do if I think the contract has been breached?"
  );

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
    <span className="cd-pill-exact">Property & Rental Dispute Resolution (ODR)</span>

    <h1>
       <span className="highlight">Property</span> &
      <span className="highlight-light">Rental</span> Dispute  <br /> 
      Resolution (ODR)
    </h1>

    <p>
     Fast, fair, and hassle-free Online Dispute Resolution for landlords, tenants, property owners, builders, and housing societies.
    </p>

    <div className="hero-buttons">
      <button className="btn-primary-exact">File A Case</button>
      <button className="btn-dark-exact">Talk To Expert</button>
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
              Property disputes arise when conflicts occur over ownership, use,
              transfer, or boundaries of a property. These disputes may involve
              individuals, families, businesses, tenants, landlords, builders,
              or government authorities.
              <br />

              <br />They usually occur when there is confusion, misunderstanding, or conflict over rights, responsibilities, or legal ownership of property.
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
              Rental disputes are conflicts or disagreements that occur between a landlord and a tenant regarding a rental property.and without lengthy court battles.

              <br /> <br />These disputes usually arise when either party does not follow the rental agreement, or when there are issues related to rent, maintenance, deposit, eviction, or property conditions.tenant regarding a rental property.and without lengthy court battles.
            </p>
          </div>
        </div>
      </section>

   {/* EXAMPLES SECTION */}
<section className="prd-examples-section">
  <div className="prd-container">
    <div className="prd-examples-card">

      {/* LEFT */}
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

      {/* CENTER ICON */}
      <div className="prd-examples-icon">
        <img src="/assets/icons/house.png" alt="Property Icon" />
      </div>

      {/* RIGHT */}
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

    <h2 className="types-prd-title">
      Types of Property & Rental Disputes
    </h2>
    <p className="types-prd-subtitle">
      Resolve business, customer, or personal conflicts through a secure,
      transparent online platform.
    </p>

    <div className="types-prd-grid">

      <div className="types-prd-card">
        <h4>Landlord–Tenant Disputes</h4>
        <ul>
          <li>Non-payment or delayed rent</li>
          <li>Illegal rent increase</li>
          <li>Security deposit disputes</li>
          <li>Eviction disagreements</li>
          <li>Property damage issues</li>
          <li>Violation of rental agreement terms</li>
          <li>Maintenance & repair disputes</li>
          <li>Notice period conflicts</li>
        </ul>
      </div>

      <div className="types-prd-card">
        <h4>Rental Agreement Disputes</h4>
        <ul>
          <li>Dispute over agreement clauses</li>
          <li>Early termination disputes</li>
          <li>Renewal of rental agreement</li>
          <li>Unfair terms or hidden conditions</li>
        </ul>
      </div>

      <div className="types-prd-card">
        <h4>Property Possession Disputes</h4>
        <ul>
          <li>Delayed possession by builders</li>
          <li>Forced eviction</li>
          <li>Unlawful possession by tenants</li>
        </ul>
      </div>

      <div className="types-prd-card">
        <h4>Builder–Buyer Disputes</h4>
        <ul>
          <li>Delay in handing over property</li>
          <li>Poor construction quality</li>
          <li>Misrepresentation of property features</li>
          <li>Hidden charges & cost escalation</li>
          <li>Refusal to refund advance</li>
        </ul>
      </div>

      <div className="types-prd-card">
        <h4>Neighbourhood & Society Disputes</h4>
        <ul>
          <li>Parking disputes</li>
          <li>Noise complaints</li>
          <li>Common area usage issues</li>
        </ul>
      </div>

      <div className="types-prd-card">
        <h4>Commercial Property Disputes</h4>
        <ul>
          <li>Commercial lease disagreements</li>
          <li>Unauthorized subletting</li>
          <li>Rent escalation issues</li>
          <li>Breach of commercial tenancy agreements</li>
        </ul>
      </div>

      <div className="types-prd-card">
        <h4>Property Damage & Maintenance Disputes</h4>
        <ul>
          <li>Who is responsible for repairs</li>
          <li>Excessive maintenance charges</li>
          <li>Disputes after property handover</li>
        </ul>
      </div>

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

      {/* WHO CAN USE */}
 <section className="who-service-section">
  <div className="who-container">
    <h2>Who Can Use This Service?</h2>
    <p className="who-subtitle">
      Resolve business, customer, or personal conflicts through a secure,
      transparent online platform.
    </p>

    <div className="who-grid">
      <div className="who-card">Landlords</div>
      <div className="who-card">Tenants</div>
      <div className="who-card">Property buyers</div>
      <div className="who-card">Housing societies</div>
      <div className="who-card">Real estate agents</div>
      <div className="who-card">Builders & developers</div>
      <div className="who-card">Commercial property owners</div>
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
      <h2>Settle Property & Rental Disputes the Right Way</h2>

      <p>
        From rent disagreements and possession issues to maintenance and property ownership disputes, RaaziMerzi helps you resolve matters online—fairly, confidentially, and legally.
      </p>

      <div className="contract-cta-buttons">
        <button className="cta-primary">Start Property Resolution</button>
        <button className="cta-secondary">Consult a Legal Expert</button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="contract-cta-image">
      <img src="/assets/images/property.png" alt="Contract Resolution" />
    </div>

  </div>
</section>


      <Footer />
    </>
  );
}

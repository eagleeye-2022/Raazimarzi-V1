"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/property&rentalDispute.css";

const APP_BASE_PATH = "/app";

export default function PropertyRentalDispute() {
  const [activeTab, setActiveTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const router = useRouter();

  const tabs = ["Cases", "Money", "Policies", "Resolve Cases", "Victory %", "Ordinary"];

  const questions = [
    "What should I do if I think the contract has been breached?",
    "How do I handle disputes with tenants or landlords?",
    "Can property disputes be resolved online?",
    "What documentation is needed for rental disputes?",
    "How long does it take to resolve a property or rental dispute?",
  ];

  const goToLogin = (redirectPath = "") => {
    const query = redirectPath ? `?redirect=${redirectPath}` : "";
    router.push(`${APP_BASE_PATH}/login${query}`);
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
          <span className="cd-pill-exact">
            Property & Rental Dispute Resolution (ODR)
          </span>

          <h1>
            <span className="highlight">Property</span> &{" "}
            <span className="highlight-light">Rental</span> Dispute <br />
            Resolution (ODR)
          </h1>

          <p>
            Fast, fair, and hassle-free Online Dispute Resolution for landlords,
            tenants, property owners, builders, and housing societies.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary-exact"
              onClick={() =>
                goToLogin("/user/file-new-case/step1")
              }
            >
              File A Case
            </button>

            <button
              className="btn-dark-exact"
              onClick={() =>
                goToLogin("/user/chats")
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
              Rental disputes are conflicts between landlords and tenants regarding
              rental properties.
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

      {/* FAQ SECTION – interactive */}
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
                    This is the answer for <b>{q}</b>. Replace with actual FAQ answer.
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
            <h2>Settle Property & Rental Disputes the Right Way</h2>
            <p>
              From rent disagreements to property ownership disputes, RaaziMarzi
              helps you resolve matters online—fairly, confidentially, and legally.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() =>
                  goToLogin("/user/file-new-case/step1")
                }
              >
                Start Property Resolution
              </button>

              <button
                className="cta-secondary"
                onClick={() =>
                  goToLogin("/user/chats")
                }
              >
                Consult a Legal Expert
              </button>
            </div>
          </div>

          <div className="contract-cta-image">
            <img
              src="/assets/images/property.png"
              alt="Property Resolution"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

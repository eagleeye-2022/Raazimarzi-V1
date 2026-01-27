"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/contractDisputes.css";
import { APP_BASE_PATH } from "@/config/appConfig";

export default function ContractDisputes() {
  const [activeTab, setActiveTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const router = useRouter();

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

  const goToLogin = (redirectPath = "") => {
    const redirectQuery = redirectPath ? `?redirect=${redirectPath}` : "";
    router.push(`${APP_BASE_PATH}/login${redirectQuery}`);
  };

  function AccordionItem({ title }) {
    const [open, setOpen] = useState(false);

    return (
      <div className={`cd-accordion-item ${open ? "open" : ""}`}>
        <div
          className="cd-accordion-header"
          onClick={() => setOpen(!open)}
        >
          <div>
            <h4>{title}</h4>
            <p>
              When one party fails to fulfill their contractual
              obligations...
            </p>
          </div>
          <span className="cd-accordion-arrow">{open ? "−" : "›"}</span>
        </div>

        {open && (
          <div className="cd-accordion-body">
            Detailed explanation about{" "}
            {title.toLowerCase()} and how we help resolve such
            disputes efficiently.
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

      {/* WHAT IS CONTRACT DISPUTE */}
      <section className="cd-what-figma">
        <div className="cd-what-box">
          <div className="cd-what-circles">
            <img src="/assets/icons/circle1.png" alt="" className="circle c1" />
            <img src="/assets/icons/circle2.png" alt="" className="circle c2" />
            <img src="/assets/icons/circle3.png" alt="" className="circle c3" />
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

            <div className="cd-divider"></div>

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
            <img src="/assets/images/CD.png" alt="Contract Disputes" />
          </div>

          <div className="cd-list-content">
            <h2>Contract Disputes</h2>

            <div className="cd-accordion-figma">
              {["Breach of Contract","Payment Disputes","Non-performance","Delay in Delivery"].map((title, index) => (
                <AccordionItem key={index} title={title} />
              ))}
            </div>

            <button className="cd-see-more">
              See More
            </button>
          </div>
        </div>
      </section>

      {/* FAQ – EXPAND / COLLAPSE */}
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
            <h2>Resolve Contract Disputes Without Court Delays</h2>

            <p>
              Whether it’s a breach of contract, unpaid dues,
              or service agreement issues, RaaziMarzi helps
              you resolve contract disputes online—securely,
              legally, and efficiently.
            </p>

            <div className="contract-cta-buttons">
              <button
                className="cta-primary"
                onClick={() =>
                  goToLogin("/user/file-new-case/step1")
                }
              >
                Start Contract Resolution
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
              src="/assets/images/contract.png"
              alt="Contract Resolution"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

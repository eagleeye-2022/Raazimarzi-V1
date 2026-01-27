"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import "@/styles/aboutUs.css";
import { APP_BASE_PATH } from "@/config/appConfig";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("Cases");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [openWhatWeDoIndex, setOpenWhatWeDoIndex] = useState(null);

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
    "How do I resolve disputes with landlords or tenants?",
    "Can small business disputes be resolved online?",
    "What documents are required for filing a complaint?",
    "How long does it take to resolve a dispute online?",
  ];

  const whatWeDoItems = [
    {
      title: "Consumer Disputes",
      desc:
        "Resolve issues related to defective products, poor services, or unfair trade practices through online mediation.",
    },
    {
      title: "Property & Rental Disputes",
      desc:
        "Handle disputes between landlords and tenants including rent, eviction, and maintenance issues without court visits.",
    },
    {
      title: "Contract Disputes",
      desc:
        "When one party fails to fulfil their contractual obligations, we help both sides reach a fair resolution.",
    },
    {
      title: "Partnership Disputes",
      desc:
        "Resolve conflicts between business partners related to roles, profit sharing, or business operations.",
    },
  ];

  const goToLogin = (redirectPath = "") => {
    const redirectQuery = redirectPath ? `?redirect=${redirectPath}` : "";
    router.push(`${APP_BASE_PATH}/login${redirectQuery}`);
  };

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="about-hero-exact">
        <img
          src="/assets/icons/left-circle.png"
          alt=""
          className="about-circle left"
        />
        <img
          src="/assets/icons/right-circle.png"
          alt=""
          className="about-circle right"
        />

        <div className="about-hero-content">
          <span className="about-pill">About Us</span>

          <h1>
            Empowering <span className="highlight">Fair & Fast</span> Online
            <br />
            Dispute Resolution
          </h1>

          <p>
            RaaziMarzi is an ODR platform helping individuals, businesses, and
            professionals resolve disputes quickly and transparently.
          </p>

          <div className="about-hero-buttons">
            <button
              className="btn-primary"
              onClick={() => goToLogin("/user/file-new-case/step1")}
            >
              File A Case
            </button>

            <Link href="/ContactUs" className="btn-dark">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-story-exact">
        <div className="about-story-box">
          <h2>Our Story</h2>
          <p className="story-subtitle">The story you should know</p>

          <div className="story-grid-exact">
            {[
              {
                title: "Why was RaaziMarzi created?",
                items: [
                  "To solve the growing problem of delayed justice and overloaded courts in India.",
                  "To provide a simple, accessible, and affordable way for people to resolve their disputes.",
                  "To eliminate stress, paperwork, and long waiting periods for common disputes.",
                ],
              },
              {
                title: "What problem do we aim to solve?",
                items: [
                  "Traditional legal processes are slow, expensive, and confusing for most individuals and businesses.",
                  "Most disputes are small but still end up taking months or years to resolve.",
                  "People hesitate to take legal action due to lack of guidance and high costs.",
                ],
              },
              {
                title:
                  "What inspired the idea of an Online Dispute Resolution platform?",
                items: [
                  "The rising need for digital solutions in legal services.",
                  "Government push towards ODR and online justice systems.",
                  "A vision to modernize justice and make it as simple as filing a complaint online.",
                ],
              },
              {
                title: "Who is RaaziMarzi built for?",
                items: [
                  "Anyone who wants fair, fast, and stress-free conflict resolution.",
                  "Individuals who face consumer, rental, employment, or money recovery disputes.",
                  "Small businesses & startups who want quick business resolution.",
                  "Professionals and partners dealing with contract or partnership disputes.",
                ],
              },
            ].map(({ title, items }) => (
              <div key={title} className="story-item">
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

      {/* MISSION & VISION */}
      <section className="about-mv">
        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-image">
              <img src="/assets/images/mission.png" alt="Mission" />
            </div>
            <h4>Our Mission</h4>
            <p>
              To simplify dispute resolution through technology, making justice
              accessible, affordable, and efficient.
            </p>
          </div>

          <div className="mv-card">
            <div className="mv-image">
              <img src="/assets/images/vision-1.png" alt="Vision" />
            </div>
            <h4>Our Vision</h4>
            <p>
              Building India’s most trusted online ecosystem for resolving
              disputes without stress or delays.
            </p>
          </div>
        </div>
      </section>


      {/* WHAT WE DO – EXPAND / COLLAPSE */}
      <section className="what-we-do-exact">
        <div className="what-we-do-container">
          <div className="what-we-do-image">
            <img src="/assets/images/cd.png" alt="What RaaziMarzi Do" />
          </div>

          <div className="what-we-do-content">
            <h3>What RaaziMarzi Do?</h3>

            <div className="what-we-do-list">
              {whatWeDoItems.map((item, index) => (
                <div key={item.title}>
                  <div
                    className="what-we-do-item"
                    onClick={() =>
                      setOpenWhatWeDoIndex(
                        openWhatWeDoIndex === index ? null : index
                      )
                    }
                  >
                    <div>
                      <h4>{item.title}</h4>
                    </div>
                    <span className="what-we-do-arrow">
                      {openWhatWeDoIndex === index ? "−" : "›"}
                    </span>
                  </div>

                  {openWhatWeDoIndex === index && (
                    <div
                      style={{
                        padding: "10px 0 14px 0",
                        fontSize: "14px",
                        color: "#6b7280",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="what-we-do-btn">See More</button>
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="our-value-exact">
        <div className="our-value-container">
          <h2>Our Value</h2>
          <p className="our-value-sub">The story you should know</p>

          <div className="our-value-grid">
            {[
              ["responsibility.png", "Responsibility"],
              ["integrity.png", "Integrity"],
              ["transparency.png", "Transparency"],
              ["empathy.png", "Empathy"],
              ["innovation.png", "Innovation"],
              ["security.png", "Security"],
            ].map(([icon, label]) => (
              <div key={label} className="our-value-item">
                <div className="our-value-circle">
                  <img src={`/assets/icons/${icon}`} alt={label} />
                </div>
                <p className="our-value-label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ – EXPAND / COLLAPSE */}
      <section className="faq-section">
        <div className="pd-container">
          <h2 className="faq-title">Frequently Asked Questions (FAQ)</h2>
          <p className="faq-subtitle">
            Resolve business, customer, or personal conflicts through a secure,
            transparent online platform.
          </p>

          <div className="faq-container">
            <div className="faq-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`faq-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setOpenFaqIndex(null);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="faq-list">
              {questions.map((q, index) => (
                <div key={index}>
                  <div
                    className="faq-item"
                    onClick={() =>
                      setOpenFaqIndex(
                        openFaqIndex === index ? null : index
                      )
                    }
                  >
                    <span>{q}</span>
                    <span className="faq-arrow">
                      {openFaqIndex === index ? "−" : "›"}
                    </span>
                  </div>

                  {openFaqIndex === index && (
                    <div
                      style={{
                        padding: "12px 10px",
                        fontSize: "13px",
                        color: "#4b5563",
                        lineHeight: "1.6",
                      }}
                    >
                      This is the answer for: <b>{q}</b>. Replace with actual
                      FAQ content.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}


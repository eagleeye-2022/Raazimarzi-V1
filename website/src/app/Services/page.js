"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/service.css";

const whyIcons = [
  { src: "/assets/icons/fastresol.png", label: "Fast Resolution" },
  { src: "/assets/icons/legallycom.png", label: "Legally Compliant" },
  { src: "/assets/icons/s&c.png", label: "Secure & Confidential" },
  { src: "/assets/icons/neutralexp.png", label: "Neutral Experts" },
  { src: "/assets/icons/247.png", label: "24/7 Access" },
];

export default function Services() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [whyVisible, setWhyVisible] = useState(false);
  const [hiwVisible, setHiwVisible] = useState(false);
  const [expertiseState, setExpertiseState] = useState("stacked");

  const whyRef = useRef(null);
  const hiwRef = useRef(null);
  const aboutRef = useRef(null);
  const expertiseRef = useRef(null);

  useEffect(() => {
    const el = hiwRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHiwVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = whyRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setWhyVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── ABOUT / STATS observer — direct DOM toggle ── */
  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("about-animate");
          obs.disconnect();
        }
      },
      { threshold: 0.10 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = expertiseRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setExpertiseState("spread"); }
        else { setExpertiseState("stacked"); }
      },
      { threshold: [0, 0.15] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const navigateToApp = useCallback((path = "/login", queryParams = {}) => {
    try {
      const searchParams = new URLSearchParams(queryParams);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
      window.location.href = `${APP_BASE_PATH}${path}${query}`;
    } catch {
      window.location.href = `${APP_BASE_PATH}/login`;
    }
  }, []);

  const toggleFaq = (i) => setOpenFaqIndex(openFaqIndex === i ? null : i);
  const prevTestimonial = () => setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const nextTestimonial = () => setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const getSlotIndex = (offset) => {
    const len = testimonials.length;
    return ((testimonialIdx + offset) % len + len) % len;
  };
  const slots = [-2, -1, 0, 1, 2];

  return (
    <>
      <Header />

      {/* ── HERO ── */}
      <section className="svc-hero">
        <div className="svc-hero-wrap">

          <div className="svc-hero-side svc-hero-side-left">
            <div className="svc-hero-profile">
              <div className="svc-ring-fade"></div>
              <div className="svc-ring-outer"></div>
              <div className="svc-ring-inner"></div>

              <div className="svc-hero-avatar">
                <img src="/assets/images/ring1.png" alt="Mediator" />
              </div>
            </div>

            <img src="/assets/icons/carrow1.png" alt="" className="svc-hero-arrow-left" />
            <img src="/assets/icons/lm.png" alt="Legal Mediation" className="svc-hero-legal-tag" />
          </div>

          {/* Centre content */}
          <div className="svc-hero-content">
            <div className="svc-hero-pill">WE HANDLE EVERY DISPUTE PROFESSIONALLY</div>
            <h1 className="svc-hero-title">Alternative Dispute Resolution<br />Services</h1>
            <p className="svc-hero-sub">
              With a track record of successfully resolving a wide range of legal issues, we&apos;re
              committed to protecting your interests and helping you achieve peace of mind.
            </p>
            <div className="svc-hero-actions">
              <button
                className="svc-btn-primary svc-btn-hammer"
                onClick={() => navigateToApp("/user/file-new-case/step1")}
              >
                <span className="svc-btn-label">Discover Our Services</span>
                <span className="svc-btn-hammer-wrap" aria-hidden="true">
                  <img src="/assets/icons/hammer.png" alt="" className="svc-hammer-icon" />
                </span>
              </button>
              <Link href="/ContactUs" className="svc-btn-secondary">Learn More</Link>
            </div>
          </div>

          <div className="svc-hero-side svc-hero-side-right">
            <img src="/assets/icons/tag.png" alt="" className="svc-hero-top-badge" />
            <img src="/assets/icons/carrow2.png" alt="" className="svc-hero-arrow-right" />

            <div className="svc-hero-profile">
              <div className="svc-ring-fade"></div>
              <div className="svc-ring-outer"></div>
              <div className="svc-ring-inner"></div>

              <div className="svc-hero-avatar">
                <img src="/assets/images/ring2.png" alt="Legal Expert" />
              </div>
            </div>
          </div>

          <div className="svc-hero-scroll"><span>&#8595;</span></div>
        </div>
      </section>

      {/* ── EXPERTISE ── */}
      <section ref={expertiseRef} className={`svc-expertise exp-${expertiseState}`}>
        <div className="svc-container">
          <div className="exp-header">
            <p className="svc-eyebrow">SPECIALIZED AREAS</p>
            <h2 className="svc-section-title">Our Legal Expertise</h2>
            <p className="svc-section-sub">Providing specialized ODR solutions across diverse sectors to ensure comprehensive legal support.</p>
          </div>
          <div className="exp-deck">
            <div className="svc-expertise-card exp-card exp-card-1">
              <Link href="/Services/Property&RentalDisputes" className="svc-arrow-link" aria-label="Explore Individual Disputes">
                <img src="/assets/icons/ar.png" alt="" aria-hidden="true" />
              </Link>
              <div className="svc-expertise-icon"><img src="/assets/icons/sa-icon1.png" alt="" aria-hidden="true" /></div>
              <h3 className="svc-card-title">Individual Disputes</h3>
              <p className="svc-card-desc">Resolve personal disputes related to property, family matters, rental issues, and financial conflicts through secure online mediation.</p>
              <ul className="svc-card-list">
                <li>Property &amp; Rental Disputes</li>
                <li>Family Disputes</li>
                <li>Personal Loan &amp; Borrowing</li>
                <li>Construction Issues</li>
              </ul>
              <Link href="/Services/Property&RentalDisputes" className="svc-explore-link">EXPLORE DISPUTES &#8594;</Link>
            </div>
            <div className="svc-expertise-card exp-card exp-card-2">
              <Link href="/Services/ConsumerDisputes" className="svc-arrow-link" aria-label="Explore Consumer Disputes">
                <img src="/assets/icons/ar.png" alt="" aria-hidden="true" />
              </Link>
              <div className="svc-expertise-icon"><img src="/assets/icons/sa-icon2.png" alt="" aria-hidden="true" /></div>
              <h3 className="svc-card-title">Consumer Disputes</h3>
              <p className="svc-card-desc">Resolve issues related to defective products, poor services, delivery problems, and refund disputes quickly and efficiently.</p>
              <ul className="svc-card-list">
                <li>Product Complaints</li>
                <li>Service Complaints</li>
                <li>Delivery Issues</li>
                <li>Refunds &amp; Billing Disputes</li>
              </ul>
              <Link href="/Services/ConsumerDisputes" className="svc-explore-link">EXPLORE DISPUTES &#8594;</Link>
            </div>
            <div className="svc-expertise-card exp-card exp-card-3">
              <Link href="/Services/ContractDisputes" className="svc-arrow-link" aria-label="Explore Commercial Disputes">
                <img src="/assets/icons/ar.png" alt="" aria-hidden="true" />
              </Link>
              <div className="svc-expertise-icon"><img src="/assets/icons/sa-icon3.png" alt="" aria-hidden="true" /></div>
              <h3 className="svc-card-title">Commercial Disputes</h3>
              <p className="svc-card-desc">Address business conflicts including contract disputes, payment recovery, partnership issues, and vendor disputes.</p>
              <ul className="svc-card-list">
                <li>Contract Disputes</li>
                <li>Partnership Disputes</li>
                <li>Employment Disputes</li>
                <li>Vendor &amp; Supplier Disputes</li>
              </ul>
              <Link href="/Services/ContractDisputes" className="svc-explore-link">EXPLORE DISPUTES &#8594;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      {/* NOTE: className is just "svc-about" — the "about-animate" class is added directly via DOM in useEffect */}
      <section ref={aboutRef} className="svc-about">
        <div className="svc-container svc-about-grid">
          <div className="svc-about-img">
            <div className="svc-about-ring-wrap">
              <div className="svc-about-ring-spinner">
                <div className="svc-about-ring-inner">
                  <img src="/assets/images/abt.png" alt="RaaziMarzi dispute resolution illustration" />
                </div>
              </div>
            </div>
          </div>
          <div className="svc-about-content">
            <p className="svc-eyebrow svc-eyebrow-left">ABOUT RAAZIMARZI</p>
            <h2 className="svc-section-title svc-left">Your Trusted ADR Platform for Modern Disputes</h2>
            <p className="svc-about-text">
              RaaziMarzi leverages cutting-edge Online Dispute Resolution technology to provide
              transparent, efficient, and legally binding settlements for individuals and businesses alike.
            </p>

            {/* Stats */}
            <div className="svc-stats">
              <div className="svc-stat">
                <span className="svc-stat-num svc-stat-fall svc-stat-fall-1">98%</span>
                <span className="svc-stat-label">SUCCESS RATE</span>
              </div>
              <div className="svc-stat">
                <span className="svc-stat-num svc-stat-fall svc-stat-fall-2">1M+</span>
                <span className="svc-stat-label">CASES RESOLVED</span>
              </div>
              <div className="svc-stat">
                <span className="svc-stat-num svc-stat-fall svc-stat-fall-3">50M+</span>
                <span className="svc-stat-label">SETTLED FUNDS</span>
              </div>
            </div>

            <button
              className="svc-btn-about-learn"
              onClick={() => navigateToApp("/user/file-new-case/step1")}
            >
              <span className="svc-about-icon-wrap" aria-hidden="true">
                <span className="svc-about-icon">→≡</span>
              </span>
              <span className="svc-about-btn-label">Know More</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={hiwRef} className={`hiw-section${hiwVisible ? " hiw-animate" : ""}`}>
        <div className="hiw-header">
          <p className="hiw-eyebrow">3 SIMPLE STEPS</p>
          <h2 className="hiw-title">How It Works</h2>
          <p className="hiw-sub">A simple and secure process to resolve disputes online.</p>
        </div>
        <div className="hiw-stage">
          <svg className="hiw-wave" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path className="hiw-wave-path" d="M-60,130 C120,260 240,260 400,130 C560,0 680,0 840,130 C1000,260 1120,260 1260,130" fill="none" stroke="#7c5cbf" strokeWidth="2.2" strokeDasharray="7 10" strokeLinecap="round" />
          </svg>
          <div className="hiw-dot hiw-dot-1" aria-hidden="true"><img src="/assets/icons/1.png" alt="" /></div>
          <div className="hiw-dot hiw-dot-2" aria-hidden="true"><img src="/assets/icons/2.png" alt="" /></div>
          <div className="hiw-dot hiw-dot-3" aria-hidden="true"><img src="/assets/icons/3.png" alt="" /></div>
          <div className="hiw-step hiw-step-1">
            <div className="hiw-ghost" aria-hidden="true">1</div>
            <h4>Submit Your Case</h4>
            <p>Provide your dispute details and upload necessary documents securely.</p>
          </div>
          <div className="hiw-step hiw-step-2">
            <div className="hiw-ghost" aria-hidden="true">2</div>
            <h4>Mediation &amp; Discussion</h4>
            <p>The other party is notified and a mediator facilitates discussion between both sides.</p>
          </div>
          <div className="hiw-step hiw-step-3">
            <div className="hiw-ghost" aria-hidden="true">3</div>
            <h4>Resolution</h4>
            <p>Reach a fair agreement or get a final decision through arbitration.</p>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ── */}
      <section ref={whyRef} className={`id-why${whyVisible ? " why-animate" : ""}`}>
        <div className="id-container">
          <div className="id-section-head center">
            <p className="id-tag">WHY CHOOSE US</p>
            <h2>Why Choose RaaziMarzi</h2>
            <p className="id-section-sub">A faster, secure, and reliable way to resolve disputes without lengthy court procedures.</p>
          </div>
          <div className="id-why-grid">
            {whyIcons.map((item, index) => (
              <div key={index} className="id-why-card">
                <div className="id-why-circle">
                  <img src={item.src} alt={item.label} />
                </div>
                <h4>{item.label}</h4>
                <p>Resolve business, customer, or personal conflicts through a secure platform.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-cta">
        <div className="svc-cta-overlay">
          <div className="svc-container svc-cta-inner">
            <h2 className="svc-cta-title">Ready to find a peaceful resolution?</h2>
            <p className="svc-cta-text">Join thousands of individuals who have settled their disputes with dignity and legal certainty.</p>
            <button className="svc-cta-btn" onClick={() => navigateToApp("/user/file-new-case/step1")}>File a Case</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
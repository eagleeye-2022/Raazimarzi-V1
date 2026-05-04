"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/individualDisputes.css";

const whyIcons = [
  { src: "/assets/icons/fastresol.png", label: "Fast Resolution" },
  { src: "/assets/icons/legallycom.png", label: "Legally Compliant" },
  { src: "/assets/icons/s&c.png", label: "Secure & Confidential" },
  { src: "/assets/icons/neutralexp.png", label: "Neutral Experts" },
  { src: "/assets/icons/247.png", label: "24/7 Access" },
];

const testimonialData = [
  { name: "Tenant, Hyderabad", img: "/assets/images/t1.png", text: "The platform made it easy to handle a payment dispute with a client. The mediation process was smooth, and everything was managed online without any hassle. Highly recommended for resolving business conflicts!" },
  { name: "User, Indore", img: "/assets/images/t2.png", text: "Very smooth and simple process. The team handled things professionally and made communication much easier." },
  { name: "Resident, Pune", img: "/assets/images/t3.png", text: "A very effective way to settle disputes without going through lengthy legal processes." },
  { name: "Client, Mumbai", img: "/assets/images/t4.png", text: "The case process was transparent and easy to understand. Good experience overall." },
  { name: "Landlord, Delhi", img: "/assets/images/t5.png", text: "I was able to resolve my rental dispute efficiently and without unnecessary delays." },
];

const faqData = [
  { question: "Is my privacy protected during the process?", answer: "Yes, absolutely. All discussions held within RaaziMarzi are confidential and cannot be used in a court of law without legal prejudice. This allows both parties to speak freely without fear of legal repercussions." },
  { question: "Can I bring my own lawyer to the session?", answer: "Yes, you may involve your legal advisor if needed. However, the process is designed to remain simple, structured, and less intimidating than traditional court proceedings." },
  { question: "What happens if the other party refuses to join?", answer: "If the other party declines to participate, the matter may not proceed through online dispute resolution. In such cases, our team can guide you on possible next steps." },
  { question: "How long does the average case take?", answer: "Most individual disputes are resolved much faster than traditional legal routes, depending on complexity and responsiveness from both parties." },
];

const causeCards = [
  { title: "Family Disputes", desc: "Conflicts related to relationships, responsibilities, or property division." },
  { title: "Property Conflicts", desc: "Ownership disputes, boundary issues, or landlord-tenant problems." },
  { title: "Payment Issues", desc: "Disputes caused by unpaid dues, loans, or financial disagreements." },
  { title: "Explore Disputes", desc: "Conflicts related to relationships, responsibilities, or property division." },
];

const IndividualDisputes = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [cardsSpread, setCardsSpread] = useState(false);
  const [hiwVisible, setHiwVisible] = useState(false);
  const [whyVisible, setWhyVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);

  const cardsRowRef = useRef(null);
  const hiwRef = useRef(null);
  const whyRef = useRef(null);
  const aboutRef = useRef(null);

  /* ── Spread cards when section scrolls into view ── */
  useEffect(() => {
    const el = cardsRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCardsSpread(true); observer.disconnect(); } },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Trigger HIW animation when section enters viewport ── */
  useEffect(() => {
    const el = hiwRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHiwVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Trigger Why section animation when it enters viewport ── */
  useEffect(() => {
    const el = whyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setWhyVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Trigger About section animation when it enters viewport ── */
  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAboutVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const prevT = () => setActiveTestimonial((prev) => (prev === 0 ? testimonialData.length - 1 : prev - 1));
  const nextT = () => setActiveTestimonial((prev) => (prev === testimonialData.length - 1 ? 0 : prev + 1));
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);


  const getIndex = (offset) => {
    const len = testimonialData.length;
    return ((activeTestimonial + offset) % len + len) % len;
  };
  const slots = [-2, -1, 0, 1, 2];

  return (
    <>
      <Header />

      <div className="id-page">

        {/* ── HERO ── */}
        <section className="id-hero">
          {/*
            FIX: was className="id-container id-hero-wrap" which caused
            .id-hero-wrap's max-width:100% to override the container's 1220px.
            Split into wrapper + inner div so container controls width correctly.
          */}
          <div className="id-container">
            <div className="id-hero-wrap">
              <div className="id-hero-left">
                <p className="id-tag">INDIVIDUAL DISPUTES</p>
                <h1>Resolve Personal Disputes<br />Quickly &amp; Securely</h1>
                <p className="id-hero-desc">
                  RaaziMarzi helps individuals resolve property disputes, family conflicts, rental issues,
                  and personal loan disputes through secure online mediation and arbitration.
                </p>
                <div className="id-hero-btns">
                  <button className="id-btn-primary">File a Case</button>
                  <button className="id-btn-secondary">Learn More</button>
                </div>
              </div>
              <div className="id-hero-right">
                <img src="/assets/images/indihero.png" alt="Individual disputes illustration" />
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT ARE INDIVIDUAL DISPUTES ── */}
        <section ref={aboutRef} className={`id-about${aboutVisible ? " about-animate" : ""}`}>
          <div className="id-container">
            <div className="id-section-head center">
              <p className="id-tag">INDIVIDUAL DISPUTES</p>
              <h2>What Are Individual Disputes And Its Causes?</h2>
            </div>
            <div className="id-about-grid">
              <div className="id-about-left">
                <p>
                  Individual disputes are conflicts between individuals involving personal matters such as
                  property, family issues, rental agreements, loans, or construction concerns. RaaziMarzi
                  helps resolve these disputes through secure online mediation and arbitration without the
                  need for lengthy court procedures.
                </p>
                <button className="id-btn-primary">File a case</button>
              </div>
              <div className="id-cause-grid">
                {causeCards.map((c, index) => (
                  <div key={index} className="id-cause-card">
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TYPES OF DISPUTES ── */}
        <section className="id-types">
          <div className="id-container">
            <div className="id-section-head center">
              <p className="id-tag">SPECIALIZED AREAS</p>
              <h2>Types of Individual Disputes We Handle</h2>
              <p className="id-section-sub">
                Providing solutions for common personal disputes through secure online mediation.
              </p>
            </div>
            <div ref={cardsRowRef} className={`id-cards-row${cardsSpread ? " is-spread" : ""}`}>

              <div className="id-flip-card">
                <div className="id-flip-inner">
                  <div className="id-flip-front">
                    <img src="/assets/images/pd1.png" alt="Property & Rental Disputes" />
                  </div>
                  <div className="id-flip-back">
                    <h4>Neighbour &amp; Community Disputes</h4>
                    <p>Neighbour and community disputes arise from conflicts between individuals living in shared or nearby spaces. These may include noise complaints, parking issues, maintenance concerns, or privacy and safety disagreements.</p>
                    <span className="id-flip-explore">EXPLORE MORE &nbsp;&#8594;</span>
                    <div className="id-flip-deco"><img src="/assets/icons/pd-i1.png" alt="" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>

              <div className="id-flip-card">
                <div className="id-flip-inner">
                  <div className="id-flip-front">
                    <img src="/assets/images/pd3.png" alt="Personal Loan & Borrowing" />
                  </div>
                  <div className="id-flip-back">
                    <h4>Property &amp; Rental Disputes</h4>
                    <p>Property and rental disputes include landlord-tenant conflicts, rent agreement issues, property ownership disputes, and boundary disagreements. These can be resolved efficiently through online dispute resolution.</p>
                    <span className="id-flip-explore">EXPLORE MORE &nbsp;&#8594;</span>
                    <div className="id-flip-deco"><img src="/assets/icons/pd-i2.png" alt="" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>

              <div className="id-flip-card">
                <div className="id-flip-inner">
                  <div className="id-flip-front">
                    <img src="/assets/images/pd2.png" alt="Family Disputes" />
                  </div>
                  <div className="id-flip-back">
                    <h4>Family Disputes</h4>
                    <p>Family disputes include divorce cases, child custody issues, alimony or maintenance claims, and family property conflicts. These can be resolved through structured mediation and online dispute resolution.</p>
                    <span className="id-flip-explore">EXPLORE MORE &nbsp;&#8594;</span>
                    <div className="id-flip-deco"><img src="/assets/icons/pd-i3.png" alt="" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>

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

            {/* ── WAVE SVG ──
        viewBox: 0 0 1440 480
        Path anchors (viewBox coords):
          Start  → (0, 300)
          Dot-1  → (360, 140)   peak
          Dot-2  → (720, 390)   trough
          Dot-3  → (1080, 140)  peak
          End    → (1440, 300)

        CSS dot positions mirror these:
          dot-1: left=25%, top=140px
          dot-2: left=50%, top=390px
          dot-3: left=75%, top=140px
    ── */}
           <svg
  className="hiw-wave"
  viewBox="0 0 1440 480"
  preserveAspectRatio="xMidYMid meet"
  style={{ position:'absolute', top:0, left:0, width:'100%', height:'480px' }}
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    className="hiw-wave-shadow"
    d="M-100,300 C100,300 220,172 360,172 C500,172 540,428 720,428 C900,428 940,172 1080,172 C1220,172 1340,300 1540,300"
    transform="translate(0,6)"
  />
  <path
    className="hiw-wave-dotted"
    d="M-100,300 C100,300 220,172 360,172 C500,172 540,428 720,428 C900,428 940,172 1080,172 C1220,172 1340,300 1540,300"
  />
</svg>

            {/* ── Step 1: upper-left ── */}
            <div className="hiw-step hiw-step-1">
              <div className="hiw-step-heading">
                <h4>Submit Your Case</h4>
                <span className="hiw-ghost">1</span>
              </div>
              <p>Provide your dispute details and upload necessary documents securely.</p>
            </div>

            {/* ── Step 2: below center trough ── */}
            <div className="hiw-step hiw-step-2">
              <div className="hiw-step-heading">
                <h4>Mediation &amp; Discussion</h4>
                <span className="hiw-ghost">2</span>
              </div>
              <p>The other party is notified and a mediator facilitates discussion between both sides.</p>
            </div>

            {/* ── Step 3: upper-right ── */}
            <div className="hiw-step hiw-step-3">
              <div className="hiw-step-heading">
                <h4>Resolution</h4>
                <span className="hiw-ghost">3</span>
              </div>
              <p>Reach a fair agreement or get a final decision through arbitration.</p>
            </div>

            {/* ── Dot icons ── */}
            <div className="hiw-dot hiw-dot-1">
              <img src="/assets/icons/1.png" alt="" />
            </div>
            <div className="hiw-dot hiw-dot-2">
              <img src="/assets/icons/2.png" alt="" />
            </div>
            <div className="hiw-dot hiw-dot-3">
              <img src="/assets/icons/3.png" alt="" />
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

        {/* ── FAQ ── */}
        <section className="svc-faq">
          <div className="svc-container">
            <p className="svc-eyebrow">FAQS</p>
            <h2 className="svc-section-title">Frequently Asked Questions</h2>
            <p className="svc-section-sub">Find answers to common questions about our online dispute resolution process.</p>
            <div className="svc-faq-list">
              {faqData.map((faq, index) => (
                <div key={index} className="svc-faq-box">
                  <button className="svc-faq-item" onClick={() => toggleFaq(index)} aria-expanded={openFaq === index}>
                    <span>{faq.question}</span>
                    <span className="svc-faq-toggle">{openFaq === index ? "-" : "+"}</span>
                  </button>
                  {openFaq === index && <div className="svc-faq-answer">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
    TESTIMONIALS
══════════════════════════════════════════════ */}
        <section className="svc-testimonials">
          <div className="svc-container">
            <p className="svc-eyebrow">TESTIMONIALS</p>
            <h2 className="svc-section-title">What Our Clients Say?</h2>
            <p className="svc-section-sub">
              See how families are resolving disputes quickly and securely with our platform.
            </p>

            <div className="svc-testimonial-top-avatars">
              {slots.map((offset) => {
                const idx = getIndex(offset); // ✅ FIXED
                const isCenter = offset === 0;
                const isNear = Math.abs(offset) === 1;

                const cls = isCenter
                  ? "svc-floating-avatar active"
                  : isNear
                    ? "svc-floating-avatar svc-av-near"
                    : "svc-floating-avatar svc-av-far";

                return (
                  <button
                    key={offset}
                    className={cls}
                    onClick={() => setActiveTestimonial(idx)} // 
                    aria-label={`View testimonial from ${testimonialData[idx].name}`}
                    aria-pressed={isCenter}
                  >
                    <img
                      src={testimonialData[idx].img}
                      alt={testimonialData[idx].name}
                    />
                  </button>
                );
              })}
            </div>

            <div className="svc-testimonial-wrap">
              <button
                className="svc-nav-arrow"
                onClick={prevT}
                aria-label="Previous"
              >
                &#8249;
              </button>

              <div className="svc-testimonial-card" key={activeTestimonial}>
                <h4 className="svc-testimonial-name">
                  {testimonialData[activeTestimonial].name}
                </h4>
                <div className="svc-stars">★★★★★</div>
                <p className="svc-testimonial-text">
                  &ldquo;{testimonialData[activeTestimonial].text}&rdquo;
                </p>
              </div>

              <button
                className="svc-nav-arrow"
                onClick={nextT}
                aria-label="Next"
              >
                &#8250;
              </button>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="svc-cta">
          <div className="svc-cta-overlay">
            <div className="svc-container svc-cta-inner">
              <h2 className="svc-cta-title">Ready to find a peaceful resolution?</h2>
              <p className="svc-cta-text">Join thousands of individuals who have settled their disputes with dignity and legal certainty.</p>
              <button className="svc-cta-btn">File a Case</button>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};

export default IndividualDisputes;
"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/consumerDisputes.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ── Scroll-trigger helper ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ── FAQ item ── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cd-faq-box${open ? " open" : ""}`}>
      <button className="cd-faq-item" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="cd-faq-toggle">{open ? "×" : "+"}</span>
      </button>
      {open && <div className="cd-faq-answer">{a}</div>}
    </div>
  );
}

/* ── Testimonial data ── */
const TESTIMONIALS = [
  { name: "Riya Sharma, Mumbai",   img: "/assets/images/t1.png", stars: 5, text: "RaaziMarzi helped me resolve a defective product complaint quickly. The entire process was smooth and the mediator was very professional." },
  { name: "Amit Verma, Delhi",     img: "/assets/images/t2.png", stars: 5, text: "I had a billing dispute with an online retailer for months. RaaziMarzi resolved it in just 2 sessions. Highly recommend!" },
  { name: "Priya Nair, Bangalore", img: "/assets/images/t3.png", stars: 5, text: "The platform made it easy to handle a delivery issue with a vendor. Everything was managed online without any hassle." },
  { name: "Suresh Kumar, Chennai", img: "/assets/images/t4.png", stars: 5, text: "Professional, fast, and legally sound. RaaziMarzi gave me confidence that my consumer rights were being protected." },
  { name: "Tenant, Hyderabad",     img: "/assets/images/t5.png", stars: 5, text: "This platform made it easy to handle a payment dispute with a client. The mediation process was smooth, and everything was managed online without any hassle." },
];

/* ── Why Choose data ── */
const WHY_CARDS = [
  { icon: "/assets/icons/fastresol.png",  title: "Fast Resolution",  desc: "Resolve disputes quickly without long court procedures." },
  { icon: "/assets/icons/legallycom.png", title: "Secure Platform",  desc: "Your data and documents are protected with strong security." },
  { icon: "/assets/icons/s&c.png",        title: "Expert Mediators", desc: "Get guidance from experienced and neutral professionals." },
  { icon: "/assets/icons/neutralexp.png", title: "Cost Effective",   desc: "Save legal costs compared to traditional litigation." },
  { icon: "/assets/icons/247.png",        title: "Accessible Anytime", desc: "Resolve disputes from anywhere, anytime online." },
];

/* ── FAQ data ── */
const FAQS = [
  { q: "Is my privacy protected during the process?",      a: "Yes, absolutely. All discussions held within RaaziMarzi are confidential and cannot be used in a court of law. This allows both parties to speak freely without fear of legal prejudice." },
  { q: "Can I bring my own lawyer to the session?",        a: "Yes, you may have legal representation during sessions. However, the mediation process is designed to be collaborative, not adversarial." },
  { q: "What happens if the other party refuses to join?", a: "If the other party declines to participate, we will notify you and help explore alternative options for resolving your dispute." },
  { q: "How long does the average case take?",             a: "Most consumer disputes are resolved within 2–4 sessions, typically spanning 1–3 weeks depending on complexity and party availability." },
];

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function ConsumerDisputes() {

  /* Section observers */
  const [aboutRef, aboutIn] = useInView();
  const [hiwRef,   hiwIn]   = useInView();
  const [whyRef,   whyIn]   = useInView();

  /* Flip cards spread */
  const [spread, setSpread] = useState(false);
  const typesRef = useRef(null);
  useEffect(() => {
    const el = typesRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSpread(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Testimonial carousel */
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const getIndex = (offset) => {
    const len = TESTIMONIALS.length;
    return ((activeTestimonial + offset) % len + len) % len;
  };
  const slots = [-2, -1, 0, 1, 2];

  const prevT = () => setActiveTestimonial(p => (p === 0 ? TESTIMONIALS.length - 1 : p - 1));
  const nextT = () => setActiveTestimonial(p => (p === TESTIMONIALS.length - 1 ? 0 : p + 1));

  return (
    <>
      <Header />
      <div className="cd-page">

        {/* ── HERO ── */}
        <section className="cd-hero">
          <div className="cd-hero-wrap">
            <div className="cd-hero-left">
              <span className="cd-tag">Consumer Disputes</span>
              <h1>Resolve Consumer Disputes<br />Quickly &amp; Securely</h1>
              <p className="cd-hero-desc">
                RaaziMarzi helps individuals resolve product complaints, service
                complaints, delivery issues, and refund &amp; billing disputes through
                secure online mediation and arbitration.
              </p>
              <div className="cd-hero-btns">
                <button className="cd-btn-primary" onClick={() => window.location.href = "/user/file-new-case/step1"}>
                  File a Case
                </button>
                <a href="/ContactUs" className="cd-btn-secondary">Learn More</a>
              </div>
            </div>
            <div className="cd-hero-right">
              <img src="/assets/images/com.png" alt="Consumer Disputes" />
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className={`cd-about${aboutIn ? " about-animate" : ""}`} ref={aboutRef}>
          <div className="cd-container">
            <div className="cd-section-head center">
              <span className="cd-tag">Consumer Disputes</span>
              <h2>What Are Consumer Disputes<br />And Its Causes?</h2>
            </div>
            <div className="cd-about-grid">
              <div className="cd-about-left">
                <p>
                  Consumer disputes arise when consumers face issues with products
                  or services they have purchased. These conflicts can involve
                  defective products, delayed deliveries, billing errors, or unsatisfactory
                  services. RaaziMarzi helps in resolving your disputes through
                  secure online mediation ensuring consumers get access to justice
                  without lengthy court procedures.
                </p>
                <button className="cd-btn-primary" onClick={() => window.location.href = "/user/file-new-case/step1"}>
                  File a Case
                </button>
              </div>
              <div className="cd-cause-grid">
                <div className="cd-cause-card">
                  <h4>False promises</h4>
                  <p>Misleading claims or commitments made by the seller that don't match what you received.</p>
                </div>
                <div className="cd-cause-card">
                  <h4>Late delivery</h4>
                  <p>The product arrived significantly later than the committed delivery date.</p>
                </div>
                <div className="cd-cause-card">
                  <h4>Hidden charges</h4>
                  <p>Additional charges such as taxes, delivery fees, or service charges not disclosed upfront or after billing.</p>
                </div>
                <div className="cd-cause-card">
                  <h4>Warranty</h4>
                  <p>Issues when sellers refuse to honor warranty claims, deny replacements, or provide inadequate after-sales service.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TYPES OF DISPUTES ── */}
        <section className="cd-types">
          <div className="cd-container">
            <div className="cd-section-head center">
              <p className="cd-tag">SPECIALIZED AREAS</p>
              <h2>Types of Consumer Disputes We Handle</h2>
              <p className="cd-section-sub">
                Providing solutions for common consumer disputes through secure online mediation.
              </p>
            </div>
            <div ref={typesRef} className={`cd-cards-row${spread ? " is-spread" : ""}`}>

              <div className="cd-flip-card">
                <div className="cd-flip-inner">
                  <div className="cd-flip-front">
                    <img src="/assets/images/cm-1.png" alt="Product Complaints" />
                    <div className="cd-flip-front-label"><h4>Product Complaints</h4></div>
                  </div>
                  <div className="cd-flip-back">
                    <h4>Product Complaints</h4>
                    <p>Resolve disputes related to defective or substandard products. These conflicts can involve damaged goods, wrong items delivered, or products that don't match their description, resolved quickly through secure online mediation.</p>
                    <span className="cd-flip-explore">EXPLORE MORE &nbsp;&#8594;</span>
                    <div className="cd-flip-deco"><img src="/assets/icons/cm-i1.png" alt="" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>

              <div className="cd-flip-card">
                <div className="cd-flip-inner">
                  <div className="cd-flip-front">
                    <img src="/assets/images/cm-2.png" alt="Service Complaints" />
                    <div className="cd-flip-front-label"><h4>Service Complaints</h4></div>
                  </div>
                  <div className="cd-flip-back">
                    <h4>Service Complaints</h4>
                    <p>Address grievances about poor service quality, unfulfilled promises, or unsatisfactory customer service experiences. RaaziMarzi facilitates fair resolution between consumers and service providers efficiently.</p>
                    <span className="cd-flip-explore">EXPLORE MORE &nbsp;&#8594;</span>
                    <div className="cd-flip-deco"><img src="/assets/icons/cm-i2.png" alt="" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>

              <div className="cd-flip-card">
                <div className="cd-flip-inner">
                  <div className="cd-flip-front">
                    <img src="/assets/images/cm-3.png" alt="Delivery Issues" />
                    <div className="cd-flip-front-label"><h4>Delivery Issues</h4></div>
                  </div>
                  <div className="cd-flip-back">
                    <h4>Delivery Issues</h4>
                    <p>Resolve disputes related to late deliveries, damaged goods in transit, or non-delivery of paid orders. Get fair compensation or fulfilment through our structured online dispute resolution process.</p>
                    <span className="cd-flip-explore">EXPLORE MORE &nbsp;&#8594;</span>
                    <div className="cd-flip-deco"><img src="/assets/icons/cm-i3.png" alt="" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>

              <div className="cd-flip-card">
                <div className="cd-flip-inner">
                  <div className="cd-flip-front">
                    <img src="/assets/images/cm-4.png" alt="Refund & Billing Disputes" />
                    <div className="cd-flip-front-label"><h4>Refund &amp; Billing Disputes</h4></div>
                  </div>
                  <div className="cd-flip-back">
                    <h4>Refund &amp; Billing Disputes</h4>
                    <p>Handle billing errors, unauthorized charges, and refund disputes with merchants or service providers. RaaziMarzi ensures your consumer rights are protected through transparent mediation and arbitration.</p>
                    <span className="cd-flip-explore">EXPLORE MORE &nbsp;&#8594;</span>
                    <div className="cd-flip-deco"><img src="/assets/icons/cm-i4.png" alt="" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section ref={hiwRef} className={`cd-hiw-section${hiwIn ? " cd-hiw-animate" : ""}`}>
          <div className="cd-hiw-header">
            <p className="cd-hiw-eyebrow">3 SIMPLE STEPS</p>
            <h2 className="cd-hiw-title">How It Works</h2>
            <p className="cd-hiw-sub">A simple and secure process to resolve disputes online.</p>
          </div>
          <div className="cd-hiw-stage">
            <svg className="cd-hiw-wave" viewBox="0 0 1440 260" preserveAspectRatio="none">
              <path className="cd-hiw-wave-shadow" d="M0,160 C200,260 300,260 500,160 C700,60 800,60 1000,160 C1200,260 1300,260 1440,160" />
              <path className="cd-hiw-wave-dotted" d="M0,160 C200,260 300,260 500,160 C700,60 800,60 1000,160 C1200,260 1300,260 1440,160" />
            </svg>
            <div className="cd-hiw-dot cd-hiw-dot-1"><img src="/assets/icons/1.png" alt="" /></div>
            <div className="cd-hiw-dot cd-hiw-dot-2"><img src="/assets/icons/2.png" alt="" /></div>
            <div className="cd-hiw-dot cd-hiw-dot-3"><img src="/assets/icons/3.png" alt="" /></div>
            <div className="cd-hiw-step cd-hiw-step-1">
              <div className="cd-hiw-ghost">1</div>
              <h4>Submit Your Case</h4>
              <p>Provide your dispute details and upload necessary documents securely.</p>
            </div>
            <div className="cd-hiw-step cd-hiw-step-2">
              <div className="cd-hiw-ghost">2</div>
              <h4>Mediation &amp; Discussion</h4>
              <p>The other party is notified and a mediator facilitates discussion between both sides.</p>
            </div>
            <div className="cd-hiw-step cd-hiw-step-3">
              <div className="cd-hiw-ghost">3</div>
              <h4>Resolution</h4>
              <p>Reach a fair agreement or get a final decision through arbitration.</p>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE ── */}
        <section ref={whyRef} className={`cd-why${whyIn ? " why-animate" : ""}`}>
          <div className="cd-container">
            <div className="cd-section-head center">
              <p className="cd-tag">WHY CHOOSE US</p>
              <h2>Why Choose RaaziMarzi</h2>
              <p className="cd-section-sub">
                A faster, secure, and reliable way to resolve disputes without lengthy court procedures.
              </p>
            </div>
            <div className="cd-why-grid">
              {WHY_CARDS.map((item, index) => (
                <div key={index} className="cd-why-card">
                  <div className="cd-why-circle">
                    <img src={item.icon} alt={item.title} />
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="cd-faq">
          <div className="cd-container">
            <span className="cd-faq-eyebrow">FAQ</span>
            <h2 className="cd-faq-title">Frequently Asked Questions</h2>
            <p className="cd-faq-sub">
              Find answers to common questions about our online dispute resolution process.
            </p>
            <div className="cd-faq-list">
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="svc-testimonials">
          <div className="svc-container">
            <p className="svc-eyebrow">TESTIMONIALS</p>
            <h2 className="svc-section-title">What Our Clients Say?</h2>
            <p className="svc-section-sub">
              See how people are resolving disputes quickly and securely with our platform.
            </p>

            <div className="svc-testimonial-top-avatars">
              {slots.map((offset) => {
                const idx = getIndex(offset);
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
                    onClick={() => setActiveTestimonial(idx)}
                    aria-label={`View testimonial from ${TESTIMONIALS[idx].name}`}
                    aria-pressed={isCenter}
                  >
                    <img src={TESTIMONIALS[idx].img} alt={TESTIMONIALS[idx].name} />
                  </button>
                );
              })}
            </div>

            <div className="svc-testimonial-wrap">
              <button className="svc-nav-arrow" onClick={prevT} aria-label="Previous">&#8249;</button>
              <div className="svc-testimonial-card" key={activeTestimonial}>
                <h4 className="svc-testimonial-name">{TESTIMONIALS[activeTestimonial].name}</h4>
                <div className="svc-stars">★★★★★</div>
                <p className="svc-testimonial-text">&ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;</p>
              </div>
              <button className="svc-nav-arrow" onClick={nextT} aria-label="Next">&#8250;</button>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cd-cta">
          <div className="cd-cta-overlay">
            <div className="cd-cta-inner">
              <h2 className="cd-cta-title">Ready to find a peaceful resolution?</h2>
              <p className="cd-cta-text">
                Join thousands of individuals who have resolved their disputes with dignity and legal certainty.
              </p>
              <button className="cd-cta-btn" onClick={() => window.location.href = "/user/file-new-case/step1"}>
                File a Case
              </button>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/commercialDisputes.css";

/* ── Data ── */
const disputeTypes = [
    {
        id: 1,
        img: "/assets/images/cd-1.png",
        backImg: "/assets/images/cd-b1.png",
        alt: "Contract Disputes",
        desc: "Conflicts between franchisors and franchisees or distributors over contractual terms, territory rights, and revenue sharing.",
    },
    {
        id: 2,
        img: "/assets/images/cd-2.png",
        backImg: "/assets/images/cd-b2.png",
        alt: "Technology & Digital Disputes",
        desc: "Disputes arising from breach of contracts, non-performance, or disagreement over contractual terms and obligations.",
    },
    {
        id: 3,
        img: "/assets/images/cd-3.png",
        backImg: "/assets/images/cd-b3.png",
        alt: "Corporate & Business Agreement Disputes",
        desc: "Conflicts involving software agreements, IT service failures, data breaches, and digital intellectual property issues.",
    },
    {
        id: 4,
        img: "/assets/images/cd-4.png",
        backImg: "/assets/images/cd-b4.png",
        alt: "Partnership Conflicts",
        desc: "Disagreements between business partners over roles, profit sharing, responsibilities, and company direction.",
    },
    {
        id: 5,
        img: "/assets/images/cd-5.png",
        backImg: "/assets/images/cd-b5.png",
        alt: "Payment & Financial Disputes",
        desc: "Disputes related to unpaid invoices, delayed payments, financial misrepresentation, or loan disagreements.",
    },
    {
        id: 6,
        img: "/assets/images/cd-6.png",
        backImg: "/assets/images/cd-b6.png",
        alt: "Business & Operational Disputes",
        desc: "Day-to-day business conflicts involving service delivery failures, supplier issues, or operational disagreements.",
    },
    {
        id: 7,
        img: "/assets/images/cd-7.png",
        backImg: "/assets/images/cd-b7.png",
        alt: "Employment & Workplace Disputes",
        desc: "Conflicts between employers and employees over contracts, wrongful termination, discrimination, or wage disputes.",
    },
    {
        id: 8,
        img: "/assets/images/cd-8.png",
        backImg: "/assets/images/cd-b8.png",
        alt: "Consumer & Business Disputes",
        desc: "Disputes between businesses and their customers over defective goods, service failures, or misleading claims.",
    },
    {
        id: 9,
        img: "/assets/images/cd-9.png",
        backImg: "/assets/images/cd-b9.png",
        alt: "Intellectual Property Disputes",
        desc: "Conflicts over ownership and infringement of trademarks, patents, copyrights, and trade secrets.",
    },
    {
        id: 10,
        img: "/assets/images/cd-10.png",
        backImg: "/assets/images/cd-b10.png",
        alt: "Real Estate & Commercial Leases",
        desc: "Disputes between landlords and commercial tenants over lease terms, rent, eviction, or property condition.",
    },
];

const causesData = [
    {
        title: "Contract Disputes",
        desc: "Conflicts arising from non-payment of agreements, non-performance, or contractual disagreements.",
    },
    {
        title: "Partnership Conflicts",
        desc: "Disagreements between business partners over roles, responsibilities, or profits.",
    },
    {
        title: "Payment Issues",
        desc: "Disputes related to unpaid invoices, delayed payments, or financial disagreements.",
    },
    {
        title: "Business & Operational Issues",
        desc: "Issues related to transactions, services, or day-to-day business operations.",
    },
];

const whyIcons = [
    { src: "/assets/icons/fastresol.png", label: "Fast Resolution" },
    { src: "/assets/icons/legallycom.png", label: "Legally Compliant" },
    { src: "/assets/icons/s&c.png", label: "Secure & Confidential" },
    { src: "/assets/icons/neutralexp.png", label: "Neutral Experts" },
    { src: "/assets/icons/247.png", label: "24/7 Access" },
];

const faqData = [
    {
        q: "Is my privacy protected during the process?",
        a: "Yes, absolutely. All discussions are kept strictly confidential and cannot be used in court of law. This allows both parties to speak freely without fear of legal prejudice.",
    },
    {
        q: "Can I bring my own lawyer to the session?",
        a: "Yes, you are welcome to bring legal representation to any mediation or arbitration session. Having a lawyer can help ensure your rights and interests are properly represented.",
    },
    {
        q: "What happens if the other party refuses to join?",
        a: "If the other party declines to participate, we will guide you through alternative legal options and next steps available to protect your rights and resolve the matter.",
    },
    {
        q: "How long does the average case take?",
        a: "Most commercial disputes are resolved within 2–6 weeks, depending on the complexity of the matter and the willingness of both parties to engage in good faith.",
    },
];

const testimonials = [
    {
        name: "Tenant, Hyderabad",
        img: "/assets/images/t1.png",
        text: "The platform made it easy to handle a payment dispute with a client. The mediation process was smooth, and everything was managed online without any hassle. Highly recommended for resolving business conflicts.",
    },
    {
        name: "Client, Mumbai",
        img: "/assets/images/t4.png",
        text: "Resolving our partnership conflict through RaaziMarzi saved us months of legal proceedings. The mediator was professional and completely neutral throughout.",
    },
    {
        name: "Resident, Pune",
        img: "/assets/images/t3.png",
        text: "Our contract dispute was resolved in under three weeks. The process was transparent, confidential, and far less stressful than going to court.",
    },
    {
        name: "User, Indore",
        img: "/assets/images/t2.png",
        text: "Very smooth and simple process. The team handled things professionally and the digital-first approach made everything convenient.",
    },
    {
        name: "Landlord, Delhi",
        img: "/assets/images/t5.png",
        text: "Efficient and stress-free. I was able to resolve my commercial lease dispute without stepping into a court.",
    },
];

/* ── Fan carousel slot helper ── */
function getSlot(itemIndex, activeIndex, total) {
    let slot = (itemIndex - activeIndex + total) % total;
    if (slot > Math.floor(total / 2)) slot -= total;
    if (Math.abs(slot) > 2) return "hidden";
    return String(slot);
}

export default function CommercialDisputes() {
    const [openFaq, setOpenFaq] = useState(0);
    const [testimonialIdx, setTestimonialIdx] = useState(0);

    /* ── Fan carousel state ── */
    const [fanIdx, setFanIdx] = useState(0);
    const totalFan = disputeTypes.length;
    const nextFan = () => setFanIdx((i) => (i + 1) % totalFan);
    const prevFan = () => setFanIdx((i) => (i - 1 + totalFan) % totalFan);

    const [heroVisible, setHeroVisible] = useState(false);
    const [whatVisible, setWhatVisible] = useState(false);
    const [typesVisible, setTypesVisible] = useState(false);
    const [hiwVisible, setHiwVisible] = useState(false);
    const [whyVisible, setWhyVisible] = useState(false);
    const [causesVisible, setCausesVisible] = useState(false);

    const heroRef = useRef(null);
    const whatRef = useRef(null);
    const typesRef = useRef(null);
    const hiwRef = useRef(null);
    const whyRef = useRef(null);
    const causesRef = useRef(null);

    const navigateToApp = useCallback((path = "/login", queryParams = {}) => {
        try {
            const searchParams = new URLSearchParams(queryParams);
            const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
            window.location.href = `${APP_BASE_PATH}${path}${query}`;
        } catch {
            window.location.href = `${APP_BASE_PATH}/login`;
        }
    }, []);

    /* ── Intersection Observer helper ── */
    const makeObs = (setter, threshold = 0.15) => (ref) => {
        if (!ref?.current) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(ref.current);
        return () => obs.disconnect();
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => makeObs(setHeroVisible, 0.20)(heroRef), []);
    useEffect(() => makeObs(setWhatVisible, 0.15)(whatRef), []);
    useEffect(() => makeObs(setTypesVisible, 0.05)(typesRef), []);
    useEffect(() => makeObs(setHiwVisible, 0.15)(hiwRef), []);
    useEffect(() => makeObs(setWhyVisible, 0.15)(whyRef), []);
    useEffect(() => makeObs(setCausesVisible, 0.10)(causesRef), []);
    /* eslint-enable */

    /* ── Testimonial helpers ── */
    const prevT = () => setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
    const nextT = () => setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));
    const getSlotT = (offset) => {
        const len = testimonials.length;
        return ((testimonialIdx + offset) % len + len) % len;
    };
    const slots = [-2, -1, 0, 1, 2];

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

    return (
        <>
            <Header />

            <div className="cd-page">

                {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
                <section ref={heroRef} className={`cd-hero${heroVisible ? " hero-animate" : ""}`}>
                    <div className="cd-hero-inner cd-container">
                        <div className="cd-hero-left">
                            <p className="cd-hero-eyebrow">COMMERCIAL DISPUTES</p>
                            <h1 className="cd-hero-title">
                                Resolve Commercial<br />
                                Disputes Quickly<br />
                                &amp; Securely
                            </h1>
                            <p className="cd-hero-sub">
                                RaaziMarzi helps businesses resolve contract disputes, payment
                                issues, partnership conflicts, and commercial disagreements through
                                secure online mediation and arbitration.
                            </p>
                            <div className="cd-hero-btns">
                                <button
                                    className="cd-btn-primary"
                                    onClick={() => navigateToApp("/user/file-new-case/step1")}
                                >
                                    File a Case
                                </button>
                                <button
                                    className="cd-btn-secondary"
                                    onClick={() => navigateToApp("/user/file-new-case/step1")}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="cd-hero-right">
                            <div className="cd-hero-img-wrap">
                                <img
                                    src="/assets/images/Com.png"
                                    alt="Commercial Dispute Resolution"
                                    className="cd-hero-img"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            WHAT IS COMMERCIAL DISPUTES & CAUSES
        ══════════════════════════════════════════════ */}
                <section ref={whatRef} className={`cd-what${whatVisible ? " what-animate" : ""}`}>
                    <div className="cd-container cd-what-grid">
                        <div className="cd-what-left">
                            <p className="cd-eyebrow cd-eyebrow-center">COMMERCIAL DISPUTES</p>
                            <h2 className="cd-section-title">
                                What Is Commercial Disputes<br />And Its Causes?
                            </h2>
                            <p className="cd-what-text">
                                Commercial disputes are conflicts between businesses or
                                organisations related to contracts, transactions, partnerships, or
                                financial dealings. These disputes may arise due to breach of
                                agreements, payment delays, miscommunication, or operational
                                disagreements. RaaziMarzi helps resolve trade through secure online
                                mediation and arbitration, avoiding lengthy court procedures.
                            </p>
                            <button
                                className="cd-btn-primary cd-btn-sm"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
                                File a Case
                            </button>
                        </div>
                        <div className="cd-what-right">
                            {causesData.map((c, i) => (
                                <div
                                    key={i}
                                    ref={i === 0 ? causesRef : null}
                                    className={`cd-cause-card causes-card-${i + 1}${causesVisible ? " cause-animate" : ""}`}
                                >
                                    <div className="cd-cause-accent" />
                                    <h4>{c.title}</h4>
                                    <p>{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            TYPES OF COMMERCIAL DISPUTES — FAN CAROUSEL
        ══════════════════════════════════════════════ */}
                <section ref={typesRef} className={`cd-types${typesVisible ? " types-animate" : ""}`}>
                    <div className="cd-container">
                        <p className="cd-eyebrow">SPECIALIZED AREAS</p>
                        <h2 className="cd-section-title">Types of Commercial Disputes We Handle</h2>
                        <p className="cd-section-sub">
                            Providing solutions for common commercial disputes through secure online mediation.
                        </p>

                        {/* 3D Fan Stage */}
                        <div className="cd-fan-stage">
                            <div className="cd-fan-track">
                                {disputeTypes.map((item, i) => {
                                    const slot = getSlot(i, fanIdx, totalFan);
                                    return (
                                        <div
                                            key={item.id}
                                            className="cd-fan-item"
                                            data-slot={slot}
                                            onClick={() => {
                                                if (slot !== "0" && slot !== "hidden") {
                                                    setFanIdx(i);
                                                }
                                            }}
                                        >
                                            <div className="cd-fan-flip">

                                                {/* FRONT — full image, title is baked into the image */}
                                                <div className="cd-fan-front">
                                                    <img src={item.img} alt={item.alt} />
                                                </div>

                                                {/* BACK — back image fills the card fully */}
                                                <div className="cd-fan-back">
                                                    <img src={item.backImg} alt={`${item.alt} details`} />
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="cd-fan-controls">
                            <button className="cd-fan-arrow" onClick={prevFan} aria-label="Previous">
                                &#8249;
                            </button>
                            <span className="cd-fan-counter">
                                {fanIdx + 1}/{totalFan}
                            </span>
                            <button className="cd-fan-arrow" onClick={nextFan} aria-label="Next">
                                &#8250;
                            </button>
                        </div>
                    </div>
                </section>

               <section ref={hiwRef} className={`cd-hiw-wrap hiw-section${hiwVisible ? " hiw-animate" : ""}`}>
  <div className="hiw-header">
    <p className="hiw-eyebrow">3 SIMPLE STEPS</p>
    <h2 className="hiw-title">How It Works</h2>
    <p className="hiw-sub">A simple and secure process to resolve disputes online.</p>
  </div>

  <div className="hiw-stage">
    <svg className="hiw-svg" viewBox="0 0 1200 390"
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"
      aria-hidden="true">

      {/* DASHED WAVE */}
      <path
        className="hiw-wave-path"
        d="M-60,200 C80,200 140,330 260,330 C380,330 440,70 600,70 C760,70 820,330 940,330 C1060,330 1120,200 1260,200"
        fill="none" stroke="#5b7af5" strokeWidth="2"
        strokeDasharray="9 12" strokeLinecap="round"
      />

      {/* ── STEP 1 top-left ── */}
      <text className="hiw-h" x="22" y="52">Submit Your Case</text>
      <text className="hiw-p" x="22" y="74">Provide your dispute details and</text>
      <text className="hiw-p" x="22" y="90">upload necessary documents securely.</text>
      <text className="hiw-ghost" x="248" y="158" textAnchor="middle">1</text>
      <g className={`hiw-dot hiw-dot-1`}>
        <circle cx="260" cy="330" r="27" fill="#fff" stroke="#d8dcf5" strokeWidth="1.5"/>
        <image href="/assets/icons/1.png" x="234" y="304" width="52" height="52"
          style={{clipPath:'circle(23px at 26px 26px)'}}/>
      </g>

      {/* ── STEP 2 bottom-center ── */}
      <g className={`hiw-dot hiw-dot-2`}>
        <circle cx="600" cy="70" r="27" fill="#fff" stroke="#d8dcf5" strokeWidth="1.5"/>
        <image href="/assets/icons/2.png" x="574" y="44" width="52" height="52"
          style={{clipPath:'circle(23px at 26px 26px)'}}/>
      </g>
      <text className="hiw-h" x="422" y="248">Mediation &amp; Discussion</text>
      <text className="hiw-p" x="422" y="270">The other party is notified and a mediator</text>
      <text className="hiw-p" x="422" y="286">facilitates discussion between both sides.</text>
      <text className="hiw-ghost" x="688" y="368" textAnchor="middle">2</text>

      {/* ── STEP 3 top-right ── */}
      <text className="hiw-h" x="820" y="52">Resolution</text>
      <text className="hiw-p" x="820" y="74">Reach a fair agreement or get a</text>
      <text className="hiw-p" x="820" y="90">final decision through arbitration.</text>
      <text className="hiw-ghost" x="1050" y="158" textAnchor="middle">3</text>
      <g className={`hiw-dot hiw-dot-3`}>
        <circle cx="940" cy="330" r="27" fill="#fff" stroke="#d8dcf5" strokeWidth="1.5"/>
        <image href="/assets/icons/3.png" x="914" y="304" width="52" height="52"
          style={{clipPath:'circle(23px at 26px 26px)'}}/>
      </g>

    </svg>
  </div>
</section>

                {/* ══════════════════════════════════════════════
            WHY CHOOSE
        ══════════════════════════════════════════════ */}
                <section ref={whyRef} className={`id-why${whyVisible ? " why-animate" : ""}`}>
                    <div className="id-container">
                        <div className="id-section-head center">
                            <p className="id-tag">WHY CHOOSE US</p>
                            <h2>Why Choose RaaziMarzi</h2>
                            <p className="id-section-sub">
                                A faster, safe, and reliable way to resolve disputes without lengthy court procedures.
                            </p>
                        </div>
                        <div className="id-why-grid">
                            {whyIcons.map((item, i) => (
                                <div key={i} className="id-why-card">
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

                {/* ══════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════ */}
                <section className="svc-faq">
                    <div className="svc-container">
                        <p className="svc-eyebrow">FAQS</p>
                        <h2 className="svc-section-title">Frequently Asked Questions</h2>
                        <p className="svc-section-sub">
                            Find answers to common questions about online dispute resolution process.
                        </p>
                        <div className="svc-faq-list">
                            {faqData.map((faq, i) => (
                                <div key={i} className="svc-faq-box">
                                    <button
                                        className="svc-faq-item"
                                        onClick={() => toggleFaq(i)}
                                        aria-expanded={openFaq === i}
                                    >
                                        <span>{faq.q}</span>
                                        <span className="svc-faq-toggle">{openFaq === i ? "−" : "+"}</span>
                                    </button>
                                    {openFaq === i && <div className="svc-faq-answer">{faq.a}</div>}
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
                            See how people are resolving disputes quickly and securely with our platform.
                        </p>
                        <div className="svc-testimonial-top-avatars">
                            {slots.map((offset) => {
                                const idx = getSlotT(offset);
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
                                        onClick={() => setTestimonialIdx(idx)}
                                        aria-label={`View testimonial from ${testimonials[idx].name}`}
                                        aria-pressed={isCenter}
                                    >
                                        <img src={testimonials[idx].img} alt={testimonials[idx].name} />
                                    </button>
                                );
                            })}
                        </div>
                        <div className="svc-testimonial-wrap">
                            <button className="svc-nav-arrow" onClick={prevT} aria-label="Previous">&#8249;</button>
                            <div className="svc-testimonial-card" key={testimonialIdx}>
                                <h4 className="svc-testimonial-name">{testimonials[testimonialIdx].name}</h4>
                                <div className="svc-stars">★★★★★</div>
                                <p className="svc-testimonial-text">&ldquo;{testimonials[testimonialIdx].text}&rdquo;</p>
                            </div>
                            <button className="svc-nav-arrow" onClick={nextT} aria-label="Next">&#8250;</button>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════ */}
                <section className="svc-cta">
                    <div className="svc-cta-overlay">
                        <div className="svc-container svc-cta-inner">
                            <h2 className="svc-cta-title">Ready to find a peaceful resolution?</h2>
                            <p className="svc-cta-text">
                                Join thousands of individuals who have settled their disputes with dignity and legal certainty.
                            </p>
                            <button
                                className="svc-cta-btn"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
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
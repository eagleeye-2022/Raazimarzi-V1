"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/property&rentalDisputes.css";

/* ── Data ── */
const disputeTypes = [
    {
        num: "01",
        title: "Rent & Payment Disputes",
        img: "/assets/images/RPD.png",
        alt: "Land & Boundary Disputes",
        desc: "Conflicts over property boundaries, encroachments, and land ownership between neighbours or parties.",
        tags: ["Boundary Disputes", "Encroachment", "Land Ownership"],
    },
    {
        num: "02",
        title: "Lease & Agreement Violation",
        img: "/assets/images/LAV.png",
        alt: "Landlord & Tenant Disputes",
        desc: "Disputes between landlords and tenants regarding rent, eviction, deposits, and lease agreements.",
        tags: ["Rent Disputes", "Eviction Matters", "Lease Agreements"],
        reverse: true,
    },
    {
        num: "03",
        title: "Security Diposit Disputes",
        img: "/assets/images/SDD.png",
        alt: "Property Ownership Disputes",
        desc: "Conflicts arising from unclear or contested ownership titles, fraudulent transfers, or co-ownership issues.",
        tags: ["Title Disputes", "Fraudulent Transfer", "Co-ownership Issues"],
    },
    {
        num: "04",
        title: "Maintanence & Repair Issues",
        img: "/assets/images/MRI.png",
        alt: "Construction & Builder Disputes",
        desc: "Disputes between buyers and builders over project delays, defects, and contractual obligations.",
        tags: ["Project Delays", "Construction Defects", "Builder Contracts"],
        reverse: true,
    },
    {
        num: "05",
        title: "Onership & Boundary Disputes",
        img: "/assets/images/OBD.png",
        alt: "Inheritance & Succession",
        desc: "Legal conflicts over property inheritance, will execution, and succession rights among family members.",
        tags: ["Will Disputes", "Succession Rights", "Inheritance Claims"],
    },
];

const resolveTips = [
    {
        img: "/assets/images/yoga.png",
        title: "Gather All Documents",
        tips: [
            "Collect all property documents",
            "Organise title deeds and agreements",
            "Preserve communication records",
            "Keep payment receipts handy",
        ],
    },
    {
        img: "/assets/images/listen.png",
        title: "Understand Your Legal Rights",
        tips: [
            "Know your property rights",
            "Review lease or sale agreements",
            "Understand applicable property laws",
            "Consult a legal expert if needed",
        ],
    },
    {
        img: "/assets/images/agreement.png",
        title: "Attempt Mutual Settlement",
        tips: [
            "Initiate a calm discussion",
            "Propose fair settlement terms",
            "Document any verbal agreements",
            "Involve a neutral third party",
        ],
    },
    {
        img: "/assets/images/work-together.png",
        title: "Use Online Dispute Resolution",
        tips: [
            "File your case on RaaziMarzi",
            "Submit supporting documents",
            "Engage in mediation sessions",
            "Accept or challenge the resolution",
        ],
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
        q: "Is property dispute mediation legally valid in India?",
        a: "Yes. Mediation agreements reached through our platform are legally recognised and can be made binding through proper legal channels, saving time and court costs.",
    },
    {
        q: "Can I resolve a landlord-tenant dispute online?",
        a: "Absolutely. RaaziMarzi supports online dispute resolution for rent, eviction, deposit, and lease-related matters in a structured and legally sound manner.",
    },
    {
        q: "What documents do I need to file a property dispute?",
        a: "You should have title deeds, sale agreements, payment receipts, lease agreements, or any correspondence relevant to the dispute. Our platform guides you through the process.",
    },
    {
        q: "How long does property dispute resolution take?",
        a: "Most property disputes are resolved within a few weeks, depending on the complexity and willingness of both parties to engage constructively through the mediation process.",
    },
];

const testimonials = [
    {
        name: "Resident, Pune",
        img: "/assets/images/t3.png",
        text: "The mediation helped us resolve our boundary dispute with neighbours without going to court. Very smooth experience.",
    },
    {
        name: "Client, Mumbai",
        img: "/assets/images/t4.png",
        text: "Resolving our landlord dispute through RaaziMarzi saved us time, money and a lot of stress.",
    },
    {
        name: "Tenant, Hyderabad",
        img: "/assets/images/t1.png",
        text: "I was nervous about the process but the mediator was neutral and very professional throughout.",
    },
    {
        name: "User, Indore",
        img: "/assets/images/t2.png",
        text: "Very smooth and simple process. The team handled things professionally and made communication easier.",
    },
    {
        name: "Landlord, Delhi",
        img: "/assets/images/t5.png",
        text: "Efficient and stress-free. I was able to resolve my property dispute without stepping into a court.",
    },
];

export default function PropertyDisputes() {
    const [openFaq, setOpenFaq] = useState(0);
    const [testimonialIdx, setTestimonialIdx] = useState(0);

    const [hiwVisible, setHiwVisible] = useState(false);
    const [whyVisible, setWhyVisible] = useState(false);
    const [causesVisible, setCausesVisible] = useState(false);
    const [typesVisible, setTypesVisible] = useState(false);
    const [resolveVisible, setResolveVisible] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);
    const [whatVisible, setWhatVisible] = useState(false);

    const hiwRef = useRef(null);
    const whyRef = useRef(null);
    const causesRef = useRef(null);
    const typesRef = useRef(null);
    const resolveRef = useRef(null);
    const heroRef = useRef(null);
    const whatRef = useRef(null);

    const navigateToApp = useCallback((path = "/login", queryParams = {}) => {
        try {
            const searchParams = new URLSearchParams(queryParams);
            const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
            window.location.href = `${APP_BASE_PATH}${path}${query}`;
        } catch {
            window.location.href = `${APP_BASE_PATH}/login`;
        }
    }, []);

    /* ── Observers ── */
    const makeObs = (setter, threshold = 0.15) => (ref) => {
        if (!ref?.current) return;
        const el = ref.current;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    };

    useEffect(makeObs(setHeroVisible, 0.20), []);
    useEffect(makeObs(setWhatVisible, 0.15), []);
    useEffect(makeObs(setHiwVisible, 0.15), []);
    useEffect(makeObs(setWhyVisible, 0.15), []);
    useEffect(makeObs(setCausesVisible, 0.10), []);
    useEffect(makeObs(setTypesVisible, 0.05), []);
    useEffect(makeObs(setResolveVisible, 0.10), []);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => makeObs(setHeroVisible, 0.20)(heroRef), []);
    useEffect(() => makeObs(setWhatVisible, 0.15)(whatRef), []);
    useEffect(() => makeObs(setHiwVisible, 0.15)(hiwRef), []);
    useEffect(() => makeObs(setWhyVisible, 0.15)(whyRef), []);
    useEffect(() => makeObs(setCausesVisible, 0.10)(causesRef), []);
    useEffect(() => makeObs(setTypesVisible, 0.05)(typesRef), []);
    useEffect(() => makeObs(setResolveVisible, 0.10)(resolveRef), []);
    /* eslint-enable */

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);
    const prevT = () => setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
    const nextT = () => setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));
    const getSlot = (offset) => {
        const len = testimonials.length;
        return ((testimonialIdx + offset) % len + len) % len;
    };
    const slots = [-2, -1, 0, 1, 2];

    return (
        <>
            <Header />

            <div className="pd-page">

                {/* ══════════════════════════════════════════════
                    HERO
══════════════════════════════════════════════ */}
                <section
                    ref={heroRef}
                    className={`pd-hero${heroVisible ? " hero-animate" : ""}`}
                >

                    {/* LEFT CIRCLES */}
                    <div className="pd-hero-cl1"></div>
                    <div className="pd-hero-cl2"></div>

                    {/* RIGHT CIRCLES */}
                    <div className="pd-hero-cr1"></div>
                    <div className="pd-hero-cr2"></div>

                    <div className="pd-hero-card">

                        <div className="pd-hero-badge">
                            WE HANDLE EVERY DISPUTE PROFESSIONALLY
                        </div>

                        <h1 className="pd-hero-title">
                            Property And Rental Dispute Resolution
                        </h1>

                        <p className="pd-hero-sub">
                            With a track record of successfully resolving a wide range of legal issues,
                            we're committed to protecting your interests and helping you achieve peace of
                            mind.
                        </p>

                        <div className="pd-hero-btns">
                            <button
                                className="pd-hero-btn-primary"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
                                File a Case
                            </button>

                            <button
                                className="pd-hero-btn-secondary"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
                                Learn More
                            </button>
                        </div>

                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    WHAT IS PROPERTY DISPUTES
                ══════════════════════════════════════════════ */}
                <section ref={whatRef} className={`pd-what${whatVisible ? " what-animate" : ""}`}>
                    <div className="pd-container pd-what-grid">
                        <div className="pd-what-left">
                            <p className="pd-eyebrow pd-eyebrow-left">PROPERTY DISPUTES</p>
                            <h2 className="pd-section-title pd-left">What Are Property Disputes</h2>
                            <p className="pd-what-text">
                                Family disputes are conflicts between family members involving personal, emotional, and financial matters. These may arise due to disagreements over relationships, responsibilities, or shared assets. Common issues include divorce, child custody, maintenance, and property division.
                            </p>
                            <p className="pd-what-text">
                                RaaziMarzi helps resolve these disputes through secure online mediation and arbitration, ensuring a smooth, confidential, and stress-free process without the need for lengthy court proceedings.
                            </p>
                            <button
                                className="pd-btn-primary pd-btn-sm"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
                                File a Case
                            </button>
                        </div>
                        <div className="pd-what-right">
                            <div className="pd-what-img-wrap">
                                <img src="/assets/images/PRD.png" alt="Property Dispute" className="pd-what-img" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    CAUSES OF PROPERTY DISPUTES
                ══════════════════════════════════════════════ */}
                <section
                    ref={causesRef}
                    className={`pd-causes${causesVisible ? " causes-animate" : ""}`}
                >
                    <div className="pd-container pd-causes-grid">
                        <div className="pd-causes-left">
                            <p className="pd-eyebrow pd-eyebrow-left">WHAT ARE THE CAUSES</p>
                            <h2 className="pd-section-title pd-left">Causes of Property Disputes</h2>
                        </div>
                        <div className="pd-causes-cards">
                            {[
                                { title: "Unclear Ownership Titles", desc: "Ambiguous or disputed property titles often lead to prolonged legal battles between parties claiming ownership rights." },
                                { title: "Landlord-Tenant Conflicts", desc: "Disputes over unpaid rent, illegal eviction, deposit refunds, or breach of lease terms are among the most common property conflicts." },
                                { title: "Inheritance & Succession Issues", desc: "Disagreements among heirs over property distribution, will validity, and succession rights frequently escalate into formal disputes." },
                                { title: "Builder & Developer Defaults", desc: "Project delays, construction defects, and non-delivery of amenities promised by builders cause significant disputes with buyers." },
                            ].map((c, i) => (
                                <div key={i} className={`pd-cause-card causes-card-${i + 1}`}>
                                    <div className="pd-cause-dot" />
                                    <h4>{c.title}</h4>
                                    <p>{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    TYPES OF PROPERTY DISPUTES
                ══════════════════════════════════════════════ */}
                <section
                    ref={typesRef}
                    className={`pd-types${typesVisible ? " types-animate" : ""}`}
                >
                    <div className="pd-container">
                        <p className="pd-eyebrow">SPECIALIZED AREAS</p>
                        <h2 className="pd-section-title">Types of Property Disputes</h2>
                        <p className="pd-section-sub">
                            Providing solutions for common property disputes through secure online mediation.
                        </p>
                        <div className="pd-types-list">
                            {disputeTypes.map((item, i) => (
                                <div
                                    key={i}
                                    className={`pd-type-row${item.reverse ? " pd-type-row-rev" : ""} type-row-${i + 1}`}
                                >
                                    {/* Number column */}
                                    <div className="pd-type-num-col">
                                        <span className="pd-type-num">{item.num}</span>
                                    </div>

                                    {/* Content column */}
                                    <div className="pd-type-content">
                                        <h3 className="pd-type-title">{item.title}</h3>
                                        <p className="pd-type-desc">{item.desc}</p>
                                        <ul className="pd-type-tags">
                                            {item.tags.map((t, ti) => (
                                                <li key={ti}>
                                                    <span className="pd-tag-dot" />
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            className="pd-btn-outline"
                                            onClick={() => navigateToApp("/user/file-new-case/step1")}
                                        >
                                            Learn More
                                        </button>
                                    </div>

                                    {/* Image column */}
                                    <div className="pd-type-img-col">
                                        <div className="pd-type-img-wrap">
                                            <img src={item.img} alt={item.alt} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    HOW TO RESOLVE PROPERTY DISPUTES
                ══════════════════════════════════════════════ */}
                <section
                    ref={resolveRef}
                    className={`pd-resolve${resolveVisible ? " resolve-animate" : ""}`}
                >
                    <div className="pd-container">
                        <p className="pd-eyebrow">PROPERTY DISPUTES</p>
                        <h2 className="pd-section-title">How to Resolve Property Disputes</h2>
                        <p className="pd-section-sub">
                            Follow a simple and structured approach to handle property disputes
                            efficiently and reach a legally sound resolution.
                        </p>

                        <div className="pd-resolve-grid">

                            {/* Card 1 — top-left */}
                            <div className="pd-resolve-card resolve-card-1">
                                <h4 className="pd-resolve-card-title">Gather All Documents</h4>
                                <ul className="pd-resolve-list">
                                    <li>Collect all title deeds and records</li>
                                    <li>Organise sale and lease agreements</li>
                                    <li>Preserve payment receipts</li>
                                    <li>Keep all correspondence as evidence</li>
                                    <li>Obtain survey or measurement reports</li>
                                    <li>Document any encroachments or damages</li>
                                    <li>Secure government-issued property records</li>
                                </ul>
                                <div className="pd-resolve-img-wrap">
                                    <img src={resolveTips[0]?.img} alt="Gather Documents" />
                                </div>
                            </div>

                            {/* Card 2 — top-right */}
                            <div className="pd-resolve-card resolve-card-2">
                                <h4 className="pd-resolve-card-title">Understand Your Legal Rights</h4>
                                <ul className="pd-resolve-list">
                                    <li>Know your ownership and tenancy rights</li>
                                    <li>Review your lease or sale agreement</li>
                                    <li>Understand applicable property laws</li>
                                    <li>Check for any pending litigation</li>
                                    <li>Identify relevant government regulations</li>
                                    <li>Consult a legal expert if needed</li>
                                    <li>Be aware of your rights as a buyer or tenant</li>
                                    <li>Verify property registration status</li>
                                </ul>
                                <div className="pd-resolve-img-wrap">
                                    <img src={resolveTips[1]?.img} alt="Legal Rights" />
                                </div>
                            </div>

                            {/* Card 3 — bottom-left */}
                            <div className="pd-resolve-card resolve-card-3">
                                <h4 className="pd-resolve-card-title">Attempt Mutual Settlement</h4>
                                <ul className="pd-resolve-list">
                                    <li>Initiate a calm and respectful discussion</li>
                                    <li>Propose fair and reasonable settlement terms</li>
                                    <li>Document any agreed points in writing</li>
                                    <li>Involve a neutral third party if needed</li>
                                    <li>Avoid escalating tensions unnecessarily</li>
                                    <li>Consider mediation before legal action</li>
                                    <li>Respect each other's legal rights</li>
                                    <li>Stay committed to reaching a solution</li>
                                </ul>
                                <div className="pd-resolve-img-wrap">
                                    <img src={resolveTips[2]?.img} alt="Mutual Settlement" />
                                </div>
                            </div>

                            {/* Card 4 — bottom-right */}
                            <div className="pd-resolve-card resolve-card-4">
                                <h4 className="pd-resolve-card-title">Use Online Dispute Resolution</h4>
                                <ul className="pd-resolve-list">
                                    <li>File your case on RaaziMarzi</li>
                                    <li>Upload all supporting documents</li>
                                    <li>Notify the opposite party through the platform</li>
                                    <li>Attend mediation sessions online</li>
                                    <li>Review and accept the proposed resolution</li>
                                    <li>Track your case status in real time</li>
                                    <li>Get a legally binding agreement issued</li>
                                    <li>Escalate to arbitration if required</li>
                                </ul>
                                <div className="pd-resolve-img-wrap">
                                    <img src={resolveTips[3]?.img} alt="Online Resolution" />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    HOW IT WORKS
                ══════════════════════════════════════════════ */}
                <section
                    ref={hiwRef}
                    className={`pd-hiw-wrap hiw-section${hiwVisible ? " hiw-animate" : ""}`}
                >
                    <div className="hiw-header">
                        <p className="hiw-eyebrow">3 SIMPLE STEPS</p>
                        <h2 className="hiw-title">Still Not Resolved? Try Property Dispute Mediation</h2>
                        <p className="hiw-sub">Our mediation process is quick, confidential, and legally recognised.</p>
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
                            <p>Provide your property dispute details and upload the necessary documents securely.</p>
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

                {/* ══════════════════════════════════════════════
                    WHY CHOOSE
                ══════════════════════════════════════════════ */}
                <section ref={whyRef} className={`id-why${whyVisible ? " why-animate" : ""}`}>
                    <div className="id-container">
                        <div className="id-section-head center">
                            <p className="id-tag">WHY CHOOSE US</p>
                            <h2>Why Choose RaaziMarzi</h2>
                            <p className="id-section-sub">
                                A faster, secure, and reliable way to resolve property disputes without lengthy court procedures.
                            </p>
                        </div>
                        <div className="id-why-grid">
                            {whyIcons.map((item, i) => (
                                <div key={i} className="id-why-card">
                                    <div className="id-why-circle">
                                        <img src={item.src} alt={item.label} />
                                    </div>
                                    <h4>{item.label}</h4>
                                    <p>Resolve property, landlord, or ownership conflicts through a secure platform.</p>
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
                        <p className="svc-section-sub">Find answers to common questions about resolving property disputes online.</p>
                        <div className="svc-faq-list">
                            {faqData.map((faq, i) => (
                                <div key={i} className="svc-faq-box">
                                    <button className="svc-faq-item" onClick={() => toggleFaq(i)} aria-expanded={openFaq === i}>
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
                        <p className="svc-section-sub">See how property owners and tenants are resolving disputes quickly and securely with our platform.</p>
                        <div className="svc-testimonial-top-avatars">
                            {slots.map((offset) => {
                                const idx = getSlot(offset);
                                const isCenter = offset === 0;
                                const isNear = Math.abs(offset) === 1;
                                const cls = isCenter
                                    ? "svc-floating-avatar active"
                                    : isNear
                                        ? "svc-floating-avatar svc-av-near"
                                        : "svc-floating-avatar svc-av-far";
                                return (
                                    <button key={offset} className={cls} onClick={() => setTestimonialIdx(idx)} aria-label={`View testimonial from ${testimonials[idx].name}`} aria-pressed={isCenter}>
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
                            <h2 className="svc-cta-title">Ready to resolve your property dispute?</h2>
                            <p className="svc-cta-text">Join thousands of individuals who have settled their property disputes with dignity and legal certainty.</p>
                            <button className="svc-cta-btn" onClick={() => navigateToApp("/user/file-new-case/step1")}>File a Case</button>
                        </div>
                    </div>
                </section>

            </div>

            <Footer />
        </>
    );
}
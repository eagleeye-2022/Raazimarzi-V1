"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/familyDisputes.css";

/* ── Data ── */
const disputeTypes = [
    {
        num: "01",
        title: "Divorce & Separation",
        img: "/assets/images/DS.png",
        alt: "Divorce & Separation",
        desc: "Disputes arising from marital breakdown including asset division, alimony, and separation agreements.",
        tags: ["Asset Division", "Alimony", "Legal Separation"],
    },
    {
        num: "02",
        title: "Maintenance / Alimony",
        img: "/assets/images/M&A.png",
        alt: "Maintenance / Alimony",
        desc: "Ongoing financial support disputes between separated or divorced spouses regarding maintenance obligations.",
        tags: ["Spousal Support", "Monthly Maintenance", "Financial Obligations"],
        reverse: true,
    },
    {
        num: "03",
        title: "Family and Dispute",
        img: "/assets/images/FLD.png",
        alt: "Family and Dispute",
        desc: "General family conflicts involving inheritance, property, or interpersonal disagreements within families.",
        tags: ["Inheritance Disputes", "Property Conflicts", "Sibling Disagreements"],
    },
    {
        num: "04",
        title: "Child Custody",
        img: "/assets/images/CC.png",
        alt: "Child Custody",
        desc: "Disputes about the custody, visitation rights, and parental responsibilities for minor children.",
        tags: ["Custody Rights", "Visitation Schedule", "Child Support"],
        reverse: true,
    },
    {
        num: "05",
        title: "Domestic Violence",
        img: "/assets/images/DV.png",
        alt: "Domestic Violence",
        desc: "Legal and safety disputes arising from domestic abuse, including protection orders and restraining matters.",
        tags: ["Protection Orders", "Restraining Orders", "Safety Concerns"],
    },
    {
        num: "06",
        title: "Guardianship Disputes",
        img: "/assets/images/GD.png",
        alt: "Guardianship Disputes",
        desc: "Disputes about who holds legal guardianship over minors or incapacitated adults.",
        tags: ["Legal Guardianship", "Minor Welfare", "Incapacity Disputes"],
        reverse: true,
    },
];

const resolveTips = [
    {
        img: "/assets/images/yoga.png",
        title: "Stay Calm & Be Willing to Talk",
        tips: [
            "Approach discussions calmly",
            "Avoid blame and accusations",
            "Share feelings without aggression",
            "Focus on resolving not winning",
        ],
    },
    {
        img: "/assets/images/listen.png",
        title: "Listen & Communicate Clearly",
        tips: [
            "Give each party full attention",
            "Avoid interrupting others",
            "Clarify what you've heard",
            "Acknowledge different perspectives",
        ],
    },
    {
        img: "/assets/images/agreement.png",
        title: "Set Clear Agreements",
        tips: [
            "Document agreed decisions",
            "Be specific about responsibilities",
            "Set timelines for each action",
            "Revisit agreements periodically",
        ],
    },
    {
        img: "/assets/images/work-together.png",
        title: "Work Together to Find a Solution",
        tips: [
            "Identify shared goals",
            "Explore all possible options",
            "Compromise where necessary",
            "Seek a win-win outcome",
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
        q: "Is mediation confidential for family disputes?",
        a: "Yes. All mediation sessions are strictly confidential. Nothing discussed can be used in court without both parties' consent, ensuring a safe space for open dialogue.",
    },
    {
        q: "Can I resolve a divorce dispute online?",
        a: "Absolutely. RaaziMarzi supports online dispute resolution for divorce, separation, alimony, and custody matters in a structured and legally sound manner.",
    },
    {
        q: "What if the other family member refuses to mediate?",
        a: "If the other party declines, we guide you on your available legal options and next steps to protect your rights effectively.",
    },
    {
        q: "How long does family dispute resolution take?",
        a: "Most family disputes are resolved within a few weeks, depending on the complexity and willingness of both parties to engage constructively.",
    },
];

const testimonials = [
    {
        name: "Resident, Pune",
        img: "/assets/images/t3.png",
        text: "The mediation helped us reach a fair child custody agreement without months in court. Very smooth experience.",
    },
    {
        name: "Client, Mumbai",
        img: "/assets/images/t4.png",
        text: "Resolving our inheritance dispute through RaaziMarzi saved us time, money and a lot of stress.",
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
        text: "Efficient and stress-free. I was able to resolve my dispute without stepping into a court.",
    },
];

export default function FamilyDisputes() {
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

            <div className="fd-page">
                {/* ══════════════════════════════════════════════
    HERO
══════════════════════════════════════════════ */}
                <section ref={heroRef} className={`fd-hero${heroVisible ? " hero-animate" : ""}`}>

                    {/* Left circle pair */}
                    <div className="fd-hero-cl1" aria-hidden="true" />
                    <div className="fd-hero-cl2" aria-hidden="true" />

                    {/* Right circle pair */}
                    <div className="fd-hero-cr1" aria-hidden="true" />
                    <div className="fd-hero-cr2" aria-hidden="true" />

                    <div className="fd-hero-card">

                        <div className="fd-hero-badge">
                            WE HANDLE EVERY DISPUTE PROFESSIONALLY
                        </div>

                        <h1 className="fd-hero-title">Family Dispute Resolution</h1>

                        <p className="fd-hero-sub">
                            With a track record of successfully resolving a wide range of legal
                            issues, we&apos;re committed to protecting your interests and helping
                            you achieve peace of mind.
                        </p>

                        <div className="fd-hero-btns">
                            <button
                                className="fd-hero-btn-primary"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
                                File a Case
                            </button>
                            <button
                                className="fd-hero-btn-secondary"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
                                Learn More
                            </button>
                        </div>

                    </div>
                </section>
                {/* ══════════════════════════════════════════════
                    WHAT IS FAMILY DISPUTES
                ══════════════════════════════════════════════ */}
                <section ref={whatRef} className={`fd-what${whatVisible ? " what-animate" : ""}`}>
                    <div className="fd-container fd-what-grid">
                        <div className="fd-what-left">
                            <p className="fd-eyebrow fd-eyebrow-left">INDIVIDUAL DISPUTES</p>
                            <h2 className="fd-section-title fd-left">What Is Family Disputes</h2>
                            <p className="fd-what-text">
                                Family disputes are conflicts that occur between family members over
                                matters such as divorce, child custody, inheritance, property,
                                financial support, and domestic relationships. These disputes can be
                                emotionally charged and legally complex.
                            </p>
                            <p className="fd-what-text">
                                RaaziMarzi provides a structured and confidential platform for
                                families to resolve such conflicts through online mediation and
                                arbitration, avoiding the stress and cost of lengthy court battles.
                            </p>
                            <button
                                className="fd-btn-primary fd-btn-sm"
                                onClick={() => navigateToApp("/user/file-new-case/step1")}
                            >
                                File a Case
                            </button>
                        </div>
                        <div className="fd-what-right">
                            <div className="fd-what-img-wrap">
                                <img src="/assets/images/FD.png" alt="Family Dispute" className="fd-what-img" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    CAUSES OF FAMILY CONFLICTS
                ══════════════════════════════════════════════ */}
                <section
                    ref={causesRef}
                    className={`fd-causes${causesVisible ? " causes-animate" : ""}`}
                >
                    <div className="fd-container fd-causes-grid">
                        <div className="fd-causes-left">
                            <p className="fd-eyebrow fd-eyebrow-left">WHAT ARE THE CAUSES</p>
                            <h2 className="fd-section-title fd-left">Causes of Family conflicts</h2>
                        </div>
                        <div className="fd-causes-cards">
                            {[
                                { title: "Lack of Communication", desc: "Misunderstandings and poor communication patterns lead to recurring conflicts between family members." },
                                { title: "Financial Issues", desc: "Disputes over money, inheritance, debts, or unequal financial contributions cause significant tension." },
                                { title: "Child-Related Concerns", desc: "Disagreements about parenting styles, custody, education, and child welfare create lasting family conflicts." },
                                { title: "Relationship Conflicts", desc: "Strained relationships between spouses, siblings, or parents often escalate into formal disputes." },
                            ].map((c, i) => (
                                <div key={i} className={`fd-cause-card causes-card-${i + 1}`}>
                                    <div className="fd-cause-dot" />
                                    <h4>{c.title}</h4>
                                    <p>{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            TYPES OF FAMILY DISPUTES
        ══════════════════════════════════════════════ */}
                <section
                    ref={typesRef}
                    className={`fd-types${typesVisible ? " types-animate" : ""}`}
                >
                    <div className="fd-container">
                        <p className="fd-eyebrow">SPECIALIZED AREAS</p>
                        <h2 className="fd-section-title">Types of Family Disputes</h2>
                        <p className="fd-section-sub">
                            Providing solutions for common personal disputes through secure online mediation.
                        </p>
                        <div className="fd-types-list">
                            {disputeTypes.map((item, i) => (
                                <div
                                    key={i}
                                    className={`fd-type-row${item.reverse ? " fd-type-row-rev" : ""} type-row-${i + 1}`}
                                >
                                    {/* Number column */}
                                    <div className="fd-type-num-col">
                                        <span className="fd-type-num">{item.num}</span>
                                    </div>

                                    {/* Content column */}
                                    <div className="fd-type-content">
                                        <h3 className="fd-type-title">{item.title}</h3>
                                        <p className="fd-type-desc">{item.desc}</p>
                                        <ul className="fd-type-tags">
                                            {item.tags.map((t, ti) => (
                                                <li key={ti}>
                                                    <span className="fd-tag-dot" />
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            className="fd-btn-outline"
                                            onClick={() => navigateToApp("/user/file-new-case/step1")}
                                        >
                                            Learn More
                                        </button>
                                    </div>

                                    {/* Image column */}
                                    <div className="fd-type-img-col">
                                        <div className="fd-type-img-wrap">
                                            <img src={item.img} alt={item.alt} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
    HOW TO RESOLVE FAMILY CONFLICTS
══════════════════════════════════════════════ */}
                <section
                    ref={resolveRef}
                    className={`fd-resolve${resolveVisible ? " resolve-animate" : ""}`}
                >
                    <div className="fd-container">
                        <p className="fd-eyebrow">INDIVIDUAL DISPUTES</p>
                        <h2 className="fd-section-title">How to Resolve Family Conflicts</h2>
                        <p className="fd-section-sub">
                            Follow a simple and structured approach to handle family conflicts
                            peacefully and reach a fair resolution.
                        </p>

                        <div className="fd-resolve-grid">

                            {/* Card 1 — top-left */}
                            <div className="fd-resolve-card resolve-card-1">
                                <h4 className="fd-resolve-card-title">Stay Calm & Be Willing to Talk</h4>
                                <ul className="fd-resolve-list">
                                    <li>Take time to cool down before discussing</li>
                                    <li>Focus on solving the issue, not winning</li>
                                    <li>Respect different opinions</li>
                                    <li>Keep the discussion on the main problem</li>
                                    <li>Avoid raising your voice or reacting emotionally</li>
                                    <li>Choose the right time and place to talk</li>
                                    <li>Be open to hearing things you may not agree with</li>
                                </ul>
                                <div className="fd-resolve-img-wrap">
                                    <img src={resolveTips[0]?.img} alt="Stay Calm" />
                                </div>
                            </div>

                            {/* Card 2 — top-right */}
                            <div className="fd-resolve-card resolve-card-2">
                                <h4 className="fd-resolve-card-title">Listen & Communicate Clearly</h4>
                                <ul className="fd-resolve-list">
                                    <li>Listen without interrupting</li>
                                    <li>Try to understand the other person's perspective</li>
                                    <li>Ask questions to avoid misunderstandings</li>
                                    <li>Express your thoughts calmly and honestly</li>
                                    <li>Maintain eye contact and attention</li>
                                    <li>Avoid blaming or accusing language</li>
                                    <li>Repeat or confirm what you understood</li>
                                    <li>Be clear and specific in what you say</li>
                                </ul>
                                <div className="fd-resolve-img-wrap">
                                    <img src={resolveTips[1]?.img} alt="Listen and Communicate" />
                                </div>
                            </div>

                            {/* Card 3 — bottom-left */}
                            <div className="fd-resolve-card resolve-card-3">
                                <h4 className="fd-resolve-card-title">Set Clear Agreements</h4>
                                <ul className="fd-resolve-list">
                                    <li>Make sure everyone understands the decision</li>
                                    <li>Define responsibilities clearly</li>
                                    <li>Write down the agreement if needed</li>
                                    <li>Respect the agreed outcome</li>
                                    <li>Set timelines if required</li>
                                    <li>Avoid assumptions—clarify everything</li>
                                    <li>Review the agreement if issues arise again</li>
                                    <li>Stay committed to what was agreed</li>
                                </ul>
                                <div className="fd-resolve-img-wrap">
                                    <img src={resolveTips[2]?.img} alt="Set Clear Agreements" />
                                </div>
                            </div>

                            {/* Card 4 — bottom-right */}
                            <div className="fd-resolve-card resolve-card-4">
                                <h4 className="fd-resolve-card-title">Work Together to Find a Solution</h4>
                                <ul className="fd-resolve-list">
                                    <li>Discuss possible solutions together</li>
                                    <li>Be open to compromise</li>
                                    <li>Focus on common ground</li>
                                    <li>Agree on a solution and follow it</li>
                                    <li>Think of solutions that benefit both sides</li>
                                    <li>Avoid "my way or your way" thinking</li>
                                    <li>Be flexible with expectations</li>
                                    <li>Consider long-term impact of decisions</li>
                                </ul>
                                <div className="fd-resolve-img-wrap">
                                    <img src={resolveTips[3]?.img} alt="Work Together" />
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
                    className={`fd-hiw-wrap hiw-section${hiwVisible ? " hiw-animate" : ""}`}
                >
                    <div className="hiw-header">
                        <p className="hiw-eyebrow">3 SIMPLE STEPS</p>
                        <h2 className="hiw-title">Still Not Resolved? Try Family Dispute Mediation</h2>
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

                {/* ══════════════════════════════════════════════
                    WHY CHOOSE
                ══════════════════════════════════════════════ */}
                <section ref={whyRef} className={`id-why${whyVisible ? " why-animate" : ""}`}>
                    <div className="id-container">
                        <div className="id-section-head center">
                            <p className="id-tag">WHY CHOOSE US</p>
                            <h2>Why Choose RaaziMarzi</h2>
                            <p className="id-section-sub">
                                A faster, secure, and reliable way to resolve disputes without lengthy court procedures.
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
                        <p className="svc-section-sub">Find answers to common questions about our online dispute resolution process.</p>
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
                        <p className="svc-section-sub">See how families are resolving disputes quickly and securely with our platform.</p>
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
                            <h2 className="svc-cta-title">Ready to find a peaceful resolution?</h2>
                            <p className="svc-cta-text">Join thousands of individuals who have settled their disputes with dignity and legal certainty.</p>
                            <button className="svc-cta-btn" onClick={() => navigateToApp("/user/file-new-case/step1")}>File a Case</button>
                        </div>
                    </div>
                </section>

            </div>

            <Footer />
        </>
    );
}
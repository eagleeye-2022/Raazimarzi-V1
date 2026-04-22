"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/header.css";

/* ─── Full UJM category tree ─── */
const SERVICE_TREE = [
  {
    id: "individual",
    label: "Individual Disputes",
    href: "/Services/IndividualDisputes",
    sub: [
      {
        label: "Property & Rental Disputes",
        href: "/Services/Property&RentalDisputes",
        items: [
          "Rent / Loan Disputes",
          "Security Deposit Disputes",
          "Lease Violations",
          "Maintenance Issues",
          "Boundary Disputes",
          "Illegal Possession",
        ],
      },
      {
        label: "Family Disputes",
        href: "/Services/FamilyDisputes",
        items: [
          "Divorce",
          "Maintenance / Alimony",
          "Property Division in Family",
          "Guardianship Disputes",
          "Domestic Violence & Protection Cases",
          "Dowry",
          "Child Custody",
        ],
      },
      {
        label: "Neighbour & Community",
        href: "/Services/NeighbourCommunity",
        items: [
          "Noise Complaints",
          "Parking Issues",
          "Privacy and Safety",
          "Maintenance",
        ],
      },
    ],
  },
  {
    id: "consumer",
    label: "Consumer Disputes",
    href: "/Services/ConsumerDisputes",
    sub: [
      {
        label: "Product Complaints",
        href: "/Services/ProductComplaints",
        items: ["Defective Product Complaint", "Warranty Disputes", "Product Not as Described"],
      },
      {
        label: "Service Complaints",
        href: "/Services/ServiceComplaints",
        items: ["Poor Service Quality", "Incomplete Service", "Service Delay", "False Promises"],
      },
      {
        label: "Delivery Issues",
        href: "/Services/DeliveryIssues",
        items: ["Product Not Delivered", "Late Delivery", "Wrong Product Delivered"],
      },
      {
        label: "Refund & Billing Disputes",
        href: "/Services/RefundBillingDisputes",
        items: ["Refund Not Received", "Overcharging Complaints", "Hidden Charges Disputes"],
      },
    ],
  },
  {
    id: "commercial",
    label: "Commercial Disputes",
    href: "/Services/CommercialDisputes",
    sub: [
      {
        label: "Trade & Business Disputes",
        href: "/Services/TradeBusinessDisputes",
        items: [
          "Trade Document Disputes",
          "Document & Transfer Disputes",
          "Cargo & Goods Transport Disputes",
          "Sale of Goods Disputes",
          "Trading Agency Disputes",
        ],
      },
      {
        label: "Finance & Banking Disputes",
        href: "/Services/FinanceBankingDisputes",
        items: [
          "Investment Agreement Disputes",
          "Insurance & Life Insurance Claim Disputes",
          "Financial Services Disputes",
          "Outsourcing & BPO Disputes",
          "Unpaid Invoices & Money Recovery",
          "Business Loan & Credit Disputes",
          "Cheque Bounce Disputes",
        ],
      },
      {
        label: "Corporate & Business Agreement Disputes",
        href: "/Services/CorporateBusinessDisputes",
        items: [
          "Joint Venture Disputes",
          "Shareholder & Investor Disputes",
          "Business Partnership Disputes",
          "Management & Consultancy Agreement Disputes",
          "Distribution & Licensing Agreement Disputes",
          "Agency Contract Disputes",
          "Board & Management Conflicts",
          "Mergers & Acquisition Disputes",
        ],
      },
      {
        label: "Construction & Infrastructure",
        href: "/Services/ConstructionInfrastructure",
        items: [
          "Construction Contract Disputes",
          "Infrastructure Project Disputes",
          "Tender & Procurement Disputes",
          "Contractor Payment Disputes",
          "Construction Defect & Quality Disputes",
          "Project Delay & Penalty Disputes",
        ],
      },
      {
        label: "Commercial Property Disputes",
        href: "/Services/CommercialPropertyDisputes",
        items: [
          "Commercial Property Lease Disputes",
          "Office Rent Disputes",
          "Warehouse & Industrial Rental Disputes",
          "Commercial Property Ownership Disputes",
          "Commercial Property Development Disputes",
        ],
      },
      {
        label: "Intellectual Property Disputes",
        href: "/Services/IntellectualPropertyDisputes",
        items: [
          "Trademark & Brand Disputes",
          "Copyright Infringement Disputes",
          "Patent Dispute Resolution",
          "Industrial Design Disputes",
          "Domain Name Disputes",
          "Trade Secret & Confidentiality Disputes",
        ],
      },
      {
        label: "Technology & Digital Disputes",
        href: "/Services/TechnologyDigitalDisputes",
        items: [
          "Technology Development Agreement Disputes",
          "Software & SaaS Licensing Disputes",
          "IT Services Agreement Disputes",
          "Digital Platform & App Disputes",
          "E-Commerce Platform Disputes",
        ],
      },
      {
        label: "Franchise & Distribution Disputes",
        href: "/Services/FranchiseDistributionDisputes",
        items: [
          "Franchise Agreement Disputes",
          "Franchise Royalty & Fee Disputes",
          "Franchise Territory Violation Disputes",
          "Franchise Termination Disputes",
          "Distribution Network Disputes",
          "Dealer/Ship Agreement Disputes",
        ],
      },
      {
        label: "Employment & Workforce Disputes",
        href: "/Services/EmploymentWorkforceDisputes",
        items: [
          "Employment Contract Disputes",
          "Wrongful Termination Disputes",
          "Salary & Severance Disputes",
          "Non-Compete Agreement Disputes",
          "Employee Confidentiality Disputes",
          "Contractor & Freelancer Disputes",
          "Workplace Harassment",
        ],
      },
      {
        label: "Contract & Agreement Disputes",
        href: "/Services/ContractAgreementDisputes",
        items: [
          "Breach of Contract",
          "Service Agreement Disputes",
          "Vendor & Supplier Contract Disputes",
          "Contract Non-Performance Disputes",
          "Payment Default Disputes",
          "Contract Cancellation Disputes",
        ],
      },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();

  const [mobileMenu,    setMobileMenu]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [servicesOpen,  setServicesOpen]  = useState(false);
  const [activeMain,    setActiveMain]    = useState(null); // "individual"|"consumer"|"commercial"
  const [activeSub,     setActiveSub]     = useState(null); // sub-category label
  const [mobileExpMain, setMobileExpMain] = useState(null);
  const [mobileExpSub,  setMobileExpSub]  = useState(null);

  const servicesRef    = useRef(null);
  const mobileMenuRef  = useRef(null);

  const isActive         = (path) => pathname === path;
  const isServiceActive  = pathname.startsWith("/Services");

  const navigateToApp = useCallback((path = "/login") => {
    try {
      window.location.href = `${APP_BASE_PATH}${path}`;
    } catch {
      window.location.href = "/app/login";
    }
  }, []);

  /* scroll */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* click outside desktop dropdown */
  useEffect(() => {
    const h = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
        setActiveMain(null);
        setActiveSub(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* body overflow + focus trap */
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
      const first = mobileMenuRef.current?.querySelector(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [mobileMenu]);

  /* escape key */
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        if (mobileMenu) setMobileMenu(false);
        if (servicesOpen) { setServicesOpen(false); setActiveMain(null); setActiveSub(null); }
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [mobileMenu, servicesOpen]);

  const closeAll = () => {
    setServicesOpen(false);
    setActiveMain(null);
    setActiveSub(null);
    setMobileMenu(false);
  };

  /* derived: active main category object */
  const activeMainObj = SERVICE_TREE.find(c => c.id === activeMain);
  /* derived: active sub object */
  const activeSubObj  = activeMainObj?.sub.find(s => s.label === activeSub);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container">

          {/* LOGO */}
          <div className="logo-area">
            <Link href="/" aria-label="Go to homepage">
              <Image
                src="/assets/images/logo.png"
                alt="RaaziMarzi Logo"
                width={160} height={40}
                priority sizes="160px"
                className="logo"
              />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="nav-links" aria-label="Main navigation">

            {/* ── Services mega-dropdown ── */}
            <div className="services-dropdown" ref={servicesRef}>
              <span className={`services-link ${isServiceActive ? "active" : ""}`}>
                <Link href="/Services" className={isActive("/Services") ? "active" : ""}>
                  Services
                </Link>
                <span
                  className="arrow"
                  role="button" tabIndex={0}
                  aria-expanded={servicesOpen}
                  aria-label="Toggle services menu"
                  onClick={() => { setServicesOpen(p => !p); setActiveMain(null); setActiveSub(null); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setServicesOpen(p => !p); }
                    if (e.key === "Escape") setServicesOpen(false);
                  }}
                >
                  {servicesOpen ? "⌃" : "⌄"}
                </span>
              </span>

              {/* MEGA MENU — 3 columns: main cats | sub cats | sub items */}
              {servicesOpen && (
                <div className="mega-menu" role="menu">

                  {/* Col 1 — Main categories */}
                  <div className="mega-col mega-col--main">
                    {SERVICE_TREE.map(cat => (
                      <div
                        key={cat.id}
                        className={`mega-main-item ${activeMain === cat.id ? "active" : ""}`}
                        onMouseEnter={() => { setActiveMain(cat.id); setActiveSub(null); }}
                        onClick={() => { setActiveMain(cat.id); setActiveSub(null); }}
                      >
                        <Link
                          href={cat.href}
                          onClick={closeAll}
                          className="mega-main-link"
                        >
                          {cat.label}
                        </Link>
                        <span className="mega-arrow">›</span>
                      </div>
                    ))}
                  </div>

                  {/* Col 2 — Sub categories */}
                  {activeMainObj && (
                    <div className="mega-col mega-col--sub">
                      <p className="mega-col-heading">{activeMainObj.label}</p>
                      {activeMainObj.sub.map(sub => (
                        <div
                          key={sub.label}
                          className={`mega-sub-item ${activeSub === sub.label ? "active" : ""}`}
                          onMouseEnter={() => setActiveSub(sub.label)}
                          onClick={() => setActiveSub(sub.label)}
                        >
                          <Link href={sub.href} onClick={closeAll} className="mega-sub-link">
                            {sub.label}
                          </Link>
                          {sub.items?.length > 0 && <span className="mega-arrow">›</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Col 3 — Leaf items */}
                  {activeSubObj?.items?.length > 0 && (
                    <div className="mega-col mega-col--items">
                      <p className="mega-col-heading">{activeSubObj.label}</p>
                      {activeSubObj.items.map(item => (
                        <div key={item} className="mega-item">
                          <Link
                            href={`${activeSubObj.href}#${item.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={closeAll}
                            className="mega-item-link"
                          >
                            {item}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href="/AboutUs"      className={isActive("/AboutUs")      ? "active" : ""}>About Us</Link>
            <Link href="/solutions"    className={isActive("/solutions")    ? "active" : ""}>Solutions</Link>
            <Link href="/case-journey" className={isActive("/case-journey") ? "active" : ""}>Case Journey</Link>
            <Link href="/ContactUs"    className={isActive("/ContactUs")    ? "active" : ""}>Contact Us</Link>
          </nav>

          {/* LOGIN BUTTON */}
          <div className="demo-btn">
            <button className="login-btn" onClick={() => navigateToApp("/login")} aria-label="Login">
              Login
            </button>
          </div>

          {/* MOBILE HAMBURGER */}
          <button className="mobile-icon" aria-label="Open mobile menu" aria-expanded={mobileMenu} onClick={() => setMobileMenu(true)}>
            ☰
          </button>
        </div>
      </header>

      {/* ══════════════ MOBILE MENU ══════════════ */}
      <div
        className={`mobile-menu-overlay ${mobileMenu ? "show" : ""}`}
        onClick={() => setMobileMenu(false)}
        role="dialog" aria-modal="true"
      >
        <div className="mobile-menu" ref={mobileMenuRef} onClick={e => e.stopPropagation()}>

          <button className="mobile-close" aria-label="Close" onClick={() => setMobileMenu(false)}>✕</button>

          {/* Services accordion */}
          <div className={`mobile-box ${mobileExpMain ? "open" : ""}`}>
            <div className="mobile-box-header">
              <Link href="/Services" className={isActive("/Services") ? "active" : ""} onClick={closeAll}>
                Services
              </Link>
              <span
                className="mobile-arrow"
                role="button" tabIndex={0}
                aria-expanded={!!mobileExpMain}
                onClick={() => setMobileExpMain(p => p ? null : SERVICE_TREE[0].id)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMobileExpMain(p => p ? null : SERVICE_TREE[0].id); } }}
              >
                {mobileExpMain ? "⌃" : "⌄"}
              </span>
            </div>

            {mobileExpMain && (
              <div className="mobile-accordion">
                {SERVICE_TREE.map(cat => (
                  <div key={cat.id} className="mobile-acc-group">
                    {/* Main category row */}
                    <div
                      className={`mobile-acc-main ${mobileExpMain === cat.id ? "open" : ""}`}
                      onClick={() => setMobileExpMain(p => p === cat.id ? null : cat.id)}
                    >
                      <Link href={cat.href} onClick={closeAll} className="mobile-acc-main-link">
                        {cat.label}
                      </Link>
                      <span className="mobile-acc-arrow">{mobileExpMain === cat.id ? "⌃" : "⌄"}</span>
                    </div>

                    {mobileExpMain === cat.id && (
                      <div className="mobile-acc-subs">
                        {cat.sub.map(sub => (
                          <div key={sub.label} className="mobile-acc-sub-group">
                            <div
                              className={`mobile-acc-sub-header ${mobileExpSub === sub.label ? "open" : ""}`}
                              onClick={() => setMobileExpSub(p => p === sub.label ? null : sub.label)}
                            >
                              <Link href={sub.href} onClick={closeAll} className="mobile-acc-sub-link">
                                {sub.label}
                              </Link>
                              {sub.items?.length > 0 && (
                                <span className="mobile-acc-arrow">{mobileExpSub === sub.label ? "⌃" : "⌄"}</span>
                              )}
                            </div>

                            {mobileExpSub === sub.label && sub.items?.length > 0 && (
                              <div className="mobile-acc-items">
                                {sub.items.map(item => (
                                  <Link
                                    key={item}
                                    href={`${sub.href}#${item.toLowerCase().replace(/\s+/g, "-")}`}
                                    onClick={closeAll}
                                    className="mobile-acc-item"
                                  >
                                    {item}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/AboutUs"      className="mobile-box" onClick={closeAll}>About Us</Link>
          <Link href="/solutions"    className="mobile-box" onClick={closeAll}>Solutions</Link>
          <Link href="/case-journey" className="mobile-box" onClick={closeAll}>Case Journey</Link>
          <Link href="/ContactUs"    className="mobile-box" onClick={closeAll}>Contact Us</Link>

          <button className="mobile-demo-btn login-btn" onClick={() => navigateToApp("/login")}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
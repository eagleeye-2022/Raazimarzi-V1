"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/header.css"; // ← Make sure header.css is placed at src/styles/header.css

/* ─── Auth hook – replace with your real auth ─── */
// import { useAuth } from "@/hooks/useAuth";

/* ─── Full UJM category tree (kept from original) ─── */
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

/* ─── Figma nav structure ─── */
const NAV_ITEMS = [
  {
    id: "product",
    label: "Product",
    dropdown: {
      sections: [
        {
          title: "Product",
          items: [
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              ),
              label: "User",
              desc: "Manage disputes and track cases",
              href: "/app/user",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
              label: "Mediator",
              desc: "Review and resolve disputes",
              href: "/app/mediator",
            },
          ],
        },
      ],
    },
  },
  {
    id: "solutions",
    label: "Solutions",
    href: "/Services",
    dropdown: {
      sections: [
        {
          title: "Solutions",
          items: SERVICE_TREE.map((cat) => ({
            icon: cat.id === "individual" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            ) : cat.id === "consumer" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            ),
            label: cat.label,
            desc: cat.id === "individual"
              ? "Resolve personal conflicts easily"
              : cat.id === "consumer"
              ? "Handle product and service issues"
              : "Manage business and contract disputes",
            href: cat.href,
            /* keep sub-menu data for mega panel */
            subTree: cat,
          })),
        },
      ],
    },
  },
  {
    id: "resources",
    label: "Resources",
    dropdown: {
      sections: [
        {
          title: "Resources",
          items: [
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              ),
              label: "Blog",
              desc: "Latest updates in legal-tech trends.",
              href: "/blog",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ),
              label: "Help Center",
              desc: "Documentation and direct support.",
              href: "/help",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ),
              label: "FAQs",
              desc: "Quick answers to common questions.",
              href: "/faq",
            },
          ],
        },
      ],
    },
  },
  {
    id: "pricing",
    label: "Pricing",
    href: "/pricing",
  },
];

/* ─── Solutions sub-panel (mega) ─── */
function SolutionsMega({ subTree, onClose }) {
  const [activeSub, setActiveSub] = useState(null);
  const activeSubObj = subTree?.sub.find((s) => s.label === activeSub);

  if (!subTree) return null;
  return (
    <div className="hdr-solutions-mega">
      <div className="hdr-mega-col hdr-mega-col--sub">
        <p className="hdr-mega-heading">{subTree.label}</p>
        {subTree.sub.map((sub) => (
          <div
            key={sub.label}
            className={`hdr-mega-sub-item ${activeSub === sub.label ? "active" : ""}`}
            onMouseEnter={() => setActiveSub(sub.label)}
          >
            <Link href={sub.href} onClick={onClose} className="hdr-mega-sub-link">
              {sub.label}
            </Link>
            {sub.items?.length > 0 && <span className="hdr-mega-chevron">›</span>}
          </div>
        ))}
      </div>
      {activeSubObj?.items?.length > 0 && (
        <div className="hdr-mega-col hdr-mega-col--items">
          <p className="hdr-mega-heading">{activeSubObj.label}</p>
          {activeSubObj.items.map((item) => (
            <div key={item} className="hdr-mega-item">
              <Link
                href={`${activeSubObj.href}#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={onClose}
                className="hdr-mega-item-link"
              >
                {item}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();

  /* ── replace with real auth ── */
  const isLoggedIn = false; // TODO: useAuth().isLoggedIn
  /* ──────────────────────────── */

  const [scrolled, setScrolled] = useState(false);
  const [openNav, setOpenNav] = useState(null);      // nav item id
  const [activeSolution, setActiveSolution] = useState(null); // solutions subTree
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileExpMain, setMobileExpMain] = useState(null);
  const [mobileExpSub, setMobileExpSub] = useState(null);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigateToApp = useCallback((path = "/login") => {
    try { window.location.href = `${APP_BASE_PATH}${path}`; }
    catch { window.location.href = "/app/login"; }
  }, []);

  /* scroll */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* click outside */
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenNav(null);
        setActiveSolution(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  /* escape key */
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        setOpenNav(null);
        setActiveSolution(null);
        setMobileMenu(false);
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const closeAll = () => {
    setOpenNav(null);
    setActiveSolution(null);
    setMobileMenu(false);
    setMobileExpMain(null);
    setMobileExpSub(null);
  };

  const toggleNav = (id) => {
    if (openNav === id) { setOpenNav(null); setActiveSolution(null); }
    else { setOpenNav(id); setActiveSolution(null); }
  };

  return (
    <>
      <header className={`hdr ${scrolled ? "hdr--scrolled" : "hdr--top"}`}>
        <div className="hdr__inner">

          {/* LOGO */}
          <Link href="/" className="hdr__logo" aria-label="RaaziMarzi home">
            <Image
              src="/assets/images/logo.png"
              alt="RaaziMarzi Logo"
              width={160} height={40}
              priority sizes="160px"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hdr__nav" aria-label="Main navigation" ref={dropdownRef}>
            {NAV_ITEMS.map((item) => {
              const isOpen = openNav === item.id;
              const hasDropdown = !!item.dropdown;
              // Solutions nav item uses /Services/* routes
              const isActive = item.id === "solutions"
                ? pathname.startsWith("/Services")
                : item.href
                ? pathname === item.href
                : pathname.startsWith(`/${item.id}`);

              return (
                <div key={item.id} className="hdr__nav-item">
                  {item.href && !hasDropdown ? (
                    <Link
                      href={item.href}
                      className={`hdr__nav-link ${isActive ? "hdr__nav-link--active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  ) : item.href && hasDropdown ? (
                    /* Has both href AND dropdown — label navigates, arrow toggles */
                    <div className={`hdr__nav-btn-wrap ${isOpen ? "hdr__nav-btn--open" : ""} ${isActive ? "hdr__nav-btn--active" : ""}`}>
                      <Link href={item.href} className="hdr__nav-btn-label" onClick={closeAll}>
                        {item.label}
                      </Link>
                      <span
                        className="hdr__nav-btn-arrow"
                        role="button"
                        tabIndex={0}
                        aria-expanded={isOpen}
                        onClick={() => toggleNav(item.id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleNav(item.id); } }}
                      >
                        <svg
                          className={`hdr__nav-chevron ${isOpen ? "hdr__nav-chevron--up" : ""}`}
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                        >
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  ) : (
                    /* Dropdown only — no direct href */
                    <button
                      className={`hdr__nav-btn ${isOpen ? "hdr__nav-btn--open" : ""} ${isActive ? "hdr__nav-btn--active" : ""}`}
                      onClick={() => toggleNav(item.id)}
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <svg
                        className={`hdr__nav-chevron ${isOpen ? "hdr__nav-chevron--up" : ""}`}
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                      >
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}

                  {/* DROPDOWN PANEL */}
                  {hasDropdown && isOpen && (
                    <div className={`hdr__dropdown hdr__dropdown--${item.id}`}>
                      {item.dropdown.sections.map((section) => (
                        <div key={section.title} className="hdr__dd-section">
                          <p className="hdr__dd-section-title">{section.title}</p>
                          <div className="hdr__dd-card">
                            {section.items.map((di) => (
                              <div key={di.label} className="hdr__dd-item-wrap">
                                <Link
                                  href={di.href}
                                  className="hdr__dd-item"
                                  onClick={() => { if (!di.subTree) closeAll(); }}
                                  onMouseEnter={() => {
                                    if (di.subTree) setActiveSolution(di.subTree);
                                    else setActiveSolution(null);
                                  }}
                                >
                                  <span className="hdr__dd-icon">{di.icon}</span>
                                  <span className="hdr__dd-text">
                                    <span className="hdr__dd-label">{di.label}</span>
                                    <span className="hdr__dd-desc">{di.desc}</span>
                                  </span>
                                  {di.subTree && (
                                    <svg className="hdr__dd-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Solutions mega panel */}
                      {item.id === "solutions" && activeSolution && (
                        <SolutionsMega subTree={activeSolution} onClose={closeAll} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA BUTTON */}
          <div className="hdr__cta">
            {isLoggedIn ? (
              <button className="hdr__btn" onClick={() => navigateToApp("/dashboard")}>
                My Dashboard
              </button>
            ) : (
              <button className="hdr__btn" onClick={() => navigateToApp("/login")}>
                Get Started
              </button>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="hdr__hamburger"
            aria-label="Open menu"
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(true)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ══════════ MOBILE MENU ══════════ */}
      <div
        className={`hdr-mob-overlay ${mobileMenu ? "hdr-mob-overlay--show" : ""}`}
        onClick={() => setMobileMenu(false)}
        role="dialog" aria-modal="true"
      >
        <div className="hdr-mob" ref={mobileMenuRef} onClick={(e) => e.stopPropagation()}>

          <div className="hdr-mob__top">
            <Link href="/" onClick={closeAll}>
              <Image src="/assets/images/logo.png" alt="RaaziMarzi Logo" width={130} height={32} />
            </Link>
            <button className="hdr-mob__close" aria-label="Close menu" onClick={() => setMobileMenu(false)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Services accordion (keeps full SERVICE_TREE) */}
          <div className={`hdr-mob__box ${mobileExpMain ? "hdr-mob__box--open" : ""}`}>
            <div className="hdr-mob__box-row">
              <Link href="/Services" className="hdr-mob__box-link" onClick={closeAll}>Services</Link>
              <button
                className="hdr-mob__toggle"
                aria-expanded={!!mobileExpMain}
                onClick={() => setMobileExpMain((p) => (p ? null : SERVICE_TREE[0].id))}
              >
                {mobileExpMain ? "⌃" : "⌄"}
              </button>
            </div>

            {mobileExpMain && (
              <div className="hdr-mob__acc">
                {SERVICE_TREE.map((cat) => (
                  <div key={cat.id} className="hdr-mob__acc-group">
                    <div
                      className={`hdr-mob__acc-main ${mobileExpMain === cat.id ? "hdr-mob__acc-main--open" : ""}`}
                      onClick={() => setMobileExpMain((p) => (p === cat.id ? null : cat.id))}
                    >
                      <Link href={cat.href} onClick={closeAll} className="hdr-mob__acc-main-link">{cat.label}</Link>
                      <span>{mobileExpMain === cat.id ? "⌃" : "⌄"}</span>
                    </div>

                    {mobileExpMain === cat.id && (
                      <div className="hdr-mob__acc-subs">
                        {cat.sub.map((sub) => (
                          <div key={sub.label} className="hdr-mob__acc-sub-group">
                            <div
                              className={`hdr-mob__acc-sub-hdr ${mobileExpSub === sub.label ? "hdr-mob__acc-sub-hdr--open" : ""}`}
                              onClick={() => setMobileExpSub((p) => (p === sub.label ? null : sub.label))}
                            >
                              <Link href={sub.href} onClick={closeAll} className="hdr-mob__acc-sub-link">{sub.label}</Link>
                              {sub.items?.length > 0 && <span>{mobileExpSub === sub.label ? "⌃" : "⌄"}</span>}
                            </div>

                            {mobileExpSub === sub.label && sub.items?.length > 0 && (
                              <div className="hdr-mob__acc-items">
                                {sub.items.map((item) => (
                                  <Link
                                    key={item}
                                    href={`${sub.href}#${item.toLowerCase().replace(/\s+/g, "-")}`}
                                    onClick={closeAll}
                                    className="hdr-mob__acc-item"
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

          <Link href="/AboutUs"      className="hdr-mob__box" onClick={closeAll}>About Us</Link>
          <Link href="/solutions"    className="hdr-mob__box" onClick={closeAll}>Solutions</Link>
          <Link href="/case-journey" className="hdr-mob__box" onClick={closeAll}>Case Journey</Link>
          <Link href="/pricing"      className="hdr-mob__box" onClick={closeAll}>Pricing</Link>
          <Link href="/ContactUs"    className="hdr-mob__box" onClick={closeAll}>Contact Us</Link>

          <button
            className="hdr__btn hdr-mob__btn"
            onClick={() => isLoggedIn ? navigateToApp("/dashboard") : navigateToApp("/login")}
          >
            {isLoggedIn ? "My Dashboard" : "Get Started"}
          </button>
        </div>
      </div>
    </>
  );
}
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { APP_BASE_PATH } from "@/config/appConfig";
import "@/styles/header.css";

export default function Header() {
  const pathname = usePathname();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const servicesRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isActive = (path) => pathname === path;
  const isServiceActive = pathname.startsWith("/Services");

  /* NAVIGATION HANDLER - Redirects to React App */
  const navigateToApp = useCallback((path = "/login") => {
    try {
      const appUrl = `${APP_BASE_PATH}${path}`;
      window.location.href = appUrl;
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback
      window.location.href = "/app/login";
    }
  }, []);

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* CLICK OUTSIDE HANDLER */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOCK BODY SCROLL ON MOBILE MENU */
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
      // Focus trap - focus first focusable element
      const firstFocusable = mobileMenuRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenu]);

  /* KEYBOARD NAVIGATION FOR DROPDOWNS */
  const handleServicesKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setServicesOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setServicesOpen(false);
    }
  };

  /* CLOSE MOBILE MENU ON ESC */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileMenu) {
        setMobileMenu(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenu]);

  return (
    <>
      {/* HEADER */}
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          {/* LOGO */}
          <div className="logo-area">
            <Link href="/" aria-label="Go to homepage">
              <Image
                src="/assets/images/logo.png"
                alt="RaaziMarzi Logo"
                width={160}
                height={40}
                priority
                sizes="160px"
                className="logo"
              />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="nav-links" aria-label="Main navigation">
            <div
              className="services-dropdown"
              ref={servicesRef}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className={`services-link ${isServiceActive ? "active" : ""}`}
                onClick={() => setServicesOpen((prev) => !prev)}
                onKeyDown={handleServicesKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                aria-label="Services menu"
              >
                Services <span className="arrow" aria-hidden="true">⌄</span>
              </span>

              <div
                className={`dropdown-menu ${servicesOpen ? "open" : ""}`}
                role="menu"
                aria-hidden={!servicesOpen}
              >
                <div className="dropdown-item">
                  <span>Commercial Dispute ➜</span>
                  <div className="sub-menu">
                    <Link
                      href="/Services/ContractDisputes"
                      className={isActive("/Services/ContractDisputes") ? "active" : ""}
                      role="menuitem"
                    >
                      Contract Dispute
                    </Link>
                    <Link
                      href="/Services/PartnershipDisputes"
                      className={isActive("/Services/PartnershipDisputes") ? "active" : ""}
                      role="menuitem"
                    >
                      Partnership Dispute
                    </Link>
                  </div>
                </div>

                <div className="dropdown-item">
                  <span>Individual Dispute ➜</span>
                  <div className="sub-menu">
                    <Link
                      href="/Services/Property&RentalDisputes"
                      className={isActive("/Services/Property&RentalDisputes") ? "active" : ""}
                      role="menuitem"
                    >
                      Property & Rental Dispute
                    </Link>
                    <Link
                      href="/Services/ConsumerDisputes"
                      className={isActive("/Services/ConsumerDisputes") ? "active" : ""}
                      role="menuitem"
                    >
                      Consumer Dispute
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/AboutUs" className={isActive("/AboutUs") ? "active" : ""}>
              About Us
            </Link>

            <Link href="/solutions" className={isActive("/solutions") ? "active" : ""}>
              Solutions
            </Link>

            <Link href="/case-journey" className={isActive("/case-journey") ? "active" : ""}>
              Case Journey
            </Link>

            <Link href="/ContactUs" className={isActive("/ContactUs") ? "active" : ""}>
              Contact Us
            </Link>
          </nav>

          {/* REQUEST DEMO BUTTON */}
          <div className="demo-btn">
            <button
              onClick={() => navigateToApp("/login")}
              aria-label="Request demo - Go to login page"
            >
              Request Demo
            </button>
          </div>

          {/* MOBILE ICON */}
          <button
            className="mobile-icon"
            aria-label="Open mobile menu"
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`mobile-menu-overlay ${mobileMenu ? "show" : ""}`}
        onClick={() => setMobileMenu(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div
          className="mobile-menu"
          ref={mobileMenuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="mobile-close"
            aria-label="Close mobile menu"
            onClick={() => setMobileMenu(false)}
          >
            ✕
          </button>

          {/* SERVICES */}
          <div className={`mobile-box ${servicesOpen ? "open" : ""}`}>
            <div
              className="mobile-box-header"
              onClick={() => setServicesOpen((prev) => !prev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setServicesOpen((prev) => !prev);
                }
              }}
              aria-expanded={servicesOpen}
            >
              Services <span aria-hidden="true">{servicesOpen ? "⌃" : "⌄"}</span>
            </div>

            <div className="mobile-sub-links">
              <Link
                href="/Services/ContractDisputes"
                onClick={() => setMobileMenu(false)}
              >
                Contract Disputes
              </Link>
              <Link
                href="/Services/PartnershipDisputes"
                onClick={() => setMobileMenu(false)}
              >
                Partnership Disputes
              </Link>
              <Link
                href="/Services/Property&RentalDisputes"
                onClick={() => setMobileMenu(false)}
              >
                Property & Rental Dispute
              </Link>
              <Link
                href="/Services/ConsumerDisputes"
                onClick={() => setMobileMenu(false)}
              >
                Consumer Disputes
              </Link>
            </div>
          </div>

          <Link
            href="/AboutUs"
            className="mobile-box"
            onClick={() => setMobileMenu(false)}
          >
            About Us
          </Link>
          <Link
            href="/solutions"
            className="mobile-box"
            onClick={() => setMobileMenu(false)}
          >
            Solutions
          </Link>
          <Link
            href="/case-journey"
            className="mobile-box"
            onClick={() => setMobileMenu(false)}
          >
            Case Journey
          </Link>
          <Link
            href="/ContactUs"
            className="mobile-box"
            onClick={() => setMobileMenu(false)}
          >
            Contact Us
          </Link>

          <button
            onClick={() => navigateToApp("/login")}
            className="mobile-demo-btn"
            aria-label="Request demo - Go to login"
          >
            Request Demo
          </button>
        </div>
      </div>
    </>
  );
}
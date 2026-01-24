"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "../styles/header.css";

export default function Header() {
  const pathname = usePathname();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const servicesRef = useRef(null);

  // ✅ APP URL FROM ENV (PRODUCTION SAFE)
  const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  const isActive = (path) => pathname === path;
  const isServiceActive = pathname.startsWith("/Services");

  /*SCROLL */ 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* LOCK SCROLL ON MOBILE */
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenu]);

  return (
    <>
      {/*  HEADER  */}
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          {/* LOGO */}
          <div className="logo-area">
            <Link href="/">
              <Image
                src="/assets/images/logo.png"
                alt="RaaziMarzi Logo"
                width={160}
                height={40}
                priority
                className="logo"
              />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="nav-links">
            <div
              className="services-dropdown"
              ref={servicesRef}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className={`services-link ${
                  isServiceActive ? "active" : ""
                }`}
                onClick={() => setServicesOpen((prev) => !prev)}
              >
                Services <span className="arrow">⌄</span>
              </span>

              <div
                className={`dropdown-menu ${
                  servicesOpen ? "open" : ""
                }`}
              >
                <div className="dropdown-item">
                  <span>Commercial Dispute ➜</span>
                  <div className="sub-menu">
                    <Link
                      href="/Services/ContractDisputes"
                      className={
                        isActive("/Services/ContractDisputes")
                          ? "active"
                          : ""
                      }
                    >
                      Contract Dispute
                    </Link>
                    <Link
                      href="/Services/PartnershipDisputes"
                      className={
                        isActive("/Services/PartnershipDisputes")
                          ? "active"
                          : ""
                      }
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
                      className={
                        isActive("/Services/Property&RentalDisputes")
                          ? "active"
                          : ""
                      }
                    >
                      Property & Rental Dispute
                    </Link>
                    <Link
                      href="/Services/ConsumerDisputes"
                      className={
                        isActive("/Services/ConsumerDisputes")
                          ? "active"
                          : ""
                      }
                    >
                      Consumer Dispute
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/AboutUs"
              className={isActive("/AboutUs") ? "active" : ""}
            >
              About Us
            </Link>

            <Link
              href="/solutions"
              className={isActive("/solutions") ? "active" : ""}
            >
              Solutions
            </Link>

            <Link
              href="/case-journey"
              className={isActive("/case-journey") ? "active" : ""}
            >
              Case Journey
            </Link>

            <Link
              href="/ContactUs"
              className={isActive("/ContactUs") ? "active" : ""}
            >
              Contact Us
            </Link>
          </nav>

          {/* REQUEST DEMO */}
          <div className="demo-btn">
            <Link href={`${APP_URL}/login`}></Link>
          </div>

          {/* MOBILE ICON */}
          <button
            className="mobile-icon"
            aria-label="Open Menu"
            onClick={() => setMobileMenu(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/*  MOBILE MENU  */}
      <div className={`mobile-menu-overlay ${mobileMenu ? "show" : ""}`}>
        <div className="mobile-menu">
          <button
            className="mobile-close"
            aria-label="Close Menu"
            onClick={() => setMobileMenu(false)}
          >
            ✕
          </button>

          {/* SERVICES */}
          <div className={`mobile-box ${servicesOpen ? "open" : ""}`}>
            <div
              className="mobile-box-header"
              onClick={() => setServicesOpen((prev) => !prev)}
            >
              Services <span>{servicesOpen ? "⌃" : "⌄"}</span>
            </div>

            <div className="mobile-sub-links">
              <Link href="/Services/ContractDisputes">
                Contract Disputes
              </Link>
              <Link href="/Services/PartnershipDisputes">
                Partnership Disputes
              </Link>
              <Link href="/Services/Property&RentalDisputes">
                Property & Rental Dispute
              </Link>
              <Link href="/Services/ConsumerDisputes">
                Consumer Disputes
              </Link>
            </div>
          </div>

          <Link href="/AboutUs" className="mobile-box">
            About Us
          </Link>
          <Link href="/case-journey" className="mobile-box">
            Case Journey
          </Link>
          <Link href="/ContactUs" className="mobile-box">
            Contact Us
          </Link>

          <Link href={`${APP_URL}/login`} className="mobile-demo-btn">
            Request Demo
          </Link>
        </div>
      </div>
    </>
  );
}

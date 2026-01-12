"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/header.css";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => pathname === path;
  const isServiceActive = pathname.startsWith("/Services");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          {/* Logo */}
          <div className="logo-area">
            <img
              src="/assets/images/logo.png"
              alt="RaaziMarzi Logo"
              className="logo"
            />
          </div>

          {/* Desktop Menu */}
          <nav className="nav-links">
            <div className="services-dropdown">
              <span
                className={`services-link ${
                  isServiceActive ? "active" : ""
                }`}
              >
                Services <span className="arrow">⌄</span>
              </span>

              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <span>Professional Dispute ➜</span>
                  <div className="sub-menu">
                    <Link
                      href="/Services/ContractDisputes"
                      className={
                        isActive("/Services/ContractDisputes") ? "active" : ""
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
                  <span>Personal Dispute ➜</span>
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
                        isActive("/Services/ConsumerDisputes") ? "active" : ""
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

          {/* Request Demo */}
          <div className="demo-btn">
            <Link href="/request-demo">Request Demo</Link>
          </div>

          {/* Mobile Icon */}
          <div
            className="mobile-icon"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <button
              className="mobile-close"
              onClick={() => setMobileMenu(false)}
            >
              ✕
            </button>

            <div className="mobile-box open">
              <div className="mobile-box-header">
                Services <span>⌃</span>
              </div>

              <div className="mobile-tabs">
                <button className="active">Professional Disputes</button>
                <button>Personal Disputes</button>
              </div>

              <div className="mobile-sub-links">
                <Link href="/Services/ContractDisputes">
                  Contract Disputes
                </Link>
                <Link href="/Services/PartnershipDisputes">
                  Partnership Disputes
                </Link>
              </div>

              <div className="mobile-sub-links">
                <Link href="/Services/Property&RentalDisputes">
                  Property & Rental Dispute Resolution (ODR)
                </Link>
                <Link href="/Services/ConsumerDisputes">
                  Consumer Disputes
                </Link>
              </div>
            </div>

            <div className="mobile-box">About Us</div>
            <div className="mobile-box">Case Journey</div>
            <div className="mobile-box">
              Resources <span>›</span>
            </div>
            <div className="mobile-box">Contact Us</div>

            <button className="mobile-demo-btn">Request Demo</button>
          </div>
        </div>
      )}
    </>
  );
}

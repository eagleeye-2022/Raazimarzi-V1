"use client";
import "../styles/footer.css";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <img
          src="/assets/images/logo.png"
          alt="RaaziMarzi Logo"
          className="logo"
        />

        <div className="footer-social">
          <p>Follow Us</p>
          <div className="social-icons">
            <FaInstagram />
            <FaFacebook />
            <FaWhatsapp />
          </div>
        </div>

        <div className="footer-newsletter">
          <p>Join Our Newsletter</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Email address" />
            <button>Submit</button>
          </div>
          <span className="newsletter-text">Subscribe to our newsletter</span>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-links">
        <div>
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Our Mission</a>
          <a href="#">Our Team</a>
          <a href="#">Careers</a>
          <a href="#">Contact Us</a>
        </div>

        <div>
          <h4>ODR Service</h4>
          <a href="#">Case Filing</a>
          <a href="#">Mediation Services</a>
          <a href="#">Document Review</a>
          <a href="#">Legal Drafting</a>
          <a href="#">Arbitration Services</a>
        </div>

        <div>
          <h4>Platform</h4>
          <a href="#">How ODR Works</a>
          <a href="#">Pricing</a>
          <a href="#">FAQs</a>
          <a href="#">Partner with Us</a>
          <a href="#">Success Stories</a>
        </div>

        <div>
          <h4>Legal</h4>
          <a href="#">How ODR Works</a>
          <a href="#">Pricing</a>
          <a href="#">FAQs</a>
          <a href="#">Partner with Us</a>
          <a href="#">Success Stories</a>
        </div>

        <div>
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Raise a Ticket</a>
          <a href="#">Support Email</a>
          <a href="#">Live Chat</a>
        </div>

        <div>
          <h4>Quick Links</h4>
          <a href="#">File a Case</a>
          <a href="#">Track Your Case</a>
          <a href="#">Advocate Registration</a>
          <a href="#">Client Login</a>
        </div>
      </div>

      <div className="footer-bottom">
        2024 All Rights are reserved by @raazimerzi.com
      </div>
    </footer>
  );
}

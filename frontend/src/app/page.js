"use client";
import { useState, useEffect } from "react";
import "@/styles/home.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="hero-wrapper">
        <div className="hero-content">
          <span className="hero-badge">
            Settle Conflicts Without Court – 100% Online
          </span>

          <h1 className="hero-title">
            Resolve <span className="blue">Disputes</span> Online Fair,
            <br />
            Fast & Hassle-<span className="blue">Free</span>
          </h1>

          <p className="hero-desc">
            Say goodbye to endless court visits and delays. Our Online Dispute
            Resolution platform helps individuals, businesses, and lawyers
            settle disputes securely, transparently, and from anywhere.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">File A Case</button>
            <button className="btn-dark">Talk To Expert</button>
          </div>
        </div>

        <div className="hero-visual">
          <span className={`raazi ${animate ? "show" : ""}`}>RAAZI</span>

          <img
            src="/assets/images/statue.png"
            className={`statue ${animate ? "drop" : ""}`}
            alt="Justice Statue"
          />

          <span className={`marzi ${animate ? "show" : ""}`}>MARZI</span>
        </div>
      </section>

      {/* USER DASHBOARD */}
      <section className="dashboard-section">
        <img
          src="/assets/images/user-dashboard.png"
          alt="Dashboard"
          className="dashboard-img"
        />
      </section>

      {/* HOW IT WORKS */}

      <section className="how-section">
  <h2 className="how-title">How Raazimerzi Works (Step-by-Step)</h2>

  <p className="how-subtitle">
    Say goodbye to endless court visits and delays. Our Online Dispute
    Resolution platform helps individuals.
  </p>

  <div className="how-cards">
    <div className="how-card">
      <div className="how-icon">
        <img src="/assets/icons/right.png" alt="step" />
      </div>
      <h4>Submit your dispute online</h4>
      <p>Once you raised your case after sign in / sign up.</p>
    </div>

    <div className="how-card">
      <div className="how-icon">
        <img src="/assets/icons/right.png" alt="step" />
      </div>
      <h4>Admin Approved</h4>
      <p>It will reflect on admin's dashboard. He/She will assign a case manager.</p>
    </div>

    <div className="how-card">
      <div className="how-icon">
        <img src="/assets/icons/right.png" alt="step" />
      </div>
      <h4>Assign to Case Manager</h4>
      <p>Case manager after review the whole document then assign to mediator.</p>
    </div>

    <div className="how-card">
      <div className="how-icon">
        <img src="/assets/icons/right.png" alt="step" />
      </div>
      <h4>Mediator Dashboard</h4>
      <p>Mediator will start the session as per the assigned date.</p>
    </div>
  </div>
</section>


      {/* BRAND STRIP */}
      <section className="brand-strip">
        <img src="/assets/images/rzmz frame.png" alt="Raazimerzi" />
      </section>

      {/* WHY CHOOSE */}
     <section className="why-section">
  <h2 className="why-title">Why Choose Our Raazimerzi Platform</h2>

  <p className="why-subtitle">
    Say goodbye to endless court visits and delays. Our Online Dispute
    Resolution platform helps individuals.
  </p>

  <div className="why-items">
    <div className="why-item">
      <img src="/assets/icons/faster.png" alt="Faster" />
      <p>Faster than court</p>
    </div>

    <div className="why-item">
      <img src="/assets/icons/cost.png" alt="Cost" />
      <p>Cost-effective</p>
    </div>

    <div className="why-item">
      <img src="/assets/icons/confidential.png" alt="Secure" />
      <p>Confidential & secure</p>
    </div>

    <div className="why-item">
      <img src="/assets/icons/neutral (2).png" alt="Neutral" />
      <p>Neutral & Unbiased</p>
    </div>

    <div className="why-item">
      <img src="/assets/icons/personal.png" alt="Personal" />
      <p>Personal & Professional</p>
    </div>

    <div className="why-item">
      <img src="/assets/icons/legally (2).png" alt="Legal" />
      <p>Legally compliant process</p>
    </div>
  </div>

  {/* DOTTED ARROW LINE */}
  <div className="why-dotted">
    <img src="/assets/images/dotted-arrow.png" alt="flow" />
  </div>
</section>


      {/* DISPUTES */}

   <section className="dispute-section">
  <div className="dispute-grid">

    {/* CARD 1 */}
    <div className="dispute-card">
      <img
        src="/assets/images/shadow bg.png"
        alt=""
        className="shadow-bg"
      />

      <h3>Professional Disputes</h3>

      <p>
        Say goodbye to endless court visits and delays. Our Online Dispute
        Resolution platform helps individuals. Say goodbye to endless court
        visits and delays. Our Online Dispute Resolution platform helps
        individuals. Say goodbye to endless court visits and delays.
        Our Online Dispute Resolution platform helps individuals.
        Say goodbye to endless court visits and delays.
        Our Online Dispute Resolution platform helps individuals.
      </p>

      <img
        src="/assets/images/people-icon.png"
        alt=""
        className="card-icon"
      />
    </div>

    {/* CARD 2 */}
    <div className="dispute-card">
      <img
        src="/assets/images/shadow bg.png"
        alt=""
        className="shadow-bg"
      />

      <h3>Personal Disputes</h3>

      <p>
        Say goodbye to endless court visits and delays. Our Online Dispute
        Resolution platform helps individuals. Say goodbye to endless court
        visits and delays. Our Online Dispute Resolution platform helps
        individuals. Say goodbye to endless court visits and delays.
        Our Online Dispute Resolution platform helps individuals.
        Say goodbye to endless court visits and delays.
        Our Online Dispute Resolution platform helps individuals.
      </p>

      <img
        src="/assets/images/people-icon.png"
        alt=""
        className="card-icon"
      />
    </div>

  </div>
</section>

  {/* Who We Help */}
<section className="who-help-section">
  <h2>Who We Help?</h2>
  <p>
    Say goodbye to endless court visits and delays. Our Online Dispute
    Resolution platform helps individuals.
  </p>

  <div className="who-help-list">

    <div className="help-card">
      <div className="icon-circle">
        <img src="/assets/icons/individuals.png" alt="Individuals" />
      </div>
      <span>Individuals</span>
    </div>

    <div className="help-card">
      <div className="icon-circle">
        <img src="/assets/icons/businesses.png" alt="Businesses & Startups" />
      </div>
      <span>Businesses & Startups</span>
    </div>

    <div className="help-card">
      <div className="icon-circle">
        <img src="/assets/icons/proffesionals.png" alt="Professionals" />
      </div>
      <span>Professionals (Freelancers,< br /> SMEs, Consultants)</span>
    </div>

  </div>
</section>



      {/* FEATURES */}
    <section className="features-section">
      <h2>Raazimarzi Features</h2>
      <p>
        Say goodbye to endless court visits and delays. Our Online Dispute
        Resolution platform helps individuals.
      </p>

      <div className="features-wrapper">

        {/* SVG ARROWS */}
        <svg className="feature-arrows" viewBox="0 0 1200 260">
          <path d="M200 130 C280 80, 340 80, 420 130" />
          <path d="M420 130 C500 180, 560 180, 640 130" />
          <path d="M640 130 C720 80, 780 80, 860 130" />
          <path d="M860 130 C940 180, 1000 180, 1080 130" />
        </svg>

        {/* ITEMS */}
        <div className="feature-item">
          <div className="circle">
            <img src="/assets/icons/secure (2).png" alt="" />
          </div>
          <span>Secure communication<br />dashboard</span>
        </div>

        <div className="feature-item">
          <div className="circle">
            <img src="/assets/icons/documents.png" alt="" />
          </div>
          <span>Document upload<br />& e-signing</span>
        </div>

        <div className="feature-item">
          <div className="circle">
            <img src="/assets/icons/auto.png" alt="" />
          </div>
          <span>Case tracking</span>
        </div>

        <div className="feature-item">
          <div className="circle">
            <img src="/assets/icons/case.png" alt="" />
          </div>
          <span>Auto reminders</span>
        </div>

        <div className="feature-item">
          <div className="circle">
            <img src="/assets/icons/chat.png" alt="" />
          </div>
          <span>Chat/video<br />mediation</span>
        </div>

      </div>
    </section>
  

      {/* TESTIMONIAL */}
   <section className="rz-testimonials">
  <div className="rz-testimonials-box">

    {/* LEFT CONTENT */}
    <div className="rz-testimonials-left">
      <h2>What Our Costumer Says</h2>
      <p>
        At Optiderma, we are deeply committed to delivering high-quality derma
        products that uphold the highest industry standards uphold the highest
      </p>
      <button className="rz-btn">Read more →</button>
    </div>

    {/* RIGHT CONTENT */}
    <div className="rz-testimonials-right">

      <div className="rz-testimonial-card card-1">
        <img src="/assets/images/women.png" alt="" />
        <div>
          <h4>Alisha Anand</h4>
          <p>
            At Optiderma, we are deeply committed to delivering high-quality derma
            products that uphold the highest industry.
          </p>
        </div>
        <span className="rz-quote">“”</span>
      </div>

      <div className="rz-testimonial-card card-2">
        <img src="/assets/images/women.png" alt="" />
        <div>
          <h4>Alisha Anand</h4>
          <p>
            At Optiderma, we are deeply committed to delivering high-quality derma
            products that uphold the highest industry.
          </p>
        </div>
        <span className="rz-quote">“”</span>
      </div>

      <div className="rz-testimonial-card card-3">
        <img src="/assets/images/women.png" alt="" />
        <div>
          <h4>Alisha Anand</h4>
          <p>
            At Optiderma, we are deeply committed to delivering high-quality derma
            products that uphold the highest industry.
          </p>
        </div>
        <span className="rz-quote">“”</span>
      </div>

    </div>
  </div>
</section>


{/* FAQ SECTION */}

<section className="faq-section">
  <h2 className="faq-title">Frequently Asked Questions (FAQ)</h2>
  <p className="faq-subtitle">
    Resolve business, customer, or personal conflicts through a secure,
    transparent online platform.
  </p>

  <div className="faq-box">

    {/* TABS */}
    <div className="faq-tabs">
      <button className="faq-tab active">Cases</button>
      <button className="faq-tab">Money</button>
      <button className="faq-tab">Policies</button>
      <button className="faq-tab">Resolve Cases</button>
      <button className="faq-tab">Victory %</button>
      <button className="faq-tab">Ordinary</button>
    </div>

    {/* QUESTIONS */}
    <div className="faq-questions">
      {[
        "What should I do if I think the contract has been breached?",
        "What should I do if I think the contract has been breached?",
        "What should I do if I think the contract has been breached?",
        "What should I do if I think the contract has been breached?",
        "What should I do if I think the contract has been breached?",
      ].map((q, i) => (
        <div key={i} className="faq-question">
          <span>{q}</span>
          <span className="faq-arrow">›</span>
        </div>
      ))}
    </div>

  </div>
</section>



      <section className="contract-cta">
  <div className="contract-cta-box">

    {/* LEFT CONTENT */}
    <div className="contract-cta-content">
      <h2>Resolve Disputes Online. Faster. Smarter. Peacefully.</h2>

      <p>
        Settle legal disputes without long court processes. RaaziMerzi connects you with expert mediators and lawyers for secure, transparent online resolution..
      </p>

      <div className="contract-cta-buttons">
        <button className="cta-primary">File A Case</button>
        <button className="cta-secondary">Talk to Expert</button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="contract-cta-image">
      <img src="/assets/images/cta home.png" alt="Contract Resolution" />
    </div>

  </div>
</section>


      <Footer />
    </>
  );
}

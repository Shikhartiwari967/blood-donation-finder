import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero */}
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>●</span>
            Connecting donors with those in need
          </div>

          <h1 className="hero-title">
            Every Drop Can
            <br />
            <span>Save a Life.</span>
          </h1>

          <p className="hero-description">
            Find blood donors quickly, respond to urgent blood requests,
            and help make a difference in someone's life.
          </p>

          <div className="hero-actions">
            <button
              className="hero-primary-btn"
              onClick={() => navigate("/register")}
            >
              Become a Donor
              <span>→</span>
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() => navigate("/find-donor")}
            >
              Find Blood
            </button>
          </div>

          <div className="hero-trust">
            <span>✓ Verified Donors</span>
            <span>✓ Real-time Requests</span>
            <span>✓ Secure Platform</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="blood-orbit">
            <div className="blood-drop">
              <span>♥</span>
            </div>
          </div>

          <div className="floating-card floating-card-top">
            <div className="floating-icon blood-icon">🩸</div>

            <div>
              <strong>Blood Needed</strong>
              <p>Urgent Request</p>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <div className="floating-icon success-icon">✓</div>

            <div>
              <strong>Donor Connected</strong>
              <p>Help is on the way</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-heading">
          <span className="section-label">HOW WE HELP</span>

          <h2>
            Making Blood Donation
            <br />
            <span>Simple & Accessible</span>
          </h2>

          <p>
            Our platform connects blood donors and recipients so that help
            can reach the right person at the right time.
          </p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon="🔍"
            title="Find a Donor"
            description="Search for available and verified donors based on blood group and location."
          />

          <FeatureCard
            icon="🩸"
            title="Request Blood"
            description="Create a blood request and reach matching donors when you need help."
          />

          <FeatureCard
            icon="🔔"
            title="Real-time Notifications"
            description="Stay updated when donors respond to your blood request."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>

          <h2>
            Three Steps.
            <br />
            <span>One Life Saved.</span>
          </h2>
        </div>

        <div className="steps-container">
          <Step
            number="01"
            title="Create an Account"
            description="Register as a donor or recipient and complete your profile."
          />

          <div className="step-line" />

          <Step
            number="02"
            title="Find or Request Blood"
            description="Search for donors or create a blood request with your requirements."
          />

          <div className="step-line" />

          <Step
            number="03"
            title="Connect & Help"
            description="Connect with matching donors and make a real difference."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-icon">♥</div>

          <h2>
            Be Someone's Reason
            <br />
            to Smile Today.
          </h2>

          <p>
            Your donation could be the difference between hope and despair.
          </p>

          <button
            className="cta-button"
            onClick={() => navigate("/register")}
          >
            Join Blood Donation Finder
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-logo">
          <span className="footer-logo-icon">♥</span>
          <span>Blood Donation Finder</span>
        </div>

        <p>Connecting people. Saving lives.</p>

        <div className="footer-divider" />

        <small>
          © 2026 Blood Donation Finder. All rights reserved.
        </small>
      </footer>
    </div>
  );
};

/* Feature Card */

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="feature-link">
        Learn more <span>→</span>
      </span>
    </div>
  );
};

/* Step */

const Step = ({ number, title, description }) => {
  return (
    <div className="step">
      <div className="step-number">{number}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
};

export default Home;
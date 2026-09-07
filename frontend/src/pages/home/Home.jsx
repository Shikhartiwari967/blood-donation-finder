import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          <span style={styles.logoIcon}>♥</span>
          <span>Blood Donation Finder</span>
        </div>

        <div style={styles.navActions}>
          <button
            style={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            style={styles.registerButton}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            <span>●</span> Connecting donors with those in need
          </div>

          <h1 style={styles.heroTitle}>
            Every Drop Can
            <br />
            <span style={styles.redText}>Save a Life.</span>
          </h1>

          <p style={styles.heroText}>
            Find blood donors quickly, respond to urgent blood requests,
            and help make a difference in someone's life.
          </p>

          <div style={styles.heroButtons}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/register")}
            >
              Become a Donor →
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/login")}
            >
              Find Blood
            </button>
          </div>

          <div style={styles.trustText}>
            ✓ Verified Donors &nbsp;&nbsp; ✓ Real-time Requests &nbsp;&nbsp;
            ✓ Secure Platform
          </div>
        </div>

        <div style={styles.heroVisual}>
          <div style={styles.bloodCircle}>
            <div style={styles.drop}>♥</div>
          </div>

          <div style={{ ...styles.floatingCard, ...styles.cardOne }}>
            <div style={styles.smallIcon}>🩸</div>
            <div>
              <strong>Blood Needed</strong>
              <p style={styles.cardText}>Urgent Request</p>
            </div>
          </div>

          <div style={{ ...styles.floatingCard, ...styles.cardTwo }}>
            <div style={styles.checkIcon}>✓</div>
            <div>
              <strong>Donor Connected</strong>
              <p style={styles.cardText}>Help is on the way</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>HOW WE HELP</span>

          <h2 style={styles.sectionTitle}>
            Making Blood Donation
            <br />
            <span style={styles.redText}>Simple & Accessible</span>
          </h2>

          <p style={styles.sectionDescription}>
            Our platform connects blood donors and recipients so that help
            can reach the right person at the right time.
          </p>
        </div>

        <div style={styles.featuresGrid}>
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
      <section style={styles.howSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>HOW IT WORKS</span>

          <h2 style={styles.sectionTitle}>
            Three Steps.
            <br />
            <span style={styles.redText}>One Life Saved.</span>
          </h2>
        </div>

        <div style={styles.stepsContainer}>
          <Step
            number="01"
            title="Create an Account"
            description="Register as a donor or recipient and complete your profile."
          />

          <div style={styles.stepLine}></div>

          <Step
            number="02"
            title="Find or Request Blood"
            description="Search for donors or create a blood request with your requirements."
          />

          <div style={styles.stepLine}></div>

          <Step
            number="03"
            title="Connect & Help"
            description="Connect with matching donors and make a real difference."
          />
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>
            Be Someone's Reason
            <br />
            to Smile Today.
          </h2>

          <p style={styles.ctaText}>
            Your donation could be the difference between hope and despair.
          </p>

          <button
            style={styles.ctaButton}
            onClick={() => navigate("/register")}
          >
            Join Blood Donation Finder →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>
          <span style={styles.logoIcon}>♥</span>
          Blood Donation Finder
        </div>

        <p style={styles.footerText}>
          Connecting people. Saving lives.
        </p>

        <p style={styles.copyright}>
          © 2026 Blood Donation Finder. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

/* Feature Card */
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>{icon}</div>

      <h3 style={styles.featureTitle}>{title}</h3>

      <p style={styles.featureDescription}>{description}</p>

      <div style={styles.learnMore}>Learn more →</div>
    </div>
  );
};

/* Step */
const Step = ({ number, title, description }) => {
  return (
    <div style={styles.step}>
      <div style={styles.stepNumber}>{number}</div>

      <h3 style={styles.stepTitle}>{title}</h3>

      <p style={styles.stepDescription}>{description}</p>
    </div>
  );
};

/* Styles */
const styles = {
  page: {
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },

  navbar: {
    height: "72px",
    padding: "0 7%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #f1f1f1",
    backgroundColor: "#ffffff",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
    cursor: "pointer",
  },

  logoIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  navActions: {
    display: "flex",
    gap: "12px",
  },

  loginButton: {
    padding: "10px 22px",
    border: "1px solid #dc2626",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#dc2626",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },

  registerButton: {
    padding: "10px 22px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },

  hero: {
    minHeight: "620px",
    padding: "70px 8%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "50px",
    background:
      "linear-gradient(135deg, #fff5f5 0%, #ffffff 55%, #fff5f5 100%)",
  },

  heroContent: {
    maxWidth: "620px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "30px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
  },

  heroTitle: {
    fontSize: "58px",
    lineHeight: "1.08",
    margin: "0 0 22px",
    fontWeight: "800",
    letterSpacing: "-2px",
    color: "#111827",
  },

  redText: {
    color: "#dc2626",
  },

  heroText: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#6b7280",
    maxWidth: "560px",
    marginBottom: "30px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "14px 25px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(220, 38, 38, 0.2)",
  },

  secondaryButton: {
    padding: "14px 25px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  trustText: {
    marginTop: "25px",
    fontSize: "13px",
    color: "#6b7280",
  },

  heroVisual: {
    width: "430px",
    height: "430px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  bloodCircle: {
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    backgroundColor: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 20px 60px rgba(220, 38, 38, 0.12)",
  },

  drop: {
    width: "180px",
    height: "220px",
    borderRadius: "55% 55% 60% 60%",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "65px",
    boxShadow: "0 15px 35px rgba(220, 38, 38, 0.3)",
  },

  floatingCard: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 18px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    fontSize: "13px",
  },

  cardOne: {
    top: "35px",
    left: "0",
  },

  cardTwo: {
    bottom: "45px",
    right: "0",
  },

  smallIcon: {
    fontSize: "25px",
  },

  checkIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },

  cardText: {
    margin: "3px 0 0",
    color: "#9ca3af",
    fontSize: "11px",
  },

  featuresSection: {
    padding: "90px 8%",
    backgroundColor: "#ffffff",
  },

  sectionHeader: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 50px",
  },

  sectionLabel: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#dc2626",
  },

  sectionTitle: {
    fontSize: "38px",
    lineHeight: "1.2",
    margin: "12px 0 16px",
    fontWeight: "800",
    color: "#111827",
  },

  sectionDescription: {
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  featuresGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
  },

  featureCard: {
    padding: "30px",
    border: "1px solid #f1f1f1",
    borderRadius: "15px",
    backgroundColor: "#ffffff",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.04)",
  },

  featureIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    backgroundColor: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    marginBottom: "20px",
  },

  featureTitle: {
    fontSize: "20px",
    margin: "0 0 10px",
    color: "#111827",
  },

  featureDescription: {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.7",
    minHeight: "72px",
  },

  learnMore: {
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "15px",
  },

  howSection: {
    padding: "90px 8%",
    backgroundColor: "#f9fafb",
  },

  stepsContainer: {
    maxWidth: "1050px",
    margin: "0 auto",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "25px",
  },

  step: {
    textAlign: "center",
    maxWidth: "260px",
  },

  stepNumber: {
    width: "55px",
    height: "55px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
  },

  stepTitle: {
    fontSize: "18px",
    margin: "0 0 10px",
    color: "#111827",
  },

  stepDescription: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#6b7280",
  },

  stepLine: {
    width: "80px",
    height: "1px",
    backgroundColor: "#d1d5db",
    marginTop: "27px",
  },

  ctaSection: {
    padding: "80px 8%",
    backgroundColor: "#dc2626",
    textAlign: "center",
  },

  ctaContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },

  ctaTitle: {
    color: "#ffffff",
    fontSize: "42px",
    lineHeight: "1.2",
    margin: "0 0 18px",
    fontWeight: "800",
  },

  ctaText: {
    color: "#fee2e2",
    fontSize: "17px",
    marginBottom: "30px",
  },

  ctaButton: {
    padding: "14px 25px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#dc2626",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  footer: {
    padding: "35px 8%",
    textAlign: "center",
    backgroundColor: "#111827",
    color: "#ffffff",
  },

  footerLogo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontWeight: "700",
    fontSize: "17px",
  },

  footerText: {
    color: "#9ca3af",
    fontSize: "13px",
    margin: "10px 0",
  },

  copyright: {
    color: "#6b7280",
    fontSize: "12px",
    margin: "15px 0 0",
  },
};

export default Home;
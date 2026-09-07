import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    phone: "",
    city: "",
    role: "donor",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic phone validation
    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div
          style={styles.logo}
          onClick={() => navigate("/")}
        >
          <span style={styles.logoIcon}>♥</span>
          <span>Blood Donation Finder</span>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.card}>
          {/* Icon */}
          <div style={styles.iconCircle}>
            <span style={styles.heart}>♥</span>
          </div>

          <h1 style={styles.title}>Create Your Account</h1>

          <p style={styles.subtitle}>
            Join the Blood Donation Finder community and help save lives.
          </p>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={styles.successBox}>
              <span>✓</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>

              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>

              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            {/* Phone */}
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>

              <input
                style={styles.input}
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength="10"
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div style={styles.field}>
              <label style={styles.label}>Password</label>

              <div style={styles.passwordWrapper}>
                <input
                  style={styles.passwordInput}
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.showButton}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small style={styles.hint}>
                Minimum 6 characters
              </small>
            </div>

            {/* Blood Group + Role */}
            <div style={styles.twoColumns}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Blood Group
                </label>

                <select
                  style={styles.select}
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select
                  </option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Account Type
                </label>

                <select
                  style={styles.select}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="donor">
                    Donor
                  </option>

                  <option value="recipient">
                    Recipient
                  </option>
                </select>
              </div>
            </div>

            {/* City */}
            <div style={styles.field}>
              <label style={styles.label}>City</label>

              <input
                style={styles.input}
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            {/* Register */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.registerButton,
                ...(loading
                  ? styles.disabledButton
                  : {}),
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div style={styles.bottomText}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={styles.linkButton}
            >
              Sign in
            </button>
          </div>
        </div>

        <p style={styles.footerText}>
          Your contribution can make a difference.
        </p>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#172033",
  },

  header: {
    height: "72px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    padding: "0 40px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#ef2b2d",
    cursor: "pointer",
  },

  logoIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "#ef2b2d",
  },

  main: {
    minHeight: "calc(100vh - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  card: {
    width: "100%",
    maxWidth: "560px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "40px",
    boxSizing: "border-box",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  iconCircle: {
    width: "58px",
    height: "58px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heart: {
    color: "#ef2b2d",
    fontSize: "27px",
  },

  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "600",
    margin: "0 0 10px",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#64748b",
    margin: "0 0 28px",
  },

  errorBox: {
    display: "flex",
    gap: "9px",
    alignItems: "center",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },

  successBox: {
    display: "flex",
    gap: "9px",
    alignItems: "center",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },

  field: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    height: "48px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    padding: "0 14px",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#172033",
    background: "#ffffff",
  },

  passwordWrapper: {
    width: "100%",
    height: "48px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    padding: "0 14px",
    fontSize: "14px",
    minWidth: 0,
  },

  showButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "0 14px",
  },

  hint: {
    display: "block",
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  select: {
    width: "100%",
    height: "48px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    padding: "0 12px",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#172033",
    background: "#ffffff",
  },

  registerButton: {
    width: "100%",
    height: "48px",
    border: "none",
    borderRadius: "8px",
    background: "#ef2b2d",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },

  bottomText: {
    textAlign: "center",
    marginTop: "25px",
    fontSize: "14px",
    color: "#64748b",
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#ef2b2d",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
    fontSize: "14px",
  },

  footerText: {
    marginTop: "22px",
    fontSize: "13px",
    color: "#94a3b8",
    textAlign: "center",
  },
};

export default Register;
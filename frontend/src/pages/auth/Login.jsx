import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      login(user, token);

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "recipient") {
        navigate("/recipient");
      } else {
        navigate("/donor");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
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

          <h1 style={styles.title}>Welcome Back</h1>

          <p style={styles.subtitle}>
            Sign in to continue to your Blood Donation Finder account.
          </p>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉</span>

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
            </div>

            {/* Password */}
            <div style={styles.field}>
              <label style={styles.label}>Password</label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>

                <input
                  style={styles.passwordInput}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
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
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                ...(loading ? styles.disabledButton : {}),
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <div style={styles.bottomText}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              style={styles.linkButton}
            >
              Create an account
            </button>
          </div>
        </div>

        <p style={styles.footerText}>
          Together, we can help save lives through blood donation.
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
    maxWidth: "450px",
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
    fontSize: "30px",
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

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    marginBottom: "8px",
  },

  inputWrapper: {
    height: "48px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#ffffff",
    overflow: "hidden",
    boxSizing: "border-box",
  },

  inputIcon: {
    width: "42px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "15px",
  },

  input: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#172033",
    padding: "0 12px 0 0",
    minWidth: 0,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#172033",
    padding: "0 8px 0 0",
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

  loginButton: {
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

export default Login;
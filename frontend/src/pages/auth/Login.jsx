import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

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
      <Navbar />

      <main className="login-main" style={styles.main}>
        <div className="login-card" style={styles.card}>
          {/* Header */}
          <div style={styles.iconCircle}>
            <span style={styles.heart}>♥</span>
          </div>

          <div style={styles.heading}>
          <h1 className="login-title" style={styles.title}>Welcome Back</h1>

           <p className="login-subtitle" style={styles.subtitle}>
              Sign in to continue to your Blood Donation Finder account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox} role="alert">
              <div style={styles.errorIcon}>!</div>

              <div>
                <strong style={styles.errorTitle}>Login failed</strong>

                <p style={styles.errorText}>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label} htmlFor="login-email">
                Email Address
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉</span>

                <input
                  id="login-email"
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
              <label style={styles.label} htmlFor="login-password">
                Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>

                <input
                  id="login-password"
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
                    setShowPassword((prev) => !prev)
                  }
                  style={styles.showButton}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                ...(loading ? styles.disabledButton : {}),
              }}
            >
              {loading && <span style={styles.spinner} />}

              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerLine} />

            <span style={styles.dividerText}>or</span>

            <span style={styles.dividerLine} />
          </div>

          {/* Register */}
          <div style={styles.bottomText}>
            <span>Don't have an account?</span>

            <button
              type="button"
              onClick={() => navigate("/register")}
              style={styles.linkButton}
            >
              Create an account
            </button>
          </div>

          {/* Security Note */}
          <div style={styles.securityNote}>
            <span>🔒</span>

            <span>
              Your account information is securely protected.
            </span>
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
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    boxSizing: "border-box",

    background:
      "linear-gradient(135deg, #fff7f7 0%, #f8fafc 50%, #ffffff 100%)",

    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    color: "#172033",
  },

  main: {
    width: "100%",
    maxWidth: "100vw",
    minHeight: "calc(100vh - 72px)",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    padding: "40px 16px 50px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  card: {
    width: "min(100%, 440px)",
    maxWidth: "440px",

    padding: "38px 24px",
    boxSizing: "border-box",

    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",

    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.08)",
  },

  iconCircle: {
    width: "60px",
    height: "60px",

    margin: "0 auto 20px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",
    background: "#fef2f2",

    boxShadow:
      "inset 0 0 0 1px #fee2e2",
  },

  heart: {
    color: "#dc2626",
    fontSize: "27px",
    lineHeight: 1,
  },

  heading: {
    textAlign: "center",
    marginBottom: "28px",
  },

  title: {
    margin: "0 0 9px",

    color: "#0f172a",
    fontSize: "30px",
    lineHeight: 1.2,
    fontWeight: "800",
    letterSpacing: "-0.6px",

    overflowWrap: "break-word",
  },

  subtitle: {
    maxWidth: "340px",

    margin: "0 auto",

    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",

    marginBottom: "22px",
    padding: "13px 14px",

    border: "1px solid #fecaca",
    borderRadius: "11px",

    background: "#fef2f2",
    color: "#991b1b",

    boxSizing: "border-box",
  },

  errorIcon: {
    width: "23px",
    height: "23px",

    flexShrink: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",

    background: "#dc2626",
    color: "#ffffff",

    fontSize: "12px",
    fontWeight: "800",
  },

  errorTitle: {
    display: "block",
    marginBottom: "2px",
    fontSize: "12px",
  },

  errorText: {
    margin: 0,
    fontSize: "12px",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  field: {
    width: "100%",
    marginBottom: "20px",
  },

  label: {
    display: "block",

    marginBottom: "8px",

    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
  },

  inputWrapper: {
    width: "100%",
    maxWidth: "100%",
    height: "49px",

    display: "flex",
    alignItems: "center",

    boxSizing: "border-box",

    border: "1px solid #cbd5e1",
    borderRadius: "10px",

    background: "#ffffff",

    overflow: "hidden",
  },

  inputIcon: {
    width: "43px",

    flexShrink: 0,

    textAlign: "center",

    color: "#94a3b8",
    fontSize: "14px",
  },

  input: {
    flex: 1,
    width: "0",
    minWidth: "0",
    height: "100%",

    border: "none",
    outline: "none",

    background: "transparent",

    color: "#172033",
    fontFamily: "inherit",
    fontSize: "14px",

    padding: "0 12px 0 0",
  },

  passwordInput: {
    flex: 1,
    width: "0",
    minWidth: "0",
    height: "100%",

    border: "none",
    outline: "none",

    background: "transparent",

    color: "#172033",
    fontFamily: "inherit",
    fontSize: "14px",

    padding: "0 7px 0 0",
  },

  showButton: {
    flexShrink: 0,

    border: "none",
    background: "transparent",

    color: "#dc2626",

    fontFamily: "inherit",
    fontSize: "12px",
    fontWeight: "700",

    cursor: "pointer",

    padding: "0 12px",
  },

  loginButton: {
    width: "100%",
    height: "49px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",

    marginTop: "5px",

    border: "none",
    borderRadius: "10px",

    background: "#dc2626",
    color: "#ffffff",

    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 18px rgba(220, 38, 38, 0.18)",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  spinner: {
    width: "14px",
    height: "14px",

    flexShrink: 0,

    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#ffffff",

    borderRadius: "50%",

    animation: "login-spin 0.7s linear infinite",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",

    margin: "26px 0 20px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e2e8f0",
  },

  dividerText: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  bottomText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "5px",

    color: "#64748b",
    fontSize: "13px",
    textAlign: "center",
  },

  linkButton: {
    border: "none",
    background: "transparent",

    color: "#dc2626",

    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: "700",

    cursor: "pointer",
    padding: 0,
  },

  securityNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",

    marginTop: "23px",
    paddingTop: "17px",

    borderTop: "1px solid #f1f5f9",

    color: "#94a3b8",
    fontSize: "10px",
    textAlign: "center",
  },

  footerText: {
    margin: "20px 0 0",

    color: "#94a3b8",

    fontSize: "12px",
    textAlign: "center",
  },
};

export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email and password are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/create-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin");
      }

      setMessage("Admin account created successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>♥</span>
          <span>Blood Donation Finder</span>
        </div>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.iconContainer}>🛡️</div>

          <h1 style={styles.title}>Create Admin Account</h1>

          <p style={styles.subtitle}>
            Create a new administrator account for the Blood Donation Finder
            platform.
          </p>

          {message && (
            <div style={styles.successMessage}>
              ✓ {message}
            </div>
          )}

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter admin name"
                style={styles.input}
              />
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                style={styles.input}
              />
            </div>

            {/* Phone */}
            <div style={styles.field}>
              <label style={styles.label}>
                Phone Number <span style={styles.optional}>(Optional)</span>
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={styles.input}
              />
            </div>

            {/* Password */}
            <div style={styles.field}>
              <label style={styles.label}>Password</label>

              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  style={styles.passwordInput}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.showButton}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div style={styles.securityBox}>
              <div style={styles.securityTitle}>
                🛡️ Admin privileges
              </div>

              <p style={styles.securityText}>
                Admin accounts have access to donor management, recipient
                management, blood requests, verification and platform
                activity logs.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating Admin..." : "Create Admin Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },

  header: {
    height: "70px",
    padding: "0 6%",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "19px",
    fontWeight: "700",
    color: "#111827",
  },

  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  backButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#dc2626",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },

  main: {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "50px 20px",
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "38px",
    boxShadow: "0 10px 35px rgba(0, 0, 0, 0.07)",
    border: "1px solid #f1f1f1",
  },

  iconContainer: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    backgroundColor: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    marginBottom: "18px",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    margin: "0 0 25px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  field: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  optional: {
    color: "#9ca3af",
    fontWeight: "400",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  passwordWrapper: {
    position: "relative",
  },

  passwordInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 65px 12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#111827",
  },

  showButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    backgroundColor: "transparent",
    color: "#dc2626",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
  },

  securityBox: {
    padding: "14px",
    backgroundColor: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "9px",
    margin: "8px 0 22px",
  },

  securityTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#9a3412",
    marginBottom: "5px",
  },

  securityText: {
    margin: 0,
    fontSize: "12px",
    lineHeight: "1.5",
    color: "#7c2d12",
  },

  submitButton: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  successMessage: {
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "8px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "600",
  },

  errorMessage: {
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "8px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default CreateAdmin;
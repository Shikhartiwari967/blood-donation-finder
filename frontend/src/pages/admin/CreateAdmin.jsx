import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./CreateAdmin.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

function CreateAdmin() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;

    if (!name || !email || !phone || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/create-admin",
        {
          name,
          email,
          phone,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message ||
          "Admin account created successfully."
      );

      setFormData(initialForm);
      setShowPassword(false);
    } catch (err) {
      console.error("Admin creation failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create the admin account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-admin-page">
      <header className="create-admin-header">
        <button
          type="button"
          className="create-admin-brand"
          onClick={() => navigate("/admin")}
          aria-label="Return to admin dashboard"
        >
          <span className="create-admin-brand-icon">♥</span>

          <span className="create-admin-brand-text">
            <strong>Blood Donation Finder</strong>
            <small>Administration</small>
          </span>
        </button>

        <button
          type="button"
          className="create-admin-back"
          onClick={() => navigate("/admin")}
        >
          <span aria-hidden="true">←</span>
          <span>Back to Dashboard</span>
        </button>
      </header>

      <main className="create-admin-main">
        <section className="create-admin-card">
          <div className="create-admin-eyebrow">
            ADMINISTRATION
          </div>

          <div className="create-admin-icon" aria-hidden="true">
            🛡️
          </div>

          <h1>Create Admin Account</h1>

          <p className="create-admin-subtitle">
            Add a new administrator to help manage the
            Blood Donation Finder platform.
          </p>

          {message && (
            <div
              className="create-admin-alert create-admin-success"
              role="status"
            >
              <span aria-hidden="true">✓</span>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div
              className="create-admin-alert create-admin-error"
              role="alert"
            >
              <span aria-hidden="true">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="create-admin-field">
              <label htmlFor="admin-name">Full Name</label>

              <input
                id="admin-name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                maxLength={50}
                required
                disabled={loading}
              />
            </div>

            <div className="create-admin-field">
              <label htmlFor="admin-email">Email Address</label>

              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="create-admin-field">
              <label htmlFor="admin-phone">Phone Number</label>

              <input
                id="admin-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength={10}
                pattern="[0-9]{10}"
                required
                disabled={loading}
              />

              <span className="create-admin-hint">
                Enter a 10-digit mobile number.
              </span>
            </div>

            <div className="create-admin-field">
              <label htmlFor="admin-password">Password</label>

              <div className="create-admin-password">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  minLength={6}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="create-admin-password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <span className="create-admin-hint">
                Use at least 6 characters.
              </span>
            </div>

            <div className="create-admin-security">
              <div className="create-admin-security-title">
                <span aria-hidden="true">🛡️</span>
                Administrator privileges
              </div>

              <p>
                Administrators can manage donors, recipients,
                blood requests, verification, and platform activity.
                Only create accounts for trusted administrators.
              </p>
            </div>

            <button
              type="submit"
              className="create-admin-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="create-admin-spinner" />
                  Creating account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </form>

          <p className="create-admin-footer">
            Blood Donation Finder · Secure administration
          </p>
        </section>
      </main>
    </div>
  );
}

export default CreateAdmin;
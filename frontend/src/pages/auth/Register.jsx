import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

import "./Register.css";

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

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
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
    <div className="register-page">
      <Navbar />

      <main className="register-main">
        <div className="register-card">

          {/* Icon */}
          <div className="register-icon">
            <span>♥</span>
          </div>

          {/* Header */}
          <div className="register-header">
            <h1>Create Your Account</h1>

            <p>
              Join the Blood Donation Finder community and
              help save lives.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="register-message register-error">
              <span className="message-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="register-message register-success">
              <span className="message-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            {/* Full Name */}
            <div className="register-field">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
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
            <div className="register-field">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
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
            <div className="register-field">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
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
            <div className="register-field">
              <label htmlFor="password">Password</label>

              <div className="register-password">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small>Minimum 6 characters</small>
            </div>

            {/* Blood Group + Role */}
            <div className="register-two-columns">
              <div className="register-field">
                <label htmlFor="bloodGroup">
                  Blood Group
                </label>

                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
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

              <div className="register-field">
                <label htmlFor="role">
                  Account Type
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="donor">Donor</option>
                  <option value="recipient">
                    Recipient
                  </option>
                </select>
              </div>
            </div>

            {/* City */}
            <div className="register-field">
              <label htmlFor="city">City</label>

              <input
                id="city"
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div className="register-login">
            <span>Already have an account?</span>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>

        <p className="register-footer">
          Your contribution can make a difference.
        </p>
      </main>
    </div>
  );
}

export default Register;
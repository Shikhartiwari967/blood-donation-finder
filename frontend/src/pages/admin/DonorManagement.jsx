
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./DonorManagement.css";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

function DonorManagement() {
  const { token } = useAuth();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingDonorId, setUpdatingDonorId] = useState(null);
  const [actionError, setActionError] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [isAvailable, setIsAvailable] = useState("");

  const fetchDonors = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.bloodGroup) {
        params.bloodGroup = filters.bloodGroup;
      }

      if (filters.city?.trim()) {
        params.city = filters.city.trim();
      }

      if (filters.isVerified !== undefined && filters.isVerified !== "") {
        params.isVerified = filters.isVerified;
      }

      if (filters.isAvailable !== undefined && filters.isAvailable !== "") {
        params.isAvailable = filters.isAvailable;
      }

      const response = await api.get("/admin/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setDonors(
        Array.isArray(response.data.donors)
          ? response.data.donors
          : []
      );
    } catch (err) {
      console.error("Failed to fetch donors:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load donors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDonors();
    } else {
      setLoading(false);
      setError("Please log in to access donor management.");
    }
  }, [token]);

  const getCurrentFilters = () => ({
    bloodGroup,
    city,
    isVerified,
    isAvailable,
  });

  const handleApplyFilters = (event) => {
    event.preventDefault();
    fetchDonors(getCurrentFilters());
  };

  const handleClearFilters = () => {
    setBloodGroup("");
    setCity("");
    setIsVerified("");
    setIsAvailable("");
    fetchDonors({});
  };

  const handleVerification = async (userId, verified) => {
    try {
      setUpdatingDonorId(userId);
      setActionError("");

      await api.patch(
        `/admin/donors/${userId}/verification`,
        { isVerified: verified },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchDonors(getCurrentFilters());
    } catch (err) {
      console.error("Verification update failed:", err);

      setActionError(
        err.response?.data?.message ||
          "Failed to update donor verification. Please try again."
      );
    } finally {
      setUpdatingDonorId(null);
    }
  };

  const verifiedCount = donors.filter(
    (donor) => donor.isVerified
  ).length;

  const availableCount = donors.filter(
    (donor) => donor.isAvailable
  ).length;

  const pendingCount = donors.filter(
    (donor) => !donor.isVerified
  ).length;

  if (loading && donors.length === 0) {
    return (
      <div className="donor-management">
        <div className="dm-state" role="status">
          <span className="dm-spinner" />
          <p>Loading donors...</p>
        </div>
      </div>
    );
  }

  if (error && donors.length === 0) {
    return (
      <div className="donor-management">
        <div className="dm-error" role="alert">
          <strong>Unable to load donors</strong>
          <p>{error}</p>
          <button
            type="button"
            className="dm-button dm-button-primary"
            onClick={() => fetchDonors(getCurrentFilters())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-management">
      {/* Page Header */}
      <header className="dm-header">
        <div>
          <span className="dm-eyebrow">ADMINISTRATION</span>
          <h1>Donor Management</h1>
          <p>
            Manage donor verification, monitor availability, and
            find registered donors.
          </p>
        </div>

        <button
          type="button"
          className="dm-button dm-button-secondary dm-refresh-button"
          onClick={() => fetchDonors(getCurrentFilters())}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {/* Summary Cards */}
      <section className="dm-summary-grid" aria-label="Donor statistics">
        <div className="dm-summary-card">
          <div className="dm-summary-icon dm-icon-total" aria-hidden="true">
            <span>♙</span>
          </div>
          <div>
            <p className="dm-summary-label">Total Donors</p>
            <p className="dm-summary-value">{donors.length}</p>
          </div>
        </div>

        <div className="dm-summary-card">
          <div className="dm-summary-icon dm-icon-verified" aria-hidden="true">
            <span>✓</span>
          </div>
          <div>
            <p className="dm-summary-label">Verified</p>
            <p className="dm-summary-value">{verifiedCount}</p>
          </div>
        </div>

        <div className="dm-summary-card">
          <div className="dm-summary-icon dm-icon-available" aria-hidden="true">
            <span>♥</span>
          </div>
          <div>
            <p className="dm-summary-label">Available</p>
            <p className="dm-summary-value">{availableCount}</p>
          </div>
        </div>

        <div className="dm-summary-card">
          <div className="dm-summary-icon dm-icon-pending" aria-hidden="true">
            <span>!</span>
          </div>
          <div>
            <p className="dm-summary-label">Pending Verification</p>
            <p className="dm-summary-value">{pendingCount}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="dm-filter-card">
        <div className="dm-section-heading">
          <div>
            <h2>Find Donors</h2>
            <p>Filter donors using their blood group, city, and status.</p>
          </div>
        </div>

        <form onSubmit={handleApplyFilters}>
          <div className="dm-filter-grid">
            <div className="dm-field">
              <label htmlFor="dm-blood-group">Blood Group</label>
              <select
                id="dm-blood-group"
                value={bloodGroup}
                onChange={(event) => setBloodGroup(event.target.value)}
              >
                <option value="">All blood groups</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="dm-field">
              <label htmlFor="dm-city">City</label>
              <input
                id="dm-city"
                type="text"
                value={city}
                placeholder="Enter city name"
                onChange={(event) => setCity(event.target.value)}
              />
            </div>

            <div className="dm-field">
              <label htmlFor="dm-verification">Verification</label>
              <select
                id="dm-verification"
                value={isVerified}
                onChange={(event) => setIsVerified(event.target.value)}
              >
                <option value="">All statuses</option>
                <option value="true">Verified</option>
                <option value="false">Not verified</option>
              </select>
            </div>

            <div className="dm-field">
              <label htmlFor="dm-availability">Availability</label>
              <select
                id="dm-availability"
                value={isAvailable}
                onChange={(event) => setIsAvailable(event.target.value)}
              >
                <option value="">All statuses</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="dm-filter-actions">
            <button
              type="submit"
              className="dm-button dm-button-primary"
              disabled={loading}
            >
              Apply Filters
            </button>

            <button
              type="button"
              className="dm-button dm-button-secondary"
              onClick={handleClearFilters}
              disabled={loading}
            >
              Clear Filters
            </button>
          </div>
        </form>
      </section>

      {/* Donor List */}
      <section className="dm-table-card">
        <div className="dm-table-heading">
          <div>
            <h2>Registered Donors</h2>
            <p>Review donor details and manage verification.</p>
          </div>

          <span className="dm-result-count">
            {donors.length} {donors.length === 1 ? "donor" : "donors"}
          </span>
        </div>

        {actionError && (
          <div className="dm-inline-error" role="alert">
            {actionError}
            <button
              type="button"
              onClick={() => setActionError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {error && donors.length > 0 && (
          <div className="dm-inline-error" role="alert">
            {error}
          </div>
        )}

        {loading && donors.length > 0 && (
          <div className="dm-loading-strip" role="status">
            Refreshing donor list...
          </div>
        )}

        {donors.length === 0 ? (
          <div className="dm-state">
            <div className="dm-empty-icon" aria-hidden="true">
              ♡
            </div>
            <h3>No donors found</h3>
            <p>
              Try changing your filters or clear them to see all donors.
            </p>
            <button
              type="button"
              className="dm-button dm-button-secondary"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="dm-table-wrapper">
            <table className="dm-table">
              <thead>
                <tr>
                  <th scope="col">Donor</th>
                  <th scope="col">Blood Group</th>
                  <th scope="col">Contact</th>
                  <th scope="col">City</th>
                  <th scope="col">Verification</th>
                  <th scope="col">Availability</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {donors.map((donor) => (
                  <tr key={donor._id}>
                    <td>
                      <div className="dm-donor-cell">
                        <div className="dm-avatar" aria-hidden="true">
                          {(donor.name || "D").trim().charAt(0).toUpperCase()}
                        </div>
                        <div className="dm-donor-details">
                          <span className="dm-donor-name">
                            {donor.name || "Unnamed donor"}
                          </span>
                          <span className="dm-donor-email">
                            {donor.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="dm-blood-group">
                        {donor.bloodGroup || "N/A"}
                      </span>
                    </td>

                    <td>{donor.phone || "—"}</td>

                    <td>{donor.city || "—"}</td>

                    <td>
                      <span
                        className={`dm-status ${
                          donor.isVerified
                            ? "dm-status-verified"
                            : "dm-status-unverified"
                        }`}
                      >
                        {donor.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`dm-status ${
                          donor.isAvailable
                            ? "dm-status-available"
                            : "dm-status-unavailable"
                        }`}
                      >
                        {donor.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          handleVerification(donor._id, !donor.isVerified)
                        }
                        disabled={updatingDonorId === donor._id}
                        className={`dm-verify-button ${
                          donor.isVerified ? "dm-unverify-button" : ""
                        }`}
                      >
                        {updatingDonorId === donor._id
                          ? "Updating..."
                          : donor.isVerified
                            ? "Unverify"
                            : "Verify"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default DonorManagement;

import { useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "./FindDonor.css";

function FindDonor() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const params = {};

      if (bloodGroup) {
        params.bloodGroup = bloodGroup;
      }

      if (city.trim()) {
        params.city = city.trim();
      }

      if (availability) {
        params.availability = availability;
      }

      const response = await api.get("/donors/search", {
        params,
      });

      setDonors(response.data.donors || []);
    } catch (error) {
      console.error("Donor search error:", error);

      setDonors([]);
      setError(
        error.response?.data?.message ||
          "Unable to search donors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBloodGroup("");
    setCity("");
    setAvailability("");
    setDonors([]);
    setError("");
    setSearched(false);
  };

  return (
    <div className="find-donor-page">
      <Navbar />

      <main className="find-donor-main">
        {/* Page Header */}
        <section className="find-donor-header">
          <div className="find-donor-heading">
            <span className="find-donor-label">DONOR SEARCH</span>

            <h1>Find a Blood Donor</h1>

            <p>
              Find verified donors based on blood group, city and
              availability.
            </p>
          </div>

          <div className="search-header-icon">🩸</div>
        </section>

        {/* Search Filters */}
        <section className="search-panel">
          <div className="search-panel-heading">
            <div>
              <h2>Search Donors</h2>
              <p>Enter your requirements to find matching donors.</p>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="search-fields">
              {/* Blood Group */}
              <div className="search-field">
                <label htmlFor="bloodGroup">Blood Group</label>

                <select
                  id="bloodGroup"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option value="">All Blood Groups</option>
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

              {/* City */}
              <div className="search-field">
                <label htmlFor="city">City</label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mathura"
                />
              </div>

              {/* Availability */}
              <div className="search-field">
                <label htmlFor="availability">Availability</label>

                <select
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="">Any Availability</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              {/* Actions */}
              <div className="search-actions">
                <button
                  type="submit"
                  className="search-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <span>⌕</span>
                      Search Donors
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="reset-button"
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div className="donor-error">
            <span className="error-icon">!</span>

            <div>
              <strong>Search failed</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <section className="results-section">
            <div className="results-heading">
              <div>
                <span className="results-label">SEARCH RESULTS</span>

                <h2>Verified Donors</h2>
              </div>

              <span className="results-count">
                {donors.length} donor{donors.length !== 1 ? "s" : ""}
              </span>
            </div>

            {donors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🩸</div>

                <h3>No matching donors found</h3>

                <p>
                  Try changing your blood group, city or availability
                  filters.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="empty-reset-button"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="donor-grid">
                {donors.map((donor) => (
                  <div className="donor-card" key={donor._id}>
                    <div className="donor-card-top">
                      <div className="donor-avatar">
                        {donor.name?.charAt(0)?.toUpperCase() || "D"}
                      </div>

                      <span className="verified-badge">
                        ✓ Verified
                      </span>
                    </div>

                    <div className="donor-main-info">
                      <div>
                        <h3>{donor.name}</h3>

                        <p className="donor-location">
                          <span>⌖</span>
                          {donor.city}
                        </p>
                      </div>

                      <div className="blood-badge">
                        {donor.bloodGroup}
                      </div>
                    </div>

                    <div className="donor-divider" />

                    <div className="donor-details">
                      <div className="detail-row">
                        <span>Blood Group</span>
                        <strong>{donor.bloodGroup}</strong>
                      </div>

                      <div className="detail-row">
                        <span>Availability</span>

                        <span
                          className={
                            donor.isAvailable
                              ? "availability available"
                              : "availability unavailable"
                          }
                        >
                          <span className="status-dot" />
                          {donor.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span>Verification</span>

                        <span className="verification-text">
                          ✓ Verified donor
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Initial State */}
        {!searched && (
          <section className="initial-state">
            <div className="initial-icon">🩸</div>

            <h2>Search for verified donors</h2>

            <p>
              Select your requirements above to find matching donors.
            </p>

            <div className="initial-features">
              <span>✓ Verified donors</span>
              <span>✓ Location based search</span>
              <span>✓ Availability status</span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default FindDonor;
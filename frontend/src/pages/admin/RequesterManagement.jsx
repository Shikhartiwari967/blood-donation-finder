import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./RequesterManagement.css";

function RequesterManagement() {
  const { token } = useAuth();

  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchRequesters = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/requesters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequesters(response.data.requesters || []);
    } catch (error) {
      console.error("Failed to fetch requesters:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load requesters."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequesters();
  }, [fetchRequesters]);

  const handleVerification = async (userId, verified) => {
    try {
      setUpdatingId(userId);
      setError("");

      await api.patch(
        `/admin/requesters/${userId}/verification`,
        { isVerified: verified },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchRequesters();
    } catch (error) {
      console.error("Requester verification update failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update requester verification."
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading && requesters.length === 0) {
    return (
      <div className="requester-state">
        <span className="requester-spinner" />
        <p>Loading requesters...</p>
      </div>
    );
  }

  return (
    <div className="requester-management">
      <header className="requester-header">
        <div>
          <span className="requester-eyebrow">
            ADMINISTRATION
          </span>
          <h1>Requester Management</h1>
          <p>
            Manage registered recipients and review their
            verification status.
          </p>
        </div>

        <button
          type="button"
          className="requester-button requester-button-secondary"
          onClick={fetchRequesters}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="requester-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <section
        className="requester-summary-grid"
        aria-label="Requester statistics"
      >
        <div className="requester-summary-card">
          <div className="requester-summary-icon">♙</div>
          <div>
            <p className="requester-summary-label">
              Total Requesters
            </p>
            <p className="requester-summary-value">
              {requesters.length}
            </p>
          </div>
        </div>

        <div className="requester-summary-card">
          <div className="requester-summary-icon requester-icon-verified">
            ✓
          </div>
          <div>
            <p className="requester-summary-label">
              Verified
            </p>
            <p className="requester-summary-value">
              {requesters.filter((item) => item.isVerified).length}
            </p>
          </div>
        </div>

        <div className="requester-summary-card">
          <div className="requester-summary-icon requester-icon-pending">
            !
          </div>
          <div>
            <p className="requester-summary-label">
              Pending Verification
            </p>
            <p className="requester-summary-value">
              {requesters.filter((item) => !item.isVerified).length}
            </p>
          </div>
        </div>
      </section>

      <section className="requester-table-card">
        <div className="requester-table-heading">
          <div>
            <h2>Registered Requesters</h2>
            <p>
              Review recipient details and manage verification.
            </p>
          </div>

          <span className="requester-count">
            {requesters.length}{" "}
            {requesters.length === 1 ? "requester" : "requesters"}
          </span>
        </div>

        {requesters.length === 0 ? (
          <div className="requester-state requester-empty">
            <span className="requester-empty-icon">♙</span>
            <h3>No requesters found</h3>
            <p>Registered recipient accounts will appear here.</p>
            <button
              type="button"
              className="requester-button requester-button-secondary"
              onClick={fetchRequesters}
            >
              Refresh list
            </button>
          </div>
        ) : (
          <div className="requester-table-wrapper">
            <table className="requester-table">
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Blood Group</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requesters.map((requester) => (
                  <tr key={requester._id}>
                    <td>
                      <div className="requester-person">
                        <span className="requester-avatar">
                          {(requester.name || "R")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div className="requester-person-details">
                          <span className="requester-person-name">
                            {requester.name || "Unknown"}
                          </span>
                          <span className="requester-person-email">
                            {requester.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="requester-blood-badge">
                        {requester.bloodGroup || "—"}
                      </span>
                    </td>

                    <td>{requester.phone || "—"}</td>
                    <td>{requester.city || "—"}</td>

                    <td>
                      <span
                        className={`requester-status ${
                          requester.isVerified
                            ? "requester-status-verified"
                            : "requester-status-pending"
                        }`}
                      >
                        {requester.isVerified
                          ? "Verified"
                          : "Not verified"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`requester-verify-button ${
                          requester.isVerified
                            ? "requester-unverify-button"
                            : ""
                        }`}
                        disabled={updatingId === requester._id}
                        onClick={() =>
                          handleVerification(
                            requester._id,
                            !requester.isVerified
                          )
                        }
                      >
                        {updatingId === requester._id
                          ? "Updating..."
                          : requester.isVerified
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

export default RequesterManagement;


import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./RequestManagement.css";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const requestStatuses = ["active", "fulfilled", "cancelled"];
const urgencyLevels = ["normal", "urgent", "critical"];

function RequestManagement() {
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [urgency, setUrgency] = useState("");

  const fetchRequests = useCallback(
    async (filters = {}) => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const params = {};

        if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
        if (filters.city?.trim()) params.city = filters.city.trim();
        if (filters.status) params.status = filters.status;
        if (filters.urgency) params.urgency = filters.urgency;

        const response = await api.get("/admin/requests", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        setRequests(
          Array.isArray(response.data.requests)
            ? response.data.requests
            : []
        );
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError(
          err.response?.data?.message || "Failed to load blood requests."
        );
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApplyFilters = (event) => {
    event.preventDefault();
    fetchRequests({ bloodGroup, city, status, urgency });
  };

  const handleClearFilters = () => {
    setBloodGroup("");
    setCity("");
    setStatus("");
    setUrgency("");
    fetchRequests();
  };

  const handleStatusChange = async (requestId, newStatus) => {
    const request = requests.find((item) => item._id === requestId);

    if (!request || request.status === newStatus) return;

    try {
      setUpdatingId(requestId);
      setError("");

      await api.patch(
        `/admin/requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchRequests({ bloodGroup, city, status, urgency });
    } catch (err) {
      console.error("Status update failed:", err);
      setError(
        err.response?.data?.message || "Failed to update request status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const counts = {
    active: requests.filter((request) => request.status === "active").length,
    fulfilled: requests.filter((request) => request.status === "fulfilled").length,
    cancelled: requests.filter((request) => request.status === "cancelled").length,
  };

  return (
    <div className="request-management">
      <header className="rm-header">
        <div>
          <span className="rm-eyebrow">ADMINISTRATION</span>
          <h1>Blood Request Management</h1>
          <p>
            Review requests, monitor urgency, and manage request statuses.
          </p>
        </div>

        <button
          type="button"
          className="rm-button rm-button-secondary rm-refresh"
          onClick={() => fetchRequests({ bloodGroup, city, status, urgency })}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <section className="rm-summary-grid" aria-label="Request statistics">
        <SummaryCard label="Requests Found" value={requests.length} type="total" />
        <SummaryCard label="Active" value={counts.active} type="active" />
        <SummaryCard label="Fulfilled" value={counts.fulfilled} type="fulfilled" />
        <SummaryCard label="Cancelled" value={counts.cancelled} type="cancelled" />
      </section>

      <form className="rm-filter-card" onSubmit={handleApplyFilters}>
        <div className="rm-section-heading">
          <h2>Filter Requests</h2>
          <p>Filter by blood group, location, status, or urgency.</p>
        </div>

        <div className="rm-filter-grid">
          <div className="rm-field">
            <label htmlFor="rm-blood-group">Blood Group</label>
            <select
              id="rm-blood-group"
              value={bloodGroup}
              onChange={(event) => setBloodGroup(event.target.value)}
            >
              <option value="">All blood groups</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="rm-field">
            <label htmlFor="rm-city">City</label>
            <input
              id="rm-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="rm-field">
            <label htmlFor="rm-status">Status</label>
            <select
              id="rm-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {requestStatuses.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="rm-field">
            <label htmlFor="rm-urgency">Urgency</label>
            <select
              id="rm-urgency"
              value={urgency}
              onChange={(event) => setUrgency(event.target.value)}
            >
              <option value="">All urgency levels</option>
              {urgencyLevels.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rm-filter-actions">
          <button className="rm-button rm-button-primary" type="submit">
            Apply Filters
          </button>
          <button
            className="rm-button rm-button-secondary"
            type="button"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </form>

      {error && (
        <div className="rm-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      <section className="rm-table-card">
        <div className="rm-table-heading">
          <div>
            <h2>Blood Requests</h2>
            <p>Requesters, locations, urgency, and current status.</p>
          </div>
          <span className="rm-result-count">
            {requests.length} {requests.length === 1 ? "request" : "requests"}
          </span>
        </div>

        {loading ? (
          <div className="rm-state">
            <span className="rm-spinner" />
            <p>Loading blood requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rm-state">
            <span className="rm-empty-icon" aria-hidden="true">⌕</span>
            <h3>No requests found</h3>
            <p>Try changing your filters or clearing them to see all requests.</p>
            <button
              type="button"
              className="rm-button rm-button-secondary"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="rm-table-wrapper">
            <table className="rm-table">
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Email</th>
                  <th>Blood Group</th>
                  <th>City</th>
                  <th>Hospital</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <span className="rm-requester-name">
                        {request.requester?.name || "N/A"}
                      </span>
                    </td>
                    <td className="rm-email">
                      {request.requester?.email || "N/A"}
                    </td>
                    <td>
                      <span className="rm-blood-badge">
                        {request.bloodGroup || "N/A"}
                      </span>
                    </td>
                    <td>{request.city || "N/A"}</td>
                    <td className="rm-hospital">{request.hospital || "N/A"}</td>
                    <td>{request.units ?? "—"}</td>
                    <td>
                      <span className={`rm-badge rm-urgency-${request.urgency || "normal"}`}>
                        {request.urgency || "normal"}
                      </span>
                    </td>
                    <td>
                      <span className={`rm-badge rm-status-${request.status || "active"}`}>
                        {request.status || "active"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="rm-action-select"
                        aria-label={`Update request status for ${request.requester?.name || "request"}`}
                        value={request.status}
                        disabled={updatingId === request._id}
                        onChange={(event) =>
                          handleStatusChange(request._id, event.target.value)
                        }
                      >
                        {requestStatuses.map((item) => (
                          <option key={item} value={item}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </option>
                        ))}
                      </select>
                      {updatingId === request._id && (
                        <span className="rm-updating">Saving…</span>
                      )}
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

function SummaryCard({ label, value, type }) {
  return (
    <article className="rm-summary-card">
      <span className={`rm-summary-icon rm-icon-${type}`} aria-hidden="true">
        {type === "total" ? "▤" : type === "active" ? "◷" : type === "fulfilled" ? "✓" : "×"}
      </span>
      <div className="rm-summary-content">
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default RequestManagement;

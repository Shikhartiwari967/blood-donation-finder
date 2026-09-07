import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function RequestManagement() {
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [urgency, setUrgency] = useState("");

  const fetchRequests = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.bloodGroup) {
        params.bloodGroup = filters.bloodGroup;
      }

      if (filters.city) {
        params.city = filters.city;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.urgency) {
        params.urgency = filters.urgency;
      }

      const response = await api.get("/admin/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setRequests(response.data.requests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load blood requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleApplyFilters = () => {
    fetchRequests({
      bloodGroup,
      city,
      status,
      urgency,
    });
  };

  const handleClearFilters = () => {
    setBloodGroup("");
    setCity("");
    setStatus("");
    setUrgency("");

    fetchRequests();
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await api.patch(
        `/admin/requests/${requestId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequests({
        bloodGroup,
        city,
        status,
        urgency,
      });
    } catch (error) {
      console.error("Status update failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update request status"
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.centerMessage}>
        Loading blood requests...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorMessage}>
        {error}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Blood Request Management
          </h1>

          <p style={styles.subtitle}>
            Manage blood requests, monitor urgency and update request status.
          </p>
        </div>
      </div>

      {/* Total Requests */}
      <div style={styles.totalCard}>
        <p style={styles.cardLabel}>Total Requests</p>
        <h2 style={styles.cardNumber}>
          {requests.length}
        </h2>
      </div>

      {/* Filters */}
      <div style={styles.filterCard}>
        <h2 style={styles.sectionTitle}>
          Filter Requests
        </h2>

        <div style={styles.filterGrid}>
          {/* Blood Group */}
          <div style={styles.field}>
            <label style={styles.label}>
              Blood Group
            </label>

            <select
              style={styles.input}
              value={bloodGroup}
              onChange={(e) =>
                setBloodGroup(e.target.value)
              }
            >
              <option value="">All</option>
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
          <div style={styles.field}>
            <label style={styles.label}>
              City
            </label>

            <input
              type="text"
              style={styles.input}
              value={city}
              placeholder="Enter city"
              onChange={(e) =>
                setCity(e.target.value)
              }
            />
          </div>

          {/* Status */}
          <div style={styles.field}>
            <label style={styles.label}>
              Status
            </label>

            <select
              style={styles.input}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Urgency */}
          <div style={styles.field}>
            <label style={styles.label}>
              Urgency
            </label>

            <select
              style={styles.input}
              value={urgency}
              onChange={(e) =>
                setUrgency(e.target.value)
              }
            >
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button
            style={styles.primaryButton}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>

          <button
            style={styles.secondaryButton}
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        {requests.length === 0 ? (
          <div style={styles.emptyState}>
            No blood requests found.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Requester</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Blood Group</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Hospital</th>
                  <th style={styles.th}>Units</th>
                  <th style={styles.th}>Urgency</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td style={styles.td}>
                      {request.requester?.name || "N/A"}
                    </td>

                    <td style={styles.td}>
                      {request.requester?.email || "N/A"}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.bloodBadge}>
                        {request.bloodGroup}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {request.city}
                    </td>

                    <td style={styles.td}>
                      {request.hospital}
                    </td>

                    <td style={styles.td}>
                      {request.units}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          request.urgency === "urgent"
                            ? styles.urgentBadge
                            : styles.normalBadge
                        }
                      >
                        {request.urgency}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          request.status === "fulfilled"
                            ? styles.fulfilledBadge
                            : request.status === "cancelled"
                            ? styles.cancelledBadge
                            : styles.activeBadge
                        }
                      >
                        {request.status}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <select
                        style={styles.actionSelect}
                        value={request.status}
                        onChange={(e) =>
                          handleStatusChange(
                            request._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="fulfilled">
                          Fulfilled
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "36px 32px",
    backgroundColor: "#f5f6f8",
    minHeight: "100%",
    boxSizing: "border-box",
  },

  header: {
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "16px",
  },

  totalCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "22px",
    marginBottom: "24px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  },

  cardLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  cardNumber: {
    margin: "8px 0 0",
    fontSize: "32px",
    color: "#0f172a",
  },

  filterCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "28px 24px",
    marginBottom: "24px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    margin: "0 0 24px",
    fontSize: "20px",
    color: "#0f172a",
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(150px, 1fr))",
    gap: "16px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    backgroundColor: "#ef1111",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "12px 20px",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontWeight: "600",
    cursor: "pointer",
  },

  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "1050px",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "16px 14px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },

  td: {
    padding: "15px 14px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
  },

  bloodBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "600",
  },

  urgentBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "600",
  },

  normalBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontWeight: "600",
  },

  activeBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontWeight: "600",
  },

  fulfilledBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontWeight: "600",
  },

  cancelledBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    fontWeight: "600",
  },

  actionSelect: {
    height: "36px",
    padding: "0 8px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },

  emptyState: {
    padding: "50px",
    textAlign: "center",
    color: "#64748b",
  },

  centerMessage: {
    padding: "40px",
    color: "#64748b",
  },

  errorMessage: {
    padding: "40px",
    color: "#dc2626",
  },
};

export default RequestManagement;
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function RequesterManagement() {
  const { token } = useAuth();

  const [requesters, setRequesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequesters = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/requesters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequesters(response.data.requesters);
    } catch (error) {
      console.error("Failed to fetch requesters:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load requesters"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequesters();
    }
  }, [token]);

  const handleVerification = async (userId, verified) => {
    try {
      await api.patch(
        `/admin/requesters/${userId}/verification`,
        {
          isVerified: verified,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequesters();
    } catch (error) {
      console.error(
        "Requester verification update failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update verification"
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.centerMessage}>
        Loading requesters...
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
        <h1 style={styles.title}>
          Requester Management
        </h1>

        <p style={styles.subtitle}>
          Manage requester verification and registered recipient accounts.
        </p>
      </div>

      {/* Total Requesters */}
      <div style={styles.totalCard}>
        <p style={styles.cardLabel}>
          Total Requesters
        </p>

        <h2 style={styles.cardNumber}>
          {requesters.length}
        </h2>
      </div>

      {/* Requester Table */}
      <div style={styles.tableCard}>
        {requesters.length === 0 ? (
          <div style={styles.emptyState}>
            No requesters found.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Blood Group</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Verified</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {requesters.map((requester) => (
                  <tr key={requester._id}>
                    <td style={styles.td}>
                      {requester.name}
                    </td>

                    <td style={styles.td}>
                      {requester.email}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.bloodBadge}>
                        {requester.bloodGroup}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {requester.phone}
                    </td>

                    <td style={styles.td}>
                      {requester.city}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          requester.isVerified
                            ? styles.verifiedBadge
                            : styles.notVerifiedBadge
                        }
                      >
                        {requester.isVerified
                          ? "Verified"
                          : "Not Verified"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        style={
                          requester.isVerified
                            ? styles.unverifyButton
                            : styles.verifyButton
                        }
                        onClick={() =>
                          handleVerification(
                            requester._id,
                            !requester.isVerified
                          )
                        }
                      >
                        {requester.isVerified
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
    minWidth: "900px",
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

  verifiedBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontWeight: "600",
  },

  notVerifiedBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "6px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontWeight: "600",
  },

  verifyButton: {
    border: "none",
    borderRadius: "7px",
    padding: "8px 14px",
    backgroundColor: "#ef1111",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  unverifyButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    padding: "8px 14px",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontWeight: "600",
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

export default RequesterManagement;
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./ActivityLogs.css";

function ActivityLogs() {
  const { token } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/activity-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(response.data.logs);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load activity logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="activity-logs-page">
        <div className="activity-logs-card">
          <div className="activity-state">
            <p className="activity-state-title">
              Loading activity logs...
            </p>
            <p className="activity-state-text">
              Please wait while we fetch the latest activity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-logs-page">
        <div className="activity-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="activity-logs-page">

      {/* Header */}
      <div className="activity-logs-header">
        <h1>Activity Logs</h1>
        <p>
          Monitor administrative activities performed on the platform.
        </p>
      </div>

      {/* Logs Card */}
      <div className="activity-logs-card">

        {/* Summary */}
        <div className="activity-logs-summary">
          <p className="activity-logs-summary-title">
            Recent Administrative Activity
          </p>

          <span className="activity-logs-count">
            {logs.length}
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="activity-state">
            <p className="activity-state-title">
              No activity logs found
            </p>

            <p className="activity-state-text">
              Administrative actions will appear here.
            </p>
          </div>
        ) : (
          <div className="activity-logs-table-wrapper">
            <table className="activity-logs-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target Type</th>
                  <th>Target ID</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span className="activity-admin-name">
                        {log.actor?.name || "Unknown"}
                      </span>
                    </td>

                    <td>
                      <span className="activity-action">
                        {log.action}
                      </span>
                    </td>

                    <td>
                      <span className="activity-target-type">
                        {log.targetType}
                      </span>
                    </td>

                    <td>
                      <span className="activity-target-id">
                        {log.targetId}
                      </span>
                    </td>

                    <td>
                      <span className="activity-details">
                        {log.details || "-"}
                      </span>
                    </td>

                    <td>
                      <span className="activity-date">
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </span>
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

export default ActivityLogs;
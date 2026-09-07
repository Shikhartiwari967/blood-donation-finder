import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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
    return <p>Loading activity logs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Activity Logs</h1>

      <p>Total Logs: {logs.length}</p>

      {logs.length === 0 ? (
        <p>No activity logs found.</p>
      ) : (
        <table border="1" cellPadding="8">
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
                  {log.actor?.name || "Unknown"}
                </td>

                <td>{log.action}</td>

                <td>{log.targetType}</td>

                <td>{log.targetId}</td>

                <td>{log.details || "-"}</td>

                <td>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ActivityLogs;
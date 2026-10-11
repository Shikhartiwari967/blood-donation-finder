import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">
        {error}
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>

        <p>
          Welcome back, {user?.name}. Here's an overview of the
          blood donation system.
        </p>
      </div>

      {/* Users */}
      <section className="admin-dashboard-section">
        <h2 className="admin-dashboard-section-title">
          Users
        </h2>

        <div className="admin-stats-grid">
          <StatCard
            title="Total Users"
            value={stats.users.total}
          />

          <StatCard
            title="Donors"
            value={stats.users.donors}
          />

          <StatCard
            title="Requesters"
            value={stats.users.requesters}
          />

          <StatCard
            title="Admins"
            value={stats.users.admins}
          />
        </div>
      </section>

      {/* Donors */}
      <section className="admin-dashboard-section">
        <h2 className="admin-dashboard-section-title">
          Donors
        </h2>

        <div className="admin-stats-grid two">
          <StatCard
            title="Verified Donors"
            value={stats.donors.verified}
          />

          <StatCard
            title="Available Donors"
            value={stats.donors.available}
          />
        </div>
      </section>

      {/* Blood Requests */}
      <section className="admin-dashboard-section">
        <h2 className="admin-dashboard-section-title">
          Blood Requests
        </h2>

        <div className="admin-stats-grid">
          <StatCard
            title="Total Requests"
            value={stats.requests.total}
          />

          <StatCard
            title="Active"
            value={stats.requests.active}
          />

          <StatCard
            title="Fulfilled"
            value={stats.requests.fulfilled}
          />

          <StatCard
            title="Cancelled"
            value={stats.requests.cancelled}
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="admin-dashboard-section">
        <h2 className="admin-dashboard-section-title">
          Notifications
        </h2>

        <div className="admin-stats-grid one">
          <StatCard
            title="Total Notifications"
            value={stats.notifications.total}
          />
        </div>
      </section>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-title">
        {title}
      </p>

      <p className="admin-stat-value">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
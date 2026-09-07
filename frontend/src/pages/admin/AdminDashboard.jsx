import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Welcome back, {user?.name}. Here's an overview of the
          blood donation system.
        </p>
      </div>

      {/* Users */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Users
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Donors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Blood Requests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Notifications
        </h2>

        <div className="max-w-sm">
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
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="text-3xl font-bold text-gray-900 mt-2">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
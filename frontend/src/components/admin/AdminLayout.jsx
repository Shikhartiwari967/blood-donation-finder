import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Overview", path: "/admin" },
    { name: "Donors", path: "/admin/donors" },
    { name: "Blood Requests", path: "/admin/requests" },
    { name: "Requesters", path: "/admin/requesters" },
    { name: "Activity Logs", path: "/admin/activity-logs" },
    { name: "Create Admin", path: "/admin/create-admin" },
  ];

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-logo">
          <h1>Blood Donation</h1>
          <h1>Finder</h1>

          <p>Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="admin-navigation">

          <p className="admin-navigation-label">
            Management
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

        </nav>

        {/* User section */}
        <div className="admin-user-section">

          <div className="admin-user-info">
            <p className="admin-user-name">
              {user?.name || "Administrator"}
            </p>

            <p className="admin-user-role">
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="admin-logout-button"
          >
            Logout
          </button>

        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">

        {/* Top bar */}
        <header className="admin-topbar">

          <h2 className="admin-topbar-title">
            Admin Dashboard
          </h2>

          <div className="admin-topbar-welcome">
            Welcome, {user?.name}
          </div>

        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
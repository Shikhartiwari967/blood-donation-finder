import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-red-600">
            Blood Donation
          </h1>
          <h1 className="text-xl font-bold text-gray-800">
            Finder
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
     <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Dashboard
            </h2>
          </div>

          <div className="text-sm text-gray-500">
            Welcome, {user?.name}
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
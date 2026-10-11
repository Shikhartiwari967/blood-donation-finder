import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, isAuthenticated } = useAuth();
  const location = useLocation();

  // Require a valid local authentication state.
  if (!isAuthenticated || !token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Prevent users from accessing routes for other roles.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboardByRole = {
      admin: "/admin",
      donor: "/donor",
      recipient: "/recipient",
    };

    return (
      <Navigate
        to={dashboardByRole[user.role] || "/"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;

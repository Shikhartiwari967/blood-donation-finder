import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, isAuthenticated } = useAuth();

  console.log("=== ProtectedRoute ===");
  console.log("user:", user);
  console.log("user role:", user?.role);
  console.log("token exists:", !!token);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("allowedRoles:", allowedRoles);

  if (!isAuthenticated) {
    console.log("REDIRECT: Not authenticated");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.log("REDIRECT: Role not allowed");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
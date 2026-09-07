import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import DonorDashboard from "../pages/donor/DonorDashboard";
import RecipientDashboard from "../pages/recipient/RecipientDashboard";


import DonorManagement from "../pages/admin/DonorManagement";
import RequestManagement from "../pages/admin/RequestManagement";
import RequesterManagement from "../pages/admin/RequesterManagement";
import ActivityLogs from "../pages/admin/ActivityLogs";
import CreateAdmin from "../pages/admin/CreateAdmin";

import AdminLayout from "../components/admin/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import FindDonor from "../pages/donor-search/FindDonor";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find-donor" element={<FindDonor />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          
          <Route
            path="donors"
            element={<DonorManagement />}
          />

          <Route
            path="requests"
            element={<RequestManagement />}
          />

          <Route
            path="requesters"
            element={<RequesterManagement />}
          />

        <Route
          path="activity-logs"
          element={<ActivityLogs />}
        />
        </Route>

        <Route
          path="create-admin"
          element={<CreateAdmin />}
        />

        {/* Donor */}
        <Route
          path="/donor"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Recipient */}
        <Route
          path="/recipient"
          element={
            <ProtectedRoute allowedRoles={["recipient"]}>
              <RecipientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default AppRoutes;
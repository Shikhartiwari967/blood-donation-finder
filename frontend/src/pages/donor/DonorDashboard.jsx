import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function DonorDashboard() {
  const { user, token, login, logout } = useAuth();

  const [isAvailable, setIsAvailable] = useState(
    user?.isAvailable ?? false
  );

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  const [responseLoading, setResponseLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------------------------
  // FETCH ACTIVE BLOOD REQUESTS
  // --------------------------------------------------

  const fetchActiveRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const response = await api.get("/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allRequests = response.data.requests || [];

      // Match donor's blood group and city
      const matchingRequests = allRequests.filter(
        (request) =>
          request.bloodGroup?.toLowerCase() ===
            user?.bloodGroup?.toLowerCase() &&
          request.city?.toLowerCase() ===
            user?.city?.toLowerCase()
      );

      setRequests(matchingRequests);
    } catch (error) {
      console.error(
        "Failed to fetch active blood requests:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load blood requests"
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchActiveRequests();
    }
  }, [token, user?.bloodGroup, user?.city]);

  // --------------------------------------------------
  // AVAILABILITY
  // --------------------------------------------------

  const handleAvailabilityChange = async () => {
    try {
      setAvailabilityLoading(true);
      setError("");
      setSuccess("");

      const newAvailability = !isAvailable;

      const response = await api.patch(
        "/donors/availability",
        {
          isAvailable: newAvailability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsAvailable(newAvailability);

      const updatedUser = {
        ...user,
        isAvailable: newAvailability,
      };

      login(updatedUser, token);

      setSuccess(
        response.data?.message ||
          "Availability updated successfully"
      );
    } catch (error) {
      console.error(
        "Availability update failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update availability"
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // --------------------------------------------------
  // ACCEPT / DECLINE REQUEST
  // --------------------------------------------------

  const handleRequestResponse = async (
    requestId,
    status
  ) => {
    try {
      setResponseLoading(requestId);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/requests/${requestId}/respond`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Blood request response successful:",
        response.data
      );

      // IMPORTANT:
      // Update the request locally instead of keeping
      // Accept / Decline buttons visible.
      setRequests((currentRequests) =>
        currentRequests.map((request) => {
          if (request._id !== requestId) {
            return request;
          }

          return {
            ...request,
            donorResponseStatus: status,
          };
        })
      );

      setSuccess(
        response.data?.message ||
          `Request ${status} successfully`
      );
    } catch (error) {
      console.error(
        "Request response failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to respond to blood request"
      );
    } finally {
      setResponseLoading(null);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    logout();
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-red-600">
              Blood Donation Finder
            </h1>

            <p className="text-sm text-gray-500">
              Donor Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome,{" "}
              <strong>
                {user?.name || "Donor"}
              </strong>
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-semibold text-gray-900">
          Donor Dashboard
        </h2>

        <p className="text-gray-500 mt-2">
          Manage your donation availability and respond
          to blood requests near you.
        </p>

        {/* ---------------------------------------- */}
        {/* PROFILE */}
        {/* ---------------------------------------- */}

        <section className="bg-white border rounded-xl p-7 mt-8 shadow-sm">
          <h3 className="text-xl font-medium">
            My Profile
          </h3>

          <p className="text-gray-500 mt-1">
            Your registered donor information
          </p>

          <div className="grid md:grid-cols-3 gap-5 mt-6">
            <ProfileItem
              label="Name"
              value={user?.name || "N/A"}
            />

            <ProfileItem
              label="Email"
              value={user?.email || "N/A"}
            />

            <ProfileItem
              label="Blood Group"
              value={user?.bloodGroup || "N/A"}
            />

            <ProfileItem
              label="City"
              value={user?.city || "N/A"}
            />

            <ProfileItem
              label="Role"
              value={user?.role || "donor"}
            />
          </div>
        </section>

        {/* ---------------------------------------- */}
        {/* STATUS CARDS */}
        {/* ---------------------------------------- */}

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Verification */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium">
              Verification Status
            </h3>

            <div className="mt-5">
              {user?.isVerified ? (
                <div className="text-green-600 font-semibold">
                  ✓ Verified Donor
                </div>
              ) : (
                <div className="text-red-600">
                  Your account is not verified by an
                  admin yet.
                </div>
              )}
            </div>
          </section>

          {/* Availability */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium">
              Donation Availability
            </h3>

            <p className="mt-4">
              Current Status:{" "}
              <strong
                className={
                  isAvailable
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {isAvailable
                  ? "Available"
                  : "Not Available"}
              </strong>
            </p>

            <button
              onClick={handleAvailabilityChange}
              disabled={availabilityLoading}
              className="mt-4 px-5 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {availabilityLoading
                ? "Updating..."
                : isAvailable
                ? "Mark as Not Available"
                : "Mark as Available"}
            </button>
          </section>
        </div>

        {/* ---------------------------------------- */}
        {/* SUCCESS / ERROR */}
        {/* ---------------------------------------- */}

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* ---------------------------------------- */}
        {/* NOT VERIFIED MESSAGE */}
        {/* ---------------------------------------- */}

        {!user?.isVerified && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
            You must be verified by an admin before
            responding to blood requests.
          </div>
        )}

        {/* ---------------------------------------- */}
        {/* ACTIVE REQUESTS */}
        {/* ---------------------------------------- */}

        <section className="bg-white border rounded-xl mt-8 shadow-sm overflow-hidden">
          <div className="p-7 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium">
                  Matching Blood Requests
                </h3>

                <p className="text-gray-500 mt-1">
                  Requests matching your blood group
                  and city
                </p>
              </div>

              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                {requests.length}
              </span>
            </div>
          </div>

          {loadingRequests ? (
            <div className="p-7">
              <p className="text-gray-500">
                Loading blood requests...
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-7">
              <p className="text-gray-500">
                No active blood requests found.
              </p>
            </div>
          ) : (
            <div>
              {requests.map((request) => {
                const hasResponded =
                  request.donorResponseStatus ===
                    "accepted" ||
                  request.donorResponseStatus ===
                    "declined";

                return (
                  <div
                    key={request._id}
                    className="p-7 border-b last:border-b-0"
                  >
                    {/* Top */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <span className="px-3 py-2 bg-red-100 text-red-600 font-semibold rounded-lg">
                          {request.bloodGroup}
                        </span>

                        <span
                          className={
                            request.urgency === "urgent"
                              ? "px-3 py-2 bg-red-50 text-red-600 rounded-lg"
                              : "px-3 py-2 bg-gray-100 text-gray-600 rounded-lg"
                          }
                        >
                          {request.urgency}
                        </span>
                      </div>

                      <span className="px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                        {request.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <p className="text-sm text-gray-500">
                          City
                        </p>

                        <p className="font-semibold mt-1">
                          {request.city}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Hospital
                        </p>

                        <p className="font-semibold mt-1">
                          {request.hospital}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Units Required
                        </p>

                        <p className="font-semibold mt-1">
                          {request.units}
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    {request.message && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Message
                        </p>

                        <p className="mt-1 text-gray-700">
                          {request.message}
                        </p>
                      </div>
                    )}

                    {/* -------------------------------- */}
                    {/* ACTION */}
                    {/* -------------------------------- */}

                    <div className="mt-6">
                      {!user?.isVerified ? (
                        <span className="text-red-600">
                          Verification required
                        </span>
                      ) : hasResponded ? (
                        <div className="flex items-center gap-3">
                          {request.donorResponseStatus ===
                          "accepted" ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                              ✓ Request Accepted
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                              Request Declined
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleRequestResponse(
                                request._id,
                                "accepted"
                              )
                            }
                            disabled={
                              responseLoading ===
                              request._id
                            }
                            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            {responseLoading ===
                            request._id
                              ? "Processing..."
                              : "Accept Request"}
                          </button>

                          <button
                            onClick={() =>
                              handleRequestResponse(
                                request._id,
                                "declined"
                              )
                            }
                            disabled={
                              responseLoading ===
                              request._id
                            }
                            className="px-5 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                          >
                            {responseLoading ===
                            request._id
                              ? "Processing..."
                              : "Decline"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// --------------------------------------------------
// PROFILE ITEM
// --------------------------------------------------

function ProfileItem({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold mt-2">
        {value}
      </p>
    </div>
  );
}

export default DonorDashboard;
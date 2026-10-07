import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./DonorDashboard.css";

function DonorDashboard() {
  const { user, token, login, logout } = useAuth();

  const [isAvailable, setIsAvailable] = useState(
    user?.isAvailable ?? false
  );

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH ACTIVE BLOOD REQUESTS
  // ==========================================

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
          request.city?.toLowerCase() === user?.city?.toLowerCase()
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

  // ==========================================
  // AVAILABILITY
  // ==========================================

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

  // ==========================================
  // ACCEPT / DECLINE REQUEST
  // ==========================================

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

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="donor-page">

      {/* ======================================
          HEADER
      ====================================== */}

    <header className="donor-header">
      <div className="donor-brand">
        <div className="donor-brand-icon">♥</div>

        <div className="donor-brand-text">
          <h1>Blood Donation Finder</h1>
          <p>Donor Dashboard</p>
        </div>
      </div>

      <div className="donor-header-right">
        <div className="donor-user">
          <span className="donor-user-label">Welcome back</span>
          <strong>{user?.name || "Donor"}</strong>
        </div>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="donor-container">

        {/* Welcome */}

        <section className="donor-welcome">
          <h2>
            Welcome back, {user?.name || "Donor"} 👋
          </h2>

          <p>
            Manage your donation availability and
            respond to blood requests near you.
          </p>
        </section>

        {/* ====================================
            PROFILE
        ==================================== */}

        <section className="donor-card">

          <div className="card-heading">
            <h3>My Profile</h3>

            <p>
              Your registered donor information
            </p>
          </div>

          <div className="profile-grid">

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
              value={
                <span className="blood-badge">
                  {user?.bloodGroup || "N/A"}
                </span>
              }
            />

            <ProfileItem
              label="Phone"
              value={user?.phone || "N/A"}
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

        {/* ====================================
            STATUS CARDS
        ==================================== */}

        <div className="status-grid">

          {/* Verification */}

          <section className="status-card">

            <div className="status-card-top">

              <div>
                <p className="status-label">
                  Account Verification
                </p>

                <h3>
                  {user?.isVerified
                    ? "Verified"
                    : "Pending"}
                </h3>
              </div>

              <div
                className={`status-icon ${
                  user?.isVerified
                    ? "verified"
                    : "pending"
                }`}
              >
                {user?.isVerified ? "✓" : "!"}
              </div>

            </div>

            <p className="status-description">
              {user?.isVerified
                ? "Your donor account has been verified by an administrator."
                : "Your account is waiting for administrator verification."}
            </p>

          </section>

          {/* Availability */}

          <section className="status-card">

            <div className="status-card-top">

              <div>
                <p className="status-label">
                  Donation Availability
                </p>

                <h3>
                  {isAvailable
                    ? "Available"
                    : "Not Available"}
                </h3>
              </div>

              <div
                className={`status-icon ${
                  isAvailable
                    ? "available"
                    : "unavailable"
                }`}
              >
                {isAvailable ? "✓" : "×"}
              </div>

            </div>

            <p className="status-description">
              {isAvailable
                ? "Recipients can currently find you for matching blood requests."
                : "You are currently unavailable for new blood requests."}
            </p>

            <button
              onClick={handleAvailabilityChange}
              disabled={availabilityLoading}
              className={`availability-btn ${
                isAvailable
                  ? "available-btn"
                  : "unavailable-btn"
              }`}
            >
              {availabilityLoading
                ? "Updating..."
                : isAvailable
                ? "Mark as Not Available"
                : "Mark as Available"}
            </button>

          </section>

        </div>

        {/* ====================================
            MESSAGES
        ==================================== */}

        {success && (
          <div className="success-message">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {/* ====================================
            VERIFICATION WARNING
        ==================================== */}

        {!user?.isVerified && (
          <div className="verification-warning">
            ⚠ You must be verified by an admin before
            responding to blood requests.
          </div>
        )}

        {/* ====================================
            MATCHING REQUESTS
        ==================================== */}

        <section className="donor-card requests-card">

          <div className="request-heading">

            <div className="card-heading">
              <h3>Matching Blood Requests</h3>

              <p>
                Requests matching your blood group
                and city
              </p>
            </div>

            <span className="request-count">
              {requests.length}
            </span>

          </div>

          {loadingRequests ? (

            <div className="empty-state">
              <div className="empty-icon">🩸</div>

              <h4>Loading requests...</h4>

              <p>
                Searching for matching blood requests
                near you.
              </p>
            </div>

          ) : requests.length === 0 ? (

            <div className="empty-state">
              <div className="empty-icon">🩸</div>

              <h4>No matching requests</h4>

              <p>
                There are currently no active blood
                requests matching your blood group and
                city.
              </p>
            </div>

          ) : (

            <div className="request-list">

              {requests.map((request) => {

                const hasResponded =
                  request.donorResponseStatus ===
                    "accepted" ||
                  request.donorResponseStatus ===
                    "declined";

                return (
                  <article
                    key={request._id}
                    className="request-item"
                  >

                    {/* Request header */}

                    <div className="request-top">

                      <div>

                        <span className="request-blood">
                          {request.bloodGroup}
                        </span>

                        <span
                          className={`urgency ${
                            request.urgency === "urgent"
                              ? "urgent"
                              : "normal"
                          }`}
                        >
                          {request.urgency}
                        </span>

                      </div>

                      <span className="request-status">
                        {request.status}
                      </span>

                    </div>

                    {/* Details */}

                    <div className="request-details">

                      <div>
                        <span>City</span>
                        <strong>
                          {request.city}
                        </strong>
                      </div>

                      <div>
                        <span>Hospital</span>
                        <strong>
                          {request.hospital}
                        </strong>
                      </div>

                      <div>
                        <span>Units Required</span>
                        <strong>
                          {request.units}
                        </strong>
                      </div>

                    </div>

                    {/* Message */}

                    {request.message && (
                      <div className="request-message">

                        <span>Message</span>

                        <p>
                          {request.message}
                        </p>

                      </div>
                    )}

                    {/* Actions */}

                    <div className="request-actions">

                      {!user?.isVerified ? (

                        <p className="verification-warning">
                          Verification required
                        </p>

                      ) : hasResponded ? (

                        request.donorResponseStatus ===
                        "accepted" ? (

                          <span className="request-status">
                            ✓ Request Accepted
                          </span>

                        ) : (

                          <span className="request-status">
                            Request Declined
                          </span>

                        )

                      ) : (

                        <>
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
                            className="accept-btn"
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
                            className="decline-btn"
                          >
                            {responseLoading ===
                            request._id
                              ? "Processing..."
                              : "Decline"}
                          </button>
                        </>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

// ==========================================
// PROFILE ITEM
// ==========================================

function ProfileItem({ label, value }) {
  return (
    <div className="profile-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default DonorDashboard;
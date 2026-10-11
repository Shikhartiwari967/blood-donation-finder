import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./RecipientDashboard.css";

const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-",
  "AB+", "AB-", "O+", "O-",
];

const INITIAL_FORM = {
  bloodGroup: "",
  city: "",
  hospital: "",
  units: 1,
  urgency: "normal",
  message: "",
};

function RecipientDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [responses, setResponses] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [loading, setLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [responsesLoading, setResponsesLoading] = useState(null);
  const [notificationActionLoading, setNotificationActionLoading] =
    useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchMyRequests = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/requests/my", authConfig);
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error("Failed to fetch blood requests:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your blood requests."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    try {
      setNotificationsLoading(true);

      const response = await api.get("/notifications", authConfig);
      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  }, [token]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count",
        authConfig
      );
      setUnreadCount(response.data.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setNotificationsLoading(false);
      return;
    }

    fetchMyRequests();
    fetchNotifications();
    fetchUnreadCount();
  }, [token, fetchMyRequests, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      city: user?.city || current.city,
    }));
  }, [user?.city]);

  const refreshDashboard = async () => {
    await Promise.all([
      fetchMyRequests(),
      fetchNotifications(),
      fetchUnreadCount(),
    ]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.bloodGroup) {
      setError("Please select a blood group.");
      return;
    }

    if (!formData.city.trim() || !formData.hospital.trim()) {
      setError("Please enter both city and hospital.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.units)) ||
      Number(formData.units) < 1
    ) {
      setError("Units must be a whole number of at least 1.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post(
        "/requests",
        {
          ...formData,
          city: formData.city.trim(),
          hospital: formData.hospital.trim(),
          message: formData.message.trim(),
          units: Number(formData.units),
        },
        authConfig
      );

      setSuccess(
        response.data?.message ||
          "Blood request created successfully."
      );

      setFormData({
        ...INITIAL_FORM,
        city: user?.city || "",
      });

      await refreshDashboard();
    } catch (err) {
      console.error("Failed to create blood request:", err);
      setError(
        err.response?.data?.message ||
          "Unable to create your blood request."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (requestId, status) => {
    setError("");
    setSuccess("");

    try {
      setStatusLoading(requestId);

      await api.patch(
        `/requests/${requestId}/status`,
        { status },
        authConfig
      );

      setSuccess("Blood request status updated.");
      await refreshDashboard();
    } catch (err) {
      console.error("Failed to update request status:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update the request status."
      );
    } finally {
      setStatusLoading(null);
    }
  };

  const handleViewResponses = async (requestId) => {
    try {
      setResponsesLoading(requestId);
      setError("");

      const response = await api.get(
        `/requests/${requestId}/responses`,
        authConfig
      );

      setResponses((current) => ({
        ...current,
        [requestId]: response.data.responses || [],
      }));
    } catch (err) {
      console.error("Failed to fetch donor responses:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load donor responses."
      );
    } finally {
      setResponsesLoading(null);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotificationActionLoading(notificationId);

      await api.patch(
        `/notifications/${notificationId}/read`,
        {},
        authConfig
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      await fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update the notification."
      );
    } finally {
      setNotificationActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotificationActionLoading("all");

      await api.patch("/notifications/read-all", {}, authConfig);

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
      setSuccess("All notifications marked as read.");
    } catch (err) {
      console.error("Failed to update notifications:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update notifications."
      );
    } finally {
      setNotificationActionLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleString();
  };

  const getNotificationTitle = (type) => {
    const titles = {
      blood_request: "Blood Request Update",
      request_response: "Donor Response",
      request_status: "Request Status Update",
    };

    return titles[type] || "System Notification";
  };

  const getNotificationCount = (request) =>
    Array.isArray(request.donorResponses)
      ? request.donorResponses.length
      : 0;

  if (!token) {
    return (
      <div className="recipient-dashboard">
        <div className="recipient-state">
          <h1>Session required</h1>
          <p>Please sign in to access your recipient dashboard.</p>
          <button
            type="button"
            className="recipient-button recipient-button-primary"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipient-dashboard">
      <header className="recipient-header">
        <div className="recipient-brand">
          <div className="recipient-brand-icon" aria-hidden="true">
            ♥
          </div>

          <div className="recipient-brand-copy">
            <h2>Blood Donation Finder</h2>
            <p>Recipient Dashboard</p>
          </div>
        </div>

        <div className="recipient-header-actions">
          <div className="recipient-welcome">
            <span>Welcome back,</span>
            <strong>{user?.name || "Recipient"}</strong>
          </div>

          <button
            type="button"
            className="recipient-button recipient-button-outline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="recipient-main">
        <section className="recipient-page-intro">
          <div>
            <span className="recipient-eyebrow">
              RECIPIENT PORTAL
            </span>

            <h1 className="recipient-page-title">
              Recipient Dashboard
            </h1>

            <p>
              Create blood requests, track donor responses and stay
              informed about updates to your requests.
            </p>
          </div>

          <div className="recipient-intro-icon" aria-hidden="true">
            ♥
          </div>
        </section>

        {success && (
          <div className="recipient-alert recipient-alert-success" role="status">
            <span aria-hidden="true">✓</span>
            <p>{success}</p>
            <button
              type="button"
              aria-label="Dismiss success message"
              onClick={() => setSuccess("")}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="recipient-alert recipient-alert-error" role="alert">
            <span aria-hidden="true">!</span>
            <p>{error}</p>
            <button
              type="button"
              aria-label="Dismiss error message"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        <section className="recipient-section recipient-profile">
          <div className="recipient-section-heading">
            <div>
              <h2>My Profile</h2>
              <p>Your registered recipient information.</p>
            </div>

            <div className="recipient-avatar" aria-hidden="true">
              {(user?.name || "R").trim().charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="recipient-profile-grid">
            <ProfileItem label="Full Name" value={user?.name} />
            <ProfileItem label="Email Address" value={user?.email} />
            <ProfileItem label="Blood Group" value={user?.bloodGroup} />
            <ProfileItem label="City" value={user?.city} />

            <div className="recipient-profile-item">
              <span className="recipient-field-label">Account Role</span>
              <strong>{user?.role || "recipient"}</strong>
            </div>

            <div className="recipient-profile-item">
              <span className="recipient-field-label">Verification</span>
              <span
                className={`recipient-badge ${
                  user?.isVerified
                    ? "recipient-badge-success"
                    : "recipient-badge-warning"
                }`}
              >
                {user?.isVerified ? "Verified" : "Not verified"}
              </span>
            </div>
          </div>
        </section>

        <section className="recipient-section recipient-notifications">
          <div className="recipient-section-heading recipient-notifications-heading">
            <div>
              <h2>Notifications</h2>
              <p>Updates about blood requests and donor activity.</p>
            </div>

            <div className="recipient-notification-actions">
              <span className="recipient-badge recipient-badge-neutral">
                {unreadCount} unread
              </span>

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="recipient-button recipient-button-outline"
                  onClick={handleMarkAllAsRead}
                  disabled={notificationActionLoading === "all"}
                >
                  {notificationActionLoading === "all"
                    ? "Updating..."
                    : "Mark all as read"}
                </button>
              )}
            </div>
          </div>

          {notificationsLoading ? (
            <LoadingState text="Loading notifications..." />
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications yet"
              text="Updates about your requests will appear here."
            />
          ) : (
            <div className="recipient-notification-list">
              {notifications.map((notification) => (
                <article
                  key={notification._id}
                  className={`recipient-notification ${
                    notification.isRead ? "" : "is-unread"
                  }`}
                >
                  <div className="recipient-notification-icon" aria-hidden="true">
                    {notification.isRead ? "✓" : "!"}
                  </div>

                  <div className="recipient-notification-content">
                    <div className="recipient-notification-title-row">
                      <h3>{getNotificationTitle(notification.type)}</h3>

                      {!notification.isRead && (
                        <span className="recipient-badge recipient-badge-danger">
                          New
                        </span>
                      )}
                    </div>

                    <p>{notification.message}</p>

                    {notification.bloodRequest && (
                      <p className="recipient-notification-meta">
                        {notification.bloodRequest.bloodGroup}
                        {" · "}
                        {notification.bloodRequest.city}
                        {" · "}
                        {notification.bloodRequest.hospital}
                      </p>
                    )}

                    <small>{formatDate(notification.createdAt)}</small>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      className="recipient-button recipient-button-small recipient-button-outline"
                      onClick={() => handleMarkAsRead(notification._id)}
                      disabled={
                        notificationActionLoading === notification._id
                      }
                    >
                      {notificationActionLoading === notification._id
                        ? "Updating..."
                        : "Mark as read"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="recipient-section">
          <div className="recipient-section-heading">
            <div>
              <h2>Create Blood Request</h2>
              <p>
                Enter the required details so matching donors can be notified.
              </p>
            </div>
          </div>

          <form className="recipient-request-form" onSubmit={handleSubmit}>
            <div className="recipient-form-grid">
              <div className="recipient-form-field">
                <label htmlFor="request-blood-group">Blood Group *</label>
                <select
                  id="request-blood-group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="recipient-form-field">
                <label htmlFor="request-city">City *</label>
                <input
                  id="request-city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>

              <div className="recipient-form-field">
                <label htmlFor="request-hospital">Hospital *</label>
                <input
                  id="request-hospital"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  placeholder="Enter hospital name"
                  minLength={2}
                  maxLength={150}
                  required
                />
              </div>

              <div className="recipient-form-field">
                <label htmlFor="request-units">Units Required *</label>
                <input
                  id="request-units"
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="recipient-form-field">
                <label htmlFor="request-urgency">Urgency</label>
                <select
                  id="request-urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="recipient-form-field recipient-form-field-wide">
                <label htmlFor="request-message">Additional Message</label>
                <textarea
                  id="request-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Add any important information (optional)"
                  rows={4}
                  maxLength={500}
                />
                <small>{formData.message.length}/500 characters</small>
              </div>
            </div>

            <button
              type="submit"
              className="recipient-button recipient-button-primary recipient-submit-button"
              disabled={creating}
            >
              {creating ? "Creating request..." : "Create Blood Request"}
            </button>
          </form>
        </section>

        <section className="recipient-section">
          <div className="recipient-section-heading">
            <div>
              <h2>My Blood Requests</h2>
              <p>Manage request status and review donor responses.</p>
            </div>

            <span className="recipient-badge recipient-badge-neutral">
              {requests.length} total
            </span>
          </div>

          {loading ? (
            <LoadingState text="Loading your blood requests..." />
          ) : requests.length === 0 ? (
            <EmptyState
              title="No blood requests yet"
              text="Your requests will appear here after you create one."
            />
          ) : (
            <div className="recipient-request-list">
              {requests.map((request) => (
                <article
                  key={request._id}
                  className="recipient-request-card"
                >
                  <div className="recipient-request-card-header">
                    <div className="recipient-request-title">
                      <span className="recipient-blood-icon" aria-hidden="true">
                        ♥
                      </span>

                      <div>
                        <h3>{request.bloodGroup} Blood Request</h3>
                        <p>Created {formatDate(request.createdAt)}</p>
                      </div>
                    </div>

                    <span
                      className={`recipient-badge recipient-badge-${request.status}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="recipient-request-details">
                    <ProfileItem label="City" value={request.city} />
                    <ProfileItem label="Hospital" value={request.hospital} />
                    <ProfileItem label="Units" value={request.units} />

                    <div className="recipient-profile-item">
                      <span className="recipient-field-label">Urgency</span>
                      <span
                        className={`recipient-badge recipient-badge-${request.urgency}`}
                      >
                        {request.urgency}
                      </span>
                    </div>

                    <ProfileItem
                      label="Donor Responses"
                      value={getNotificationCount(request)}
                    />
                  </div>

                  {request.message && (
                    <div className="recipient-request-message">
                      <strong>Additional message</strong>
                      <p>{request.message}</p>
                    </div>
                  )}

                  <div className="recipient-request-actions">
                    <div className="recipient-status-control">
                      <label htmlFor={`status-${request._id}`}>
                        Request status
                      </label>

                      <select
                        id={`status-${request._id}`}
                        value={request.status}
                        disabled={statusLoading === request._id}
                        onChange={(event) =>
                          handleStatusChange(request._id, event.target.value)
                        }
                      >
                        <option value="active">Active</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      className="recipient-button recipient-button-outline"
                      onClick={() => handleViewResponses(request._id)}
                      disabled={responsesLoading === request._id}
                    >
                      {responsesLoading === request._id
                        ? "Loading responses..."
                        : "View Donor Responses"}
                    </button>
                  </div>

                  {Object.prototype.hasOwnProperty.call(
                    responses,
                    request._id
                  ) && (
                    <div className="recipient-responses">
                      <h4>Donor Responses</h4>

                      {responses[request._id].length === 0 ? (
                        <p className="recipient-muted">
                          No donors have responded to this request yet.
                        </p>
                      ) : (
                        <div className="recipient-response-list">
                          {responses[request._id].map((response, index) => (
                            <div
                              className="recipient-response-card"
                              key={
                                response._id ||
                                `${request._id}-${index}`
                              }
                            >
                              <div>
                                <span className="recipient-field-label">
                                  Donor
                                </span>
                                <strong>
                                  {response.donor?.name || "Donor"}
                                </strong>
                              </div>

                              <div>
                                <span className="recipient-field-label">
                                  Blood Group
                                </span>
                                <strong>
                                  {response.donor?.bloodGroup || "N/A"}
                                </strong>
                              </div>

                              <div>
                                <span className="recipient-field-label">
                                  Response
                                </span>
                                <span
                                  className={`recipient-badge recipient-badge-${response.status}`}
                                >
                                  {response.status}
                                </span>
                              </div>

                              <div>
                                <span className="recipient-field-label">
                                  Responded
                                </span>
                                <strong>
                                  {formatDate(response.respondedAt)}
                                </strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="recipient-footer">
          <span>Blood Donation Finder</span>
          <span>Connecting recipients with potential donors</span>
        </footer>
      </main>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="recipient-profile-item">
      <span className="recipient-field-label">{label}</span>
      <strong>{value ?? "N/A"}</strong>
    </div>
  );
}

function LoadingState({ text }) {
  return (
    <div className="recipient-state">
      <span className="recipient-spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="recipient-state">
      <div className="recipient-empty-icon" aria-hidden="true">
        ♥
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default RecipientDashboard;
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function RecipientDashboard() {
  const { user, token, logout } = useAuth();

  // =========================
  // REQUEST STATES
  // =========================
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CREATE REQUEST STATES
  // =========================
  const [formData, setFormData] = useState({
    bloodGroup: "",
    city: user?.city || "",
    hospital: "",
    units: 1,
    urgency: "normal",
    message: "",
  });

  const [creating, setCreating] = useState(false);

  // =========================
  // RESPONSE STATES
  // =========================
  const [responses, setResponses] = useState({});
  const [responsesLoading, setResponsesLoading] = useState(null);

  // =========================
  // NOTIFICATION STATES
  // =========================
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState(true);

  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationActionLoading, setNotificationActionLoading] =
    useState(null);

  // =========================
  // GENERAL STATES
  // =========================
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH MY REQUESTS
  // =========================
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/requests/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Failed to fetch my requests:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your blood requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const response = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setNotificationsLoading(false);
    }
  };

  // =========================
  // FETCH UNREAD COUNT
  // =========================
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error(
        "Failed to fetch unread notification count:",
        error
      );
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (!token) {
      return;
    }

    fetchMyRequests();
    fetchNotifications();
    fetchUnreadCount();
  }, [token]);

  // =========================
  // KEEP CITY IN FORM IN SYNC
  // =========================
  useEffect(() => {
    if (user?.city) {
      setFormData((current) => ({
        ...current,
        city: user.city,
      }));
    }
  }, [user?.city]);

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // CREATE BLOOD REQUEST
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/requests",
        {
          ...formData,
          units: Number(formData.units),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data?.message ||
          "Blood request created successfully"
      );

      setFormData({
        bloodGroup: "",
        city: user?.city || "",
        hospital: "",
        units: 1,
        urgency: "normal",
        message: "",
      });

      await fetchMyRequests();
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error(
        "Create blood request failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create blood request"
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // UPDATE REQUEST STATUS
  // =========================
  const handleStatusChange = async (
    requestId,
    status
  ) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/requests/${requestId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        "Request status updated successfully"
      );

      await fetchMyRequests();
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error(
        "Request status update failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update request status"
      );
    }
  };

  // =========================
  // GET DONOR RESPONSES
  // =========================
  const handleViewResponses = async (requestId) => {
    try {
      setResponsesLoading(requestId);
      setError("");

      const response = await api.get(
        `/requests/${requestId}/responses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponses((current) => ({
        ...current,
        [requestId]: response.data.responses || [],
      }));
    } catch (error) {
      console.error(
        "Failed to fetch donor responses:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load donor responses"
      );
    } finally {
      setResponsesLoading(null);
    }
  };

  // =========================
  // MARK ONE NOTIFICATION READ
  // =========================
  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotificationActionLoading(notificationId);
      setError("");

      await api.patch(
        `/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((current) =>
        Math.max(current - 1, 0)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to mark notification as read"
      );
    } finally {
      setNotificationActionLoading(null);
    }
  };

  // =========================
  // MARK ALL NOTIFICATIONS READ
  // =========================
  const handleMarkAllAsRead = async () => {
    try {
      setNotificationActionLoading("all");
      setError("");

      await api.patch(
        "/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);

      setSuccess(
        "All notifications marked as read"
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    } finally {
      setNotificationActionLoading(null);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #ddd",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#e31b23",
            }}
          >
            Blood Donation Finder
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#666",
            }}
          >
            Recipient Dashboard
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <span>
            Welcome, <strong>{user?.name || "Recipient"}</strong>
          </span>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 18px",
              background: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
          }}
        >
          Recipient Dashboard
        </h1>

        <p
          style={{
            color: "#667085",
            marginBottom: "30px",
          }}
        >
          Create blood requests, track responses and stay
          updated with donor activity.
        </p>

        {/* =========================
            MESSAGES
        ========================= */}
        {success && (
          <div
            style={{
              background: "#ecfdf3",
              color: "#067647",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #abefc6",
            }}
          >
            {success}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fef3f2",
              color: "#b42318",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #fecdca",
            }}
          >
            {error}
          </div>
        )}

        {/* =========================
            PROFILE
        ========================= */}
        <section
          style={{
            background: "#ffffff",
            padding: "28px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #e4e7ec",
          }}
        >
          <h2>My Profile</h2>

          <p
            style={{
              color: "#667085",
            }}
          >
            Your registered recipient information
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <div>
              <small>Name</small>
              <p>
                <strong>{user?.name || "N/A"}</strong>
              </p>
            </div>

            <div>
              <small>Email</small>
              <p>
                <strong>{user?.email || "N/A"}</strong>
              </p>
            </div>

            <div>
              <small>Blood Group</small>
              <p>
                <strong>
                  {user?.bloodGroup || "N/A"}
                </strong>
              </p>
            </div>

            <div>
              <small>City</small>
              <p>
                <strong>{user?.city || "N/A"}</strong>
              </p>
            </div>

            <div>
              <small>Role</small>
              <p>
                <strong>
                  {user?.role || "recipient"}
                </strong>
              </p>
            </div>

            <div>
              <small>Verification</small>
              <p>
                <strong>
                  {user?.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            NOTIFICATIONS
        ========================= */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #e4e7ec",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "24px 28px",
              borderBottom: "1px solid #e4e7ec",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                Notifications
              </h2>

              <p
                style={{
                  color: "#667085",
                  marginBottom: 0,
                }}
              >
                Updates about your blood requests and
                donor responses
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "#fee4e2",
                    color: "#d92d20",
                    padding: "7px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {unreadCount} unread
                </span>
              )}

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={
                    notificationActionLoading === "all"
                  }
                  style={{
                    padding: "9px 14px",
                    background: "#ffffff",
                    border: "1px solid #cfd4dc",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {notificationActionLoading === "all"
                    ? "Updating..."
                    : "Mark all as read"}
                </button>
              )}
            </div>
          </div>

          {notificationsLoading ? (
            <div
              style={{
                padding: "28px",
              }}
            >
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div
              style={{
                padding: "28px",
                color: "#667085",
              }}
            >
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                style={{
                  padding: "20px 28px",
                  borderBottom: "1px solid #e4e7ec",
                  background: notification.isRead
                    ? "#ffffff"
                    : "#fff7f7",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>
                        {notification.type ===
                        "blood_request"
                          ? "New Blood Request"
                          : notification.type ===
                            "request_response"
                          ? "Request Response"
                          : notification.type ===
                            "request_status"
                          ? "Request Status Update"
                          : "System Notification"}
                      </strong>

                      {!notification.isRead && (
                        <span
                          style={{
                            background: "#e31b23",
                            color: "#ffffff",
                            padding: "3px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          New
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        margin: "0 0 8px",
                        color: "#475467",
                      }}
                    >
                      {notification.message}
                    </p>

                    {notification.bloodRequest && (
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: "14px",
                          color: "#667085",
                        }}
                      >
                        {notification.bloodRequest.bloodGroup}{" "}
                        •{" "}
                        {notification.bloodRequest.city}{" "}
                        •{" "}
                        {notification.bloodRequest.hospital}
                      </p>
                    )}

                    <small
                      style={{
                        color: "#98a2b3",
                      }}
                    >
                      {formatDate(
                        notification.createdAt
                      )}
                    </small>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        handleMarkAsRead(
                          notification._id
                        )
                      }
                      disabled={
                        notificationActionLoading ===
                        notification._id
                      }
                      style={{
                        alignSelf: "center",
                        border: "none",
                        background: "transparent",
                        color: "#d92d20",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {notificationActionLoading ===
                      notification._id
                        ? "Updating..."
                        : "Mark as read"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        {/* =========================
            CREATE REQUEST
        ========================= */}
        <section
          style={{
            background: "#ffffff",
            padding: "28px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #e4e7ec",
          }}
        >
          <h2>Create Blood Request</h2>

          <p
            style={{
              color: "#667085",
            }}
          >
            Submit a request and matching donors will be
            notified.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
                marginTop: "20px",
              }}
            >
              <div>
                <label>Blood Group</label>

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select blood group
                  </option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Hospital</label>

                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Units</label>

                <input
                  type="number"
                  name="units"
                  min="1"
                  value={formData.units}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Urgency</label>

                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="normal">
                    Normal
                  </option>
                  <option value="urgent">
                    Urgent
                  </option>
                </select>
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <label>Message</label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Additional information"
                  rows="4"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              style={{
                marginTop: "20px",
                padding: "12px 22px",
                background: "#e31b23",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: creating
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "600",
              }}
            >
              {creating
                ? "Creating..."
                : "Create Blood Request"}
            </button>
          </form>
        </section>

        {/* =========================
            MY REQUESTS
        ========================= */}
        <section
          style={{
            background: "#ffffff",
            padding: "28px",
            borderRadius: "12px",
            border: "1px solid #e4e7ec",
          }}
        >
          <h2>My Blood Requests</h2>

          <p
            style={{
              color: "#667085",
            }}
          >
            Track your requests and donor responses.
          </p>

          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p
              style={{
                color: "#667085",
              }}
            >
              You have not created any blood requests.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {requests.map((request) => (
                <div
                  key={request._id}
                  style={{
                    border: "1px solid #e4e7ec",
                    borderRadius: "10px",
                    padding: "22px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "18px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                      }}
                    >
                      {request.bloodGroup} Blood Request
                    </h3>

                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "15px",
                        background:
                          request.status === "active"
                            ? "#dcfae6"
                            : request.status ===
                              "fulfilled"
                            ? "#d1e9ff"
                            : "#f2f4f7",
                      }}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "15px",
                    }}
                  >
                    <p>
                      <strong>City:</strong>{" "}
                      {request.city}
                    </p>

                    <p>
                      <strong>Hospital:</strong>{" "}
                      {request.hospital}
                    </p>

                    <p>
                      <strong>Units:</strong>{" "}
                      {request.units}
                    </p>

                    <p>
                      <strong>Urgency:</strong>{" "}
                      {request.urgency}
                    </p>
                  </div>

                  {request.message && (
                    <p>
                      <strong>Message:</strong>{" "}
                      {request.message}
                    </p>
                  )}

                  {/* STATUS */}
                  <div
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    <label>
                      <strong>
                        Update Status:
                      </strong>
                    </label>{" "}

                    <select
                      value={request.status}
                      onChange={(e) =>
                        handleStatusChange(
                          request._id,
                          e.target.value
                        )
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="active">
                        Active
                      </option>

                      <option value="fulfilled">
                        Fulfilled
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                  {/* RESPONSES BUTTON */}
                  <button
                    onClick={() =>
                      handleViewResponses(
                        request._id
                      )
                    }
                    disabled={
                      responsesLoading === request._id
                    }
                    style={{
                      marginTop: "15px",
                      padding: "9px 15px",
                      background: "#ffffff",
                      border: "1px solid #cfd4dc",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {responsesLoading === request._id
                      ? "Loading..."
                      : "View Donor Responses"}
                  </button>

                  {/* DONOR RESPONSES */}
                  {responses[request._id] && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "18px",
                        background: "#f9fafb",
                        borderRadius: "8px",
                      }}
                    >
                      <h4>
                        Donor Responses
                      </h4>

                      {responses[request._id].length ===
                      0 ? (
                        <p>
                          No donors have responded yet.
                        </p>
                      ) : (
                        responses[request._id].map(
                          (response) => (
                            <div
                              key={response._id}
                              style={{
                                background:
                                  "#ffffff",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "7px",
                                border:
                                  "1px solid #e4e7ec",
                              }}
                            >
                              <p>
                                <strong>
                                  Donor:
                                </strong>{" "}
                                {response.donor?.name ||
                                  "N/A"}
                              </p>

                              <p>
                                <strong>
                                  Email:
                                </strong>{" "}
                                {response.donor?.email ||
                                  "N/A"}
                              </p>

                              <p>
                                <strong>
                                  Blood Group:
                                </strong>{" "}
                                {response.donor
                                  ?.bloodGroup ||
                                  "N/A"}
                              </p>

                              <p>
                                <strong>
                                  Response:
                                </strong>{" "}
                                {response.status}
                              </p>
                            </div>
                          )
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// =========================
// COMMON INPUT STYLE
// =========================
const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  marginTop: "7px",
  border: "1px solid #cfd4dc",
  borderRadius: "6px",
  fontSize: "14px",
};

export default RecipientDashboard;
# API Documentation — Blood Donation Finder

## 1. Overview

The backend exposes REST APIs using Express.js. The APIs handle authentication, user management, donor operations, blood requests, notifications, and administration.

**Base URL (local development):** `http://localhost:5000`

> Protected endpoints require a JWT access token in the `Authorization` header.

## 2. Authentication APIs

Base route: `/api/auth`

### 2.1 Register User

- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Authentication:** Not required
- **Purpose:** Registers a new user.

### 2.2 Login User

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Authentication:** Not required
- **Purpose:** Authenticates a user using login credentials.

### 2.3 Create Administrator

- **Method:** `POST`
- **Endpoint:** `/api/auth/create-admin`
- **Authentication:** Required
- **Authorization:** Administrator only
- **Purpose:** Creates an administrator account. The request passes through the JWT authentication middleware and administrator middleware before reaching the controller.

**Authorization header:**

```http
Authorization: Bearer <JWT_TOKEN>
```

## 3. Authentication Middleware

The authentication routes use the following middleware:

| Middleware | Responsibility |
|---|---|
| `protect` | Verifies the JWT token and identifies the authenticated user |
| `admin` | Checks whether the authenticated user has administrator privileges |

## 4. Additional API Documentation

The donor, blood request, notification, and administration endpoints will be documented after reviewing their respective route files.

## 5. Donor APIs

Base route: `/api/donors`

### 5.1 Search Donors

- **Method:** `GET`
- **Endpoint:** `/api/donors/search`
- **Authentication:** Not required by the route definition
- **Purpose:** Searches for donors matching the supplied search criteria.

The supported query parameters and filtering behavior should be confirmed from `donorController.js`.

### 5.2 Update Donor Availability

- **Method:** `PATCH`
- **Endpoint:** `/api/donors/availability`
- **Authentication:** Required
- **Authorization:** Donor role required
- **Purpose:** Updates the authenticated donor's availability.

**Authorization header:**

```http
Authorization: Bearer <JWT_TOKEN>
```

The endpoint uses the `protect` middleware to authenticate the user and `roleMiddleware("donor")` to restrict access to donors.

## 6. Blood Request APIs

Base route: `/api/requests`

### 6.1 Create Blood Request

- **Method:** `POST`
- **Endpoint:** `/api/requests`
- **Authentication:** Required
- **Authorization:** Recipient role
- **Purpose:** Creates a new blood request.

### 6.2 Get Active Blood Requests

- **Method:** `GET`
- **Endpoint:** `/api/requests`
- **Authentication:** Required
- **Authorization:** Donor role
- **Purpose:** Retrieves active blood requests available to donors.

### 6.3 Get My Blood Requests

- **Method:** `GET`
- **Endpoint:** `/api/requests/my`
- **Authentication:** Required
- **Purpose:** Retrieves the authenticated user's blood requests. Confirm the exact ownership and role behavior in the controller.

### 6.4 Get Responses for a Blood Request

- **Method:** `GET`
- **Endpoint:** `/api/requests/:id/responses`
- **Authentication:** Required
- **Authorization:** Recipient role
- **Purpose:** Retrieves donor responses for a specific blood request.

Replace `:id` with the blood request's ID.

### 6.5 Update Blood Request Status

- **Method:** `PATCH`
- **Endpoint:** `/api/requests/:id/status`
- **Authentication:** Required
- **Authorization:** Recipient role
- **Purpose:** Updates the status of a specific blood request.

### 6.6 Respond to a Blood Request

- **Method:** `PATCH`
- **Endpoint:** `/api/requests/:id/respond`
- **Authentication:** Required
- **Authorization:** Donor role
- **Purpose:** Allows a donor to respond to a blood request, such as accepting or declining it.

## Authentication Header

Protected endpoints use a JWT bearer token:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Route-Level Authorization Summary

| Operation | Required role |
|---|---|
| Create blood request | Recipient |
| Get active requests | Donor |
| Get own requests | Authenticated user; controller behavior must be verified |
| Get request responses | Recipient |
| Update request status | Recipient |
| Respond to request | Donor |

## 7. Notification APIs

Base route: `/api/notifications`

All notification endpoints require authentication through the `protect` middleware.

### 7.1 Get My Notifications

- **Method:** `GET`
- **Endpoint:** `/api/notifications`
- **Authentication:** Required
- **Purpose:** Retrieves notifications for the authenticated user.

### 7.2 Get Unread Notification Count

- **Method:** `GET`
- **Endpoint:** `/api/notifications/unread-count`
- **Authentication:** Required
- **Purpose:** Retrieves the number of unread notifications for the authenticated user.

### 7.3 Mark All Notifications as Read

- **Method:** `PATCH`
- **Endpoint:** `/api/notifications/read-all`
- **Authentication:** Required
- **Purpose:** Marks all notifications belonging to the authenticated user as read.

### 7.4 Mark One Notification as Read

- **Method:** `PATCH`
- **Endpoint:** `/api/notifications/:id/read`
- **Authentication:** Required
- **Purpose:** Marks a specific notification as read.

Replace `:id` with the notification's ID.

### Authorization Header

Include the JWT bearer token in protected requests:

```http
Authorization: Bearer <JWT_TOKEN>
```

## 8. Admin APIs

Base route: `/api/admin`

**Authentication:** All endpoints require a valid JWT token and administrator authorization through the `protect` and `adminMiddleware` middleware.

### 8.1 Get All Blood Requests

- **Method:** `GET`
- **Endpoint:** `/api/admin/requests`
- **Purpose:** Retrieves blood requests for administrative management.

### 8.2 Get All Donors

- **Method:** `GET`
- **Endpoint:** `/api/admin/donors`
- **Purpose:** Retrieves donor records for administration.

### 8.3 Verify or Unverify a Donor

- **Method:** `PATCH`
- **Endpoint:** `/api/admin/donors/:userId/verification`
- **Purpose:** Updates a donor's verification status.

Replace `:userId` with the donor's user ID.

### 8.4 Update Blood Request Status

- **Method:** `PATCH`
- **Endpoint:** `/api/admin/requests/:id/status`
- **Purpose:** Updates the status of a blood request.

Replace `:id` with the blood request ID.

### 8.5 Get All Requesters

- **Method:** `GET`
- **Endpoint:** `/api/admin/requesters`
- **Purpose:** Retrieves requester records for administration.

### 8.6 Verify or Unverify a Requester

- **Method:** `PATCH`
- **Endpoint:** `/api/admin/requesters/:userId/verification`
- **Purpose:** Updates a requester's verification status.

Replace `:userId` with the requester's user ID.

### 8.7 Get Admin Dashboard Statistics

- **Method:** `GET`
- **Endpoint:** `/api/admin/stats`
- **Purpose:** Retrieves statistics for the admin dashboard.

### 8.8 Get Activity Logs

- **Method:** `GET`
- **Endpoint:** `/api/admin/activity-logs`
- **Purpose:** Retrieves administrative activity logs.

## 9. General and Testing Endpoints

### 9.1 API Health Check

- **Method:** `GET`
- **Endpoint:** `/`
- **Authentication:** Not required
- **Purpose:** Confirms that the backend API server is running.

### 9.2 JWT Authentication Test

- **Method:** `GET`
- **Endpoint:** `/api/protected`
- **Authentication:** Required
- **Purpose:** Verifies JWT authentication and returns the authenticated user's information.

### Example Authorization Header

```http
Authorization: Bearer <JWT_TOKEN>
```

## 10. API Route Summary

| Module | Base Route | Description |
|---|---|---|
| Authentication | `/api/auth` | Registration, login, admin creation |
| Donors | `/api/donors` | Donor search and availability |
| Blood Requests | `/api/requests` | Request creation, responses, status management |
| Notifications | `/api/notifications` | Notifications and read status |
| Administration | `/api/admin` | Verification, request management, statistics, activity logs |
| Health Check | `/` | Backend status |
| Authentication Test | `/api/protected` | JWT verification |

## 11. Common API Conventions

- **Data format:** JSON, supported by Express JSON middleware.
- **Authentication:** Protected routes require a valid JWT bearer token.
- **Authorization:** Role-specific routes use role middleware or administrator middleware.
- **HTTP methods:** `GET` retrieves data, `POST` creates resources, and `PATCH` updates resources.
- **Base URL (local):** `http://localhost:5000`
- **Base URL (deployed):** `https://blood-donation-finder-d42e.onrender.com`


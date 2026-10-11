# System Architecture — Blood Donation Finder

## 1. Overview

Blood Donation Finder follows a client-server architecture based on the MERN stack. The React frontend communicates with the Node.js and Express.js backend through REST APIs. MongoDB stores application data.

## 2. Architecture Diagram

```text
                  ┌─────────────────────────┐
                  │        Users            │
                  │ Donor / Recipient / Admin│
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    React Frontend       │
                  │ Pages, Components,      │
                  │ Context, API Services   │
                  └────────────┬────────────┘
                               │ HTTP Requests
                               │ JSON / JWT
                               ▼
                  ┌─────────────────────────┐
                  │   Express.js Backend    │
                  │ REST API Routes         │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Controllers & Middleware│
                  │ Authentication, Roles,  │
                  │ Business Logic          │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    Mongoose Models      │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │       MongoDB           │
                  │ Application Data        │
                  └─────────────────────────┘
```

## 3. Frontend Layer

The frontend is built with React.js and provides the user interface for donors, recipients, and administrators.

Its main responsibilities include:

- Rendering pages and reusable UI components.
- Handling forms and user interactions.
- Managing authentication state through React Context.
- Sending HTTP requests through the API service.
- Displaying API responses and notifications.

## 4. Backend Layer

The backend uses Node.js and Express.js to expose REST API endpoints.

Its responsibilities include:

- Processing incoming HTTP requests.
- Validating authentication and user permissions.
- Executing application business logic.
- Reading and updating MongoDB records.
- Returning JSON responses to the frontend.

## 5. Authentication and Authorization

JWT-based authentication is used to identify authenticated users.

The typical authentication flow is:

1. A user submits login credentials.
2. The backend validates the credentials.
3. The backend issues a JWT after successful authentication.
4. The frontend uses the token when making protected API requests.
5. Authentication middleware verifies the token.
6. Role-based middleware restricts access to authorized operations.

Administrators also have access to administrative operations protected by the backend.

## 6. Database Layer

MongoDB stores application data, while Mongoose provides schemas and models for interacting with the database.

The identified models include:

- `User`
- `BloodRequest`
- `Notification`
- `ActivityLog`

## 7. Main Backend Components

| Component | Responsibility |
|---|---|
| Routes | Define API endpoints |
| Controllers | Process requests and implement business logic |
| Middleware | Handle authentication and authorization |
| Models | Define database schemas and data operations |
| Database configuration | Establish the MongoDB connection |

## 8. Main Request Flow

1. A user performs an action in the React frontend.
2. The frontend sends an HTTP request to the relevant API endpoint.
3. Express routes the request to the appropriate controller.
4. Middleware verifies authentication and permissions where required.
5. The controller interacts with the database through Mongoose models.
6. The backend returns a JSON response.
7. The frontend updates the displayed information.

## 9. Security Considerations

- Store passwords as hashes rather than plain text.
- Protect sensitive API endpoints with authentication middleware.
- Enforce role-based authorization on the backend.
- Keep JWT secrets and database credentials in environment variables.
- Never commit real environment secrets to the repository.
- Validate user input before processing requests.


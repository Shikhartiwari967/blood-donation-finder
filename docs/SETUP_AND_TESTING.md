# Setup and Testing Guide — Blood Donation Finder

## 1. Prerequisites

Install the following tools before running the project:

- Node.js and npm
- Git
- MongoDB Atlas account or a local MongoDB instance
- Code editor such as Visual Studio Code
- Web browser

## 2. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Shikhartiwari967/blood-donation-finder.git
cd blood-donation-finder
```

### Start the Backend

For development with automatic restarts:

```bash
npm run dev
```

For normal execution:

```bash
npm start
```

Both commands must be run from the `backend` directory.



## 4. Frontend Setup

Open a second terminal from the project root:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, commonly `http://localhost:5173`.

The frontend's API base URL must point to the backend instance you intend to use. For local development, configure it to use your local backend if your API service supports environment-based configuration.

## 5. Functional Testing Checklist

### Authentication

- [ ] Register a new donor account.
- [ ] Register a recipient account.
- [ ] Log in with valid credentials.
- [ ] Verify that invalid credentials are rejected.
- [ ] Confirm that protected pages require authentication.
- [ ] Confirm that users can access only the features permitted for their roles.

### Donor Features

- [ ] Search for donors by blood group and city.
- [ ] Change donor availability.
- [ ] Refresh the page and verify that availability persists.
- [ ] View active blood requests.
- [ ] Accept or decline a blood request.

### Recipient Features

- [ ] Create a blood request with valid information.
- [ ] Verify that invalid request data is rejected.
- [ ] View the recipient's own requests.
- [ ] View donor responses to a request.
- [ ] Update a request's status.
- [ ] Receive notifications when relevant request events occur.

### Notifications

- [ ] View notifications.
- [ ] Check the unread notification count.
- [ ] Mark an individual notification as read.
- [ ] Mark all notifications as read.
- [ ] Refresh the page and verify that read status persists.

### Administrator Features

- [ ] Access the administrator dashboard with an authorized account.
- [ ] View donors and requesters.
- [ ] Verify and unverify users.
- [ ] View and manage blood requests.
- [ ] View dashboard statistics.
- [ ] View activity logs.
- [ ] Confirm that non-admin users cannot access administrator endpoints.

### Responsive UI

- [ ] Test the home page on desktop and mobile screen sizes.
- [ ] Test navigation menu open and close behavior on mobile.
- [ ] Test login and registration forms on mobile.
- [ ] Test donor search results and dashboard layouts.
- [ ] Confirm that forms, tables, and cards do not overflow the viewport.

## 6. API Testing

Protected API endpoints require a valid JWT bearer token:

```http
Authorization: Bearer <JWT_TOKEN>
```

Use the browser or an API client to test the API endpoints documented in `API_DOCUMENTATION.md`.

Verify successful responses, validation failures, authentication failures, and authorization restrictions.

## 7. Troubleshooting

### MongoDB Connection Failure

- Verify the MongoDB connection string.
- Confirm that the environment variable name matches the backend configuration.
- Check database network access settings if using MongoDB Atlas.
- Confirm that the database credentials are valid.

### Frontend Cannot Reach Backend

- Confirm that the backend is running.
- Verify the API base URL in the frontend configuration.
- Check browser developer tools for network errors.
- Check backend CORS configuration.

### Authentication Problems

- Confirm that the JWT secret is configured.
- Log in again if the token is missing or expired.
- Verify that protected requests include the bearer token.

### Frontend Route Returns 404 After Refresh

- Confirm that the hosting provider is configured to serve the frontend application's `index.html` for client-side routes.

## 8. Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Production environment variables and URLs should be configured in the relevant hosting dashboards. Never include production secrets in this document.

## 9. Testing Status

Use the functional testing checklist to record completed tests. Mark an item as complete only after verifying it against the running application.


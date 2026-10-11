# Blood Donation Finder

A MERN-based full-stack web application that connects blood donors with people who need blood. The platform streamlines donor discovery, blood-request management, and communication between donors and recipients.

## Live Demo

- **Frontend:** [Blood Donation Finder](https://blood-donation-finder-alpha.vercel.app)
- **Backend API:** [API Health Check](https://blood-donation-finder-d42e.onrender.com)

## Tech Stack

- **MongoDB** — Database
- **Express.js** — Backend framework
- **React.js** — Frontend library
- **Node.js** — Runtime environment
- **JWT Authentication** — Authentication
- **REST APIs** — Client-server communication

## Key Features

- User registration and login
- Role-based workflows for donors, recipients, and administrators
- Donor search by blood group and city
- Donor availability management
- Blood request creation and management
- Donor responses to blood requests
- Notifications for request updates and donor activity
- Admin dashboard for user verification and request management
- Administrative activity logs

## Documentation

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Setup and Testing Guide](docs/SETUP_AND_TESTING.md)

## Local Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Shikhartiwari967/blood-donation-finder.git
cd blood-donation-finder
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file with your own configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

Ensure the frontend API configuration points to the backend instance you want to use.

## Project Structure

```text
blood-donation-finder/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── server.js
├── frontend/
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── SETUP_AND_TESTING.md
└── README.md
```

## Project Status

**Under Development** — Features and improvements may continue to evolve.


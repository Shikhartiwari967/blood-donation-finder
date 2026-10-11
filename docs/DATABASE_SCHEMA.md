# Database Schema — Blood Donation Finder

## 1. Overview

The application uses MongoDB as its database and Mongoose to define schemas, validate documents, and interact with collections.

## 2. User Model

**Model:** `User`

**Collection:** `users` (Mongoose's default collection name)

The User model stores donor, recipient, and administrator account information.

### Fields

| Field | Data Type | Required | Default / Constraints |
|---|---|---|---|
| `name` | String | Yes | Trimmed; 2–50 characters |
| `email` | String | Yes | Unique, lowercase, trimmed; email pattern validation |
| `password` | String | Yes | Minimum 6 characters |
| `bloodGroup` | String | Yes | Must be a supported blood group |
| `phone` | String | Yes | Must contain exactly 10 digits |
| `city` | String | Yes | Trimmed; 2–100 characters |
| `role` | String | No | `donor`, `recipient`, or `admin`; default: `donor` |
| `isAvailable` | Boolean | No | Default: `true` |
| `isVerified` | Boolean | No | Default: `false` |
| `createdAt` | Date | Automatic | Added by Mongoose timestamps |
| `updatedAt` | Date | Automatic | Added by Mongoose timestamps |

### Supported Blood Groups

- `A+`
- `A-`
- `B+`
- `B-`
- `AB+`
- `AB-`
- `O+`
- `O-`

### Role Types

| Role | Purpose |
|---|---|
| `donor` | Can manage availability and respond to blood requests |
| `recipient` | Can create and manage blood requests |
| `admin` | Can access administrative features |

### Validation and Constraints

- User names must contain between 2 and 50 characters.
- Email addresses must be unique and are converted to lowercase.
- Phone numbers must contain exactly 10 numeric digits.
- Blood groups and roles are restricted to the defined enum values.
- New users default to the `donor` role, available status, and unverified status.
- Mongoose automatically maintains `createdAt` and `updatedAt` timestamps.

## 3. BloodRequest Model

**Model:** `BloodRequest`

**Collection:** `bloodrequests` (Mongoose's default collection name)

The BloodRequest model stores blood requests created by recipients, including urgency, request status, and donor responses.

### Fields

| Field | Data Type | Required | Default / Constraints |
|---|---|---|---|
| `requester` | ObjectId | Yes | References the `User` model |
| `bloodGroup` | String | Yes | Must be one of the eight supported blood groups |
| `city` | String | Yes | Trimmed; 2–100 characters |
| `hospital` | String | Yes | Trimmed; 2–150 characters |
| `units` | Number | Yes | Minimum 1; must be a whole number |
| `urgency` | String | No | `normal`, `urgent`, or `critical`; default: `normal` |
| `message` | String | No | Trimmed; maximum 500 characters |
| `status` | String | No | `active`, `fulfilled`, or `cancelled`; default: `active` |
| `donorResponses` | Array | No | Stores donor responses to the request |
| `createdAt` | Date | Automatic | Added by Mongoose timestamps |
| `updatedAt` | Date | Automatic | Added by Mongoose timestamps |

### Donor Response Subdocument

Each entry in `donorResponses` represents one donor's response to a blood request.

| Field | Data Type | Required | Default / Constraints |
|---|---|---|---|
| `donor` | ObjectId | Yes | References the `User` model |
| `status` | String | Yes | Must be `accepted` or `declined` |
| `respondedAt` | Date | No | Defaults to the current date and time |

### Relationships

- **Requester → User:** The `requester` field references the user who created the blood request.
- **Donor Responses → User:** Each response references a donor through the `donor` field.
- **BloodRequest → DonorResponses:** One blood request can store multiple donor responses.

### Validation Rules

- Blood group must be one of `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, or `O-`.
- City must contain 2–100 characters after trimming.
- Hospital name must contain 2–150 characters after trimming.
- Units must be a whole number greater than or equal to 1.
- Urgency must be `normal`, `urgent`, or `critical`.
- Request status must be `active`, `fulfilled`, or `cancelled`.
- Optional messages cannot exceed 500 characters.
- Donor response status must be `accepted` or `declined`.

## 4. Notification Model

**Model:** `Notification`

**Collection:** `notifications` (Mongoose's default collection name)

The Notification model stores messages for users about blood requests, donor responses, request status changes, and system events.

### Fields

| Field | Data Type | Required | Default / Constraints |
|---|---|---|---|
| `recipient` | ObjectId | Yes | References the `User` model |
| `type` | String | Yes | `blood_request`, `request_response`, `request_status`, or `system` |
| `message` | String | Yes | Trimmed; maximum 300 characters |
| `bloodRequest` | ObjectId | No | References `BloodRequest`; defaults to `null` |
| `isRead` | Boolean | No | Defaults to `false` |
| `createdAt` | Date | Automatic | Added by Mongoose timestamps |
| `updatedAt` | Date | Automatic | Added by Mongoose timestamps |

### Notification Types

| Type | Purpose |
|---|---|
| `blood_request` | Notification related to a blood request |
| `request_response` | Notification related to a donor's response |
| `request_status` | Notification related to a request status update |
| `system` | General system notification |

### Relationships

- **Recipient → User:** The `recipient` field identifies the user who receives the notification.
- **BloodRequest → BloodRequest:** The optional `bloodRequest` field links the notification to a related blood request.
- A notification can exist without a linked blood request because `bloodRequest` defaults to `null`.

### Validation Rules

- Recipient is required and references a user.
- Notification type must match one of the four allowed values.
- Message is required, trimmed, and limited to 300 characters.
- `isRead` defaults to `false`.
- Mongoose automatically maintains creation and update timestamps.

## 5. ActivityLog Model

**Model:** `ActivityLog`

**Collection:** `activitylogs` (Mongoose's default collection name)

The ActivityLog model records actions performed by users and identifies the resources affected by those actions. It supports administrative activity tracking.

### Fields

| Field | Data Type | Required | Default / Constraints |
|---|---|---|---|
| `actor` | ObjectId | Yes | References the `User` model |
| `action` | String | Yes | Required and trimmed |
| `targetType` | String | Yes | `User`, `BloodRequest`, or `Notification` |
| `targetId` | ObjectId | Yes | ID of the affected resource |
| `details` | String | No | Trimmed; maximum 500 characters |
| `createdAt` | Date | Automatic | Added by Mongoose timestamps |
| `updatedAt` | Date | Automatic | Added by Mongoose timestamps |

### Relationships

- **Actor → User:** The `actor` field references the user who performed the action.
- **Target resource:** `targetType` identifies the resource model, while `targetId` stores the corresponding document ID.
- Supported target types are `User`, `BloodRequest`, and `Notification`.

**Note:** `targetId` is a plain ObjectId field, not a Mongoose `ref`. The application uses `targetType` to identify the referenced resource type.

### Validation Rules

- Actor is required and references a user.
- Action is required and trimmed.
- Target type must be one of the three permitted values.
- Target ID is required.
- Details are optional, trimmed, and limited to 500 characters.
- Mongoose automatically maintains creation and update timestamps.

## 6. Model Relationship Summary

| Model | Relationship | Related Model |
|---|---|---|
| `User` | Referenced by requester | `BloodRequest` |
| `User` | Referenced by donor responses | `BloodRequest` |
| `User` | Receives notifications | `Notification` |
| `User` | Performs logged actions | `ActivityLog` |
| `BloodRequest` | Referenced by notifications | `Notification` |
| `User`, `BloodRequest`, `Notification` | Can be logged as targets | `ActivityLog` |

## 7. Database Design Notes

- MongoDB stores application records as documents in collections.
- Mongoose schemas define field types, required fields, enum restrictions, and validation rules.
- ObjectId references connect related documents across collections.
- The `timestamps: true` option automatically adds `createdAt` and `updatedAt` to all four documented models.
- The `ActivityLog` model supports polymorphic target identification through `targetType` and `targetId`.


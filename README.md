# LeadFlow

LeadFlow is a full-stack lead management application built with TypeScript. The backend is implemented and working against MongoDB, while the frontend is currently a minimal React + Vite starter and has not yet been turned into the full lead management UI.

---

# Project Status

## Current state

The project is in active development, but the current implementation status is:

- Backend API: completed and functional
- Database layer: completed with MongoDB + Mongoose
- Frontend: scaffolded but not feature-complete
- Automated backend tests: not started
- Frontend UI and API integration: not started
- Deployment: not configured

## Phase overview

| Phase | Status |
| --- | --- |
| Project initialization | ✅ Completed |
| Backend API & data layer | ✅ Completed |
| Backend business logic | ✅ Completed |
| Backend testing | ⏳ Not started |
| Frontend foundation | ✅ Scaffolded |
| Frontend feature implementation | ⏳ Not started |
| Frontend API integration | ⏳ Not started |
| Testing & polish | ⏳ Not started |
| Deployment | ⏳ Not started |
| Documentation | ✅ Updated |

---

# Features

## Implemented in the codebase

- Create a lead
- List leads with pagination
- Search leads by name, email, phone, or status
- Update a lead's status
- Delete a lead
- MongoDB connection and Mongoose model
- Request validation with `express-validator`
- Centralized application error handling
- `AppError` utility for expected errors
- `asyncHandler` wrapper for controllers
- Health-check endpoint at `/health`
- CORS and JSON parsing
- Environment-based configuration

## Not yet implemented

- Frontend lead list screen
- Lead creation form
- Search input on the UI
- Pagination UI
- Status update controls
- Loading, empty, and error state UI
- Automated tests
- Deployment configuration

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- dotenv
- CORS
- express-validator

## Planned testing tools

- Vitest
- Supertest
- React Testing Library

---

# Project Structure

```text
leadflow/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── db/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   └── leads.controllers.ts
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── models/
│   │   │   └── lead.model.ts
│   │   ├── routes/
│   │   │   └── leads.routes.ts
│   │   ├── types/
│   │   │   ├── error.types.ts
│   │   │   └── lead.types.ts
│   │   ├── utils/
│   │   │   ├── AppError.ts
│   │   │   └── AsyncHandler.ts
│   │   └── validator/
│   │       └── lead.validator.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── index.html
├── .gitignore
├── AGENT.md
├── README.md
└── package-lock.json
```

---

# Backend API

The backend exposes the following routes:

## Health

- `GET /health`
 - Returns service health status

## Leads

- `POST /api/leads`
 - Create a lead
- `GET /api/leads?search=&page=&limit=`
 - List leads with optional search and pagination
- `PATCH /api/leads/:id`
 - Update the lead status
- `DELETE /api/leads/:id`
 - Delete a lead

### Lead status values

- `new`
- `contacted`
- `qualified`
- `lost`

### Validation rules

- `name`: required, trimmed, 2-100 chars
- `email`: required, valid email format
- `phone`: required, 10 digits
- `status`: required on update, must be one of the valid enum values

---

# Backend Architecture

The backend is organized as a simple layered Express app:

```text
Request
 ↓
Routes
 ↓
Validation middleware
 ↓
asyncHandler
 ↓
Controller
 ↓
Mongoose model
 ↓
MongoDB
```

Errors flow through a centralized app-level handler:

```text
Controller / middleware error
 ↓
next(error)
 ↓
errorHandler
 ↓
JSON HTTP error response
```

Key implementation patterns:

- Routes stay thin and delegate to controllers.
- Validation belongs in the validator layer.
- Business logic is kept inside controller functions.
- Expected application errors are created with `AppError`.
- `asyncHandler` prevents repeated try/catch boilerplate.

---

# Local Development

## Backend

```bash
cd backend
npm install
npm run dev
```

Set a `MONGO_URI` in a local `.env` file before starting the backend.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Notes for Contributors

- Do not put business logic in the route files.
- Keep validation in the validator layer.
- Use the existing `AppError` and `asyncHandler` patterns.
- Keep the frontend work separate from backend implementation until the backend API is stable.
- Update documentation when new features or architecture changes are introduced.
```

---

# Routes

Routes define HTTP endpoints and connect them to validation middleware and controllers.

Routes should remain focused on request flow and should not contain business logic.

Example:

```text
POST /api/leads

      ↓

createLeadValidator

      ↓

handleValidationErrors

      ↓

asyncHandler

      ↓

createLead()
```

---

# Validation

LeadFlow uses `express-validator` for request-level validation.

Validation happens before the controller performs database operations.

The validation flow is:

```text
Request
   ↓
Validator
   ↓
Validation middleware
   ↓
Controller
```

## Create Lead Validation

The create-lead request validates:

- `name`
- `email`
- `phone`
- `status`

The following rules are applied:

### Name

- Required
- Trimmed
- Between 2 and 100 characters

### Email

- Required
- Trimmed
- Must be a valid email
- Normalized using `normalizeEmail()`

### Phone

- Required
- Trimmed
- Must contain exactly 10 digits

### Status

If provided, it must be one of:

```text
new
contacted
qualified
lost
```

## Update Lead Status Validation

The update-status request validates the `status` field.

Allowed values:

```text
new
contacted
qualified
lost
```

---

# Controllers

Controllers contain the request/response and business logic for each endpoint.

Current controller functions:

- `createLead()`
- `getLeads()`
- `updateLeadStatus()`
- `deleteLead()`

Controllers use `async/await`.

Asynchronous errors are forwarded to the centralized error handler through `asyncHandler`.

Controllers therefore do not need repetitive `try/catch` blocks for every request.

---

# `asyncHandler`

The `asyncHandler` utility wraps asynchronous controllers.

Its purpose is to forward rejected promises to Express's centralized error middleware.

The request flow is:

```text
Async Controller
      │
      ▼
 asyncHandler
      │
      ├── Success → Controller response
      │
      └── Error → next(error)
                     │
                     ▼
               errorHandler
```

This keeps controller code focused on application logic instead of repeating error-catching boilerplate.

---

# `AppError`

`AppError` is a functional utility used to create application-level errors.

Example:

```ts
throw AppError("Lead not found", 404);
```

Application errors contain:

- Error message
- HTTP status code
- `isOperational` flag

This allows the centralized error middleware to distinguish expected application errors from unexpected server errors.

---

# Error Handling

LeadFlow uses centralized error handling.

The error-handling middleware is registered after the application routes.

```text
Request
   ↓
Routes
   ↓
Middleware
   ↓
Controller
   ↓
Error
   ↓
errorHandler
   ↓
Consistent JSON response
```

The centralized error handler currently handles:

- `AppError`
- Express-validator validation errors
- Mongoose validation errors
- MongoDB duplicate-key errors
- Invalid MongoDB ObjectId errors
- Unexpected errors

Unexpected errors return a generic internal-server-error response instead of exposing internal implementation details.

---

# API Error Response

API errors use a consistent response structure.

Example:

```json
{
  "success": false,
  "message": "Lead not found"
}
```

Validation errors include field-level information:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

This provides a predictable structure for API consumers and will also make frontend error handling easier.

---

# Logging

The backend currently logs important server-side errors and startup/database connection information using `console`.

Examples include:

```text
MongoDB connected successfully
```

and server startup information:

```text
LeadFlow API running on port 5000
```

Errors are logged by the centralized error middleware.

A more structured logging system can be introduced later if required.

---

# Models

Mongoose models define the structure of documents stored in MongoDB.

The current application contains one model:

```text
Lead
```

---

# Database

The database module is responsible for establishing the MongoDB connection before the server starts.

The server follows this startup flow:

```text
server.ts
   │
   ▼
dotenv.config()
   │
   ▼
connectDB()
   │
   ├── Success
   │      ↓
   │   app.listen()
   │
   └── Failure
          ↓
      Exit process
```

The application does not start listening for HTTP requests until the MongoDB connection succeeds.

---

# Lead Model

## `src/models/lead.model.ts`

This file defines the Lead Mongoose schema and model.

## Lead Fields

| Field       | Type   | Required  | Description           |
| ----------- | ------ | --------- | --------------------- |
| `name`      | String | Yes       | Lead name             |
| `email`     | String | Yes       | Lead email            |
| `phone`     | String | Yes       | Lead phone number     |
| `status`    | String | No        | Current lead status   |
| `createdAt` | Date   | Automatic | Creation timestamp    |
| `updatedAt` | Date   | Automatic | Last update timestamp |

---

# Name Validation

The name:

- is required
- is trimmed
- must contain at least 2 characters
- cannot exceed 100 characters

---

# Email Validation

The email:

- is required
- is trimmed
- is converted to lowercase
- must be unique
- must match the configured email pattern

---

# Phone Validation

The phone:

- is required
- is trimmed
- must contain 10 digits

Current format:

```text
9876543210
```

---

# Status

The allowed statuses are:

```text
new
contacted
qualified
lost
```

The default status is:

```text
new
```

---

# Timestamps

The schema uses:

```ts
{
  timestamps: true;
}
```

Mongoose automatically maintains:

```text
createdAt
updatedAt
```

---

# Lead Controllers

## `createLead()`

### Endpoint

```http
POST /api/leads
```

### Purpose

Creates a new lead.

### Request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

### Process

```text
Request
   ↓
Validation
   ↓
createLead()
   ↓
Lead.create()
   ↓
MongoDB
   ↓
Return created lead
```

### Success response

```json
{
  "success": true,
  "data": {}
}
```

---

# `getLeads()`

### Endpoint

```http
GET /api/leads
```

### Current functionality

`getLeads()` supports:

- Listing leads
- Searching leads
- Pagination
- Combining search and pagination
- Sorting by creation date

Leads are sorted by:

```text
createdAt: -1
```

This means the newest leads are returned first.

---

## Search

Search can be performed using:

```http
GET /api/leads?search=john
```

The search currently checks:

- `name`
- `email`
- `phone`
- `status`

The search is case-insensitive.

---

## Pagination

Pagination can be performed using:

```http
GET /api/leads?page=1&limit=10
```

The response includes pagination information such as:

- Current page
- Limit
- Total leads
- Total pages
- Whether a next page exists
- Whether a previous page exists

---

## Search + Pagination

Search and pagination can be combined:

```http
GET /api/leads?search=john&page=1&limit=10
```

The search filter is applied before pagination.

---

# `updateLeadStatus()`

### Endpoint

```http
PATCH /api/leads/:id
```

### Purpose

Updates the status of a lead.

### Request body

```json
{
  "status": "qualified"
}
```

### Allowed statuses

```text
new
contacted
qualified
lost
```

The request is validated using `express-validator`, and Mongoose validation also runs during the update.

### Invalid ID

If the provided MongoDB ID is invalid:

```http
400 Bad Request
```

is returned.

### Not-found behavior

If the specified lead does not exist:

```http
404 Not Found
```

is returned.

---

# `deleteLead()`

### Endpoint

```http
DELETE /api/leads/:id
```

### Purpose

Deletes a lead using its MongoDB ID.

### Process

```text
Request
   ↓
Read lead ID
   ↓
Validate ObjectId
   ↓
Find and delete lead
   ↓
Return result
```

### Invalid ID

An invalid MongoDB ID returns:

```http
400 Bad Request
```

### Not-found behavior

If the lead does not exist:

```http
404 Not Found
```

is returned.

---

# API Endpoints

## Health Check

| Method | Endpoint  | Purpose          |
| ------ | --------- | ---------------- |
| GET    | `/health` | Check API health |

---

## Lead API

| Method | Endpoint                                  | Purpose             | Status         |
| ------ | ----------------------------------------- | ------------------- | -------------- |
| POST   | `/api/leads`                              | Create lead         | ✅ Implemented |
| GET    | `/api/leads`                              | Get leads           | ✅ Implemented |
| GET    | `/api/leads?search=value`                 | Search leads        | ✅ Implemented |
| GET    | `/api/leads?page=1&limit=10`              | Paginate leads      | ✅ Implemented |
| GET    | `/api/leads?search=value&page=1&limit=10` | Search + pagination | ✅ Implemented |
| PATCH  | `/api/leads/:id`                          | Update lead status  | ✅ Implemented |
| DELETE | `/api/leads/:id`                          | Delete lead         | ✅ Implemented |

---

# Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

## `PORT`

Defines the port on which the Express server runs.

Example:

```env
PORT=5000
```

## `MONGO_URI`

MongoDB connection string used by Mongoose.

Local MongoDB example:

```env
MONGO_URI=mongodb://localhost:27017/leadflow
```

MongoDB Atlas can also be used.

---

# `.env.example`

The project should contain a `.env.example` file.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

The real `.env` file should not be committed to Git.

---

# Installation

## Prerequisites

Install:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

Verify Node.js:

```bash
node -v
```

Verify npm:

```bash
npm -v
```

---

# Backend Setup

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

Start the development server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

Test the health endpoint:

```text
http://localhost:5000/health
```

---

# Frontend Setup

The frontend has been initialized, but frontend feature development has not started yet.

Go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will normally run on:

```text
http://localhost:5173
```

---

# Development Phases

## Phase 0 — Project Initialization

**Status: ✅ Completed**

### Project Setup

- [x] Create project repository
- [x] Initialize Git
- [x] Create backend directory
- [x] Create frontend directory
- [x] Add `.gitignore`
- [x] Create README
- [x] Create AGENTS.md

### Backend Setup

- [x] Setup Node.js
- [x] Setup Express
- [x] Setup TypeScript
- [x] Create application entry point
- [x] Create health-check endpoint

### Frontend Setup

- [x] Create React application using Vite
- [x] Configure TypeScript
- [x] Configure Tailwind CSS

---

# Phase 1 — Backend API & Data Layer

**Status: ✅ Completed**

- [x] Configure MongoDB connection
- [x] Configure Mongoose
- [x] Create Lead model
- [x] Define Lead schema
- [x] Add `name`
- [x] Add `email`
- [x] Add `phone`
- [x] Add `status`
- [x] Add timestamps
- [x] Add Mongoose validation
- [x] Setup Express middleware
- [x] Create routes
- [x] Create controller layer
- [x] Connect routes to controllers
- [x] Implement create lead
- [x] Implement get leads
- [x] Implement update status
- [x] Implement delete lead

---

# Phase 2 — Backend Business Logic

**Status: ✅ Completed**

### Lead Operations

- [x] `createLead()`
- [x] `getLeads()`
- [x] `updateLeadStatus()`
- [x] `deleteLead()`

### Search & Pagination

- [x] Add lead search
- [x] Add pagination
- [x] Combine search and pagination
- [x] Sort leads by creation date

### Request Validation

- [x] Add `express-validator`
- [x] Validate create-lead requests
- [x] Validate update-status requests
- [x] Add validation middleware
- [x] Return field-level validation errors

### Error Handling

- [x] Create functional `AppError`
- [x] Create `AppErrorType`
- [x] Create `asyncHandler`
- [x] Add centralized error-handling middleware
- [x] Handle application errors
- [x] Handle validation errors
- [x] Handle Mongoose validation errors
- [x] Handle duplicate MongoDB key errors
- [x] Handle invalid MongoDB ObjectIds
- [x] Handle not-found errors
- [x] Handle unexpected server errors
- [x] Use a consistent API error response structure

### Logging

- [x] Add server startup logging
- [x] Add database connection logging
- [x] Add centralized server-side error logging

### Manual API Testing

- [x] Test APIs manually with Postman

### Architecture

- [x] Separate routes from controllers
- [x] Separate validation from controllers
- [x] Use TypeScript types
- [x] Use `async/await`
- [x] Use `asyncHandler` for asynchronous controllers
- [x] Keep application errors separate from unexpected errors

---

# Phase 3 — Backend Testing

**Status: ⏳ Not Started**

Planned:

- [ ] Setup Vitest
- [ ] Setup Supertest
- [ ] Test valid lead creation
- [ ] Test invalid lead creation
- [ ] Test lead listing
- [ ] Test search
- [ ] Test pagination
- [ ] Test status update
- [ ] Test deletion
- [ ] Test 404 behavior
- [ ] Test error responses
- [ ] Achieve 70%+ coverage

---

# Phase 4 — Frontend Foundation & Features

**Status: ⏳ Not Started**

Planned:

- [ ] Create lead table
- [ ] Create lead form
- [ ] Implement search
- [ ] Implement pagination
- [ ] Implement status update
- [ ] Implement delete
- [ ] Add loading state
- [ ] Add empty state
- [ ] Add error state
- [ ] Add form validation
- [ ] Make UI responsive

---

# Phase 5 — API Integration & Frontend Hooks

**Status: ⏳ Not Started**

Planned:

- [ ] Connect frontend to backend API
- [ ] Create API service layer
- [ ] Create lead
- [ ] Fetch leads
- [ ] Search leads
- [ ] Paginate leads
- [ ] Update lead status
- [ ] Delete lead
- [ ] Create reusable API hooks
- [ ] Create lead modal
- [ ] Create status dropdown

---

# Phase 6 — Testing & Polish

**Status: ⏳ Not Started**

Planned:

- [ ] Setup Vitest
- [ ] Setup React Testing Library
- [ ] Test form submission
- [ ] Test lead table
- [ ] Test search
- [ ] Test pagination
- [ ] Test status updates
- [ ] Test delete
- [ ] Apply final color system
- [ ] Apply typography
- [ ] Check responsive design
- [ ] Improve UX

---

# Phase 7 — Deployment

**Status: ⏳ Not Started**

Planned architecture:

```text
Frontend
   ↓
Vercel

Backend
   ↓
Render

Database
   ↓
MongoDB Atlas
```

Planned tasks:

- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Configure production environment variables
- [ ] Configure frontend/backend URLs
- [ ] Configure production CORS
- [ ] Test production API
- [ ] Test production application

---

# Phase 8 — Documentation

**Status: 🔄 In Progress**

Completed:

- [x] Project overview
- [x] Current project status
- [x] Technology stack
- [x] Backend structure
- [x] Backend file responsibilities
- [x] API documentation
- [x] Search documentation
- [x] Pagination documentation
- [x] Validation documentation
- [x] Error-handling documentation
- [x] Environment variables
- [x] Development phases

Remaining:

- [ ] Document frontend architecture
- [ ] Document deployment
- [ ] Document automated testing strategy
- [ ] Document technical decisions
- [ ] Document technical trade-offs
- [ ] Finalize AGENTS.md

---

# Development Guidelines

When adding a new feature:

1. Keep routes focused on endpoint definitions and request flow.
2. Put business logic in controllers.
3. Validate input before performing database operations.
4. Use TypeScript types for application data.
5. Use `async/await` for asynchronous operations.
6. Wrap asynchronous controllers with `asyncHandler`.
7. Use `AppError` for expected application errors.
8. Let centralized error middleware handle errors consistently.
9. Keep functions small and readable.
10. Avoid unnecessary duplication.
11. Keep reusable middleware and utilities in their appropriate files.
12. Update the README when completed functionality changes.

---

# Current Backend Request Flow

A typical lead request follows this structure:

```text
Client
  │
  ▼
Express
  │
  ▼
Route
  │
  ├── Validation
  │
  ├── Validation Error
  │       ↓
  │   errorHandler
  │
  ▼
asyncHandler
  │
  ▼
Controller
  │
  ├── AppError
  │       ↓
  │   errorHandler
  │
  ▼
Mongoose Model
  │
  ▼
MongoDB
  │
  ▼
Controller Response
```

This structure keeps request validation, business logic, database operations, and error handling separated.

---

# Future Architecture

As the application grows, the backend may evolve toward:

```text
Request

   ↓

Routes

   ↓

Validation

   ↓

Controller

   ↓

Service

   ↓

Model

   ↓

MongoDB
```

The current application does not introduce a service layer yet because the current business logic remains small enough to be handled by the controller layer.

---

# Deployment

The application is not deployed yet.

Planned deployment:

```text
Frontend → Vercel

Backend  → Render

Database → MongoDB Atlas
```

Deployment configuration will be added during Phase 7.

---

# License

This project is currently intended for development and learning purposes.

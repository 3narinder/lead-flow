# LeadFlow

LeadFlow is a full-stack lead management application for managing and tracking leads.

The application is being built using the MERN stack with TypeScript. The backend REST API and MongoDB data layer are currently implemented, while the frontend and additional backend improvements are being developed incrementally.

---

# Project Status

🚧 **In Development**

The project is being developed phase by phase.

The current focus is the backend API and data layer before moving to automated testing and frontend integration.

---

# Current Progress

| Phase                                    | Status         |
| ---------------------------------------- | -------------- |
| Phase 0 — Project Initialization         | ✅ Completed   |
| Phase 1 — Backend API & Data Layer       | ✅ Completed   |
| Phase 2 — Backend Business Logic         | ✅ Completed   |
| Phase 3 — Backend Testing                | ⏳ Not Started |
| Phase 4 — Frontend Foundation & Features | ⏳ Not Started |
| Phase 5 — Frontend API Integration       | ⏳ Not Started |
| Phase 6 — Testing & Polish               | ⏳ Not Started |
| Phase 7 — Deployment                     | ⏳ Not Started |
| Phase 8 — Documentation                  | 🔄 In Progress |

---

# Features

## Currently Implemented

- Create a lead
- List all leads
- Update lead status
- Delete a lead
- MongoDB database connection
- Mongoose Lead model
- Mongoose schema validation
- Express REST API
- CORS configuration
- JSON request parsing
- Health-check endpoint
- Environment variable configuration

## Currently Being Implemented

- Controller-level error handling
- Lead search
- Lead pagination

## Planned Features

- Express-validator validation
- More complete API validation
- Backend automated tests
- Frontend lead table
- Frontend lead form
- Frontend search
- Frontend pagination
- Frontend status update
- Loading states
- Empty states
- Error states
- Frontend form validation
- React API service layer
- React hooks
- Frontend tests
- Deployment

## Future Improvements

- Authentication
- Authorization
- Role-based access control
- Lead filtering
- Lead sorting
- Lead activity history
- Dashboard
- Analytics
- Email notifications
- Advanced search
- Pagination improvements
- API documentation
- Logging
- Rate limiting

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Backend

- Node.js
- Express
- TypeScript
- dotenv
- CORS

## Database

- MongoDB
- Mongoose

## Validation

Currently:

- Mongoose schema validation

Planned:

- `express-validator`

## Testing

Planned:

- Vitest
- Supertest
- React Testing Library

---

# Project Structure

The project is currently organized into separate frontend and backend applications.

```text
leadflow/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── app/
│   │   │   └── app.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── lead.controller.ts
│   │   │
│   │   ├── db/
│   │   │   └── db.ts
│   │   │
│   │   ├── models/
│   │   │   └── lead.model.ts
│   │   │
│   │   ├── routes/
│   │   │   └── lead.routes.ts
│   │   │
│   │   ├── types/
│   │   │   └── lead.types.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   └── ...
│
├── .gitignore
├── AGENT.md
└── README.md
```

> The frontend structure will be documented in detail when frontend development begins.

---

# Backend Architecture

LeadFlow currently follows a simple separation-of-concerns structure:

```text
HTTP Request
     │
     ▼
   Routes
     │
     ▼
 Controllers
     │
     ▼
 Mongoose Model
     │
     ▼
  MongoDB
```

## Routes

Routes define the HTTP endpoints and connect them to controller functions.

Routes should remain simple and should not contain business logic.

Example:

```text
POST /api/leads
      ↓
createLead()
```

---

## Controllers

Controllers contain the request/response and business logic for each endpoint.

Current controller functions:

- `createLead()`
- `getLeads()`
- `updateLeadStatus()`
- `deleteLead()`

Each controller is responsible for:

1. Reading request data.
2. Performing the required operation.
3. Returning the appropriate response.
4. Handling errors using `try/catch`.

---

## Models

Mongoose models define the structure of documents stored in MongoDB.

The current application contains one model:

```text
Lead
```

---

## Database

The database module is responsible for establishing the MongoDB connection before the server starts.

---

# Backend Files

## `src/server.ts`

This is the backend entry point.

Responsibilities:

- Load environment variables.
- Connect to MongoDB.
- Start the Express server.
- Handle startup failure.

The server starts only after the database connection succeeds.

Flow:

```text
server.ts
   │
   ├── dotenv.config()
   │
   ├── connectDB()
   │
   └── app.listen()
```

---

# `src/app/app.ts`

This file creates and configures the Express application.

Responsibilities:

- Create Express application.
- Enable CORS.
- Enable JSON request parsing.
- Register health-check endpoint.
- Register lead routes.

Current middleware:

```ts
app.use(cors());
app.use(express.json());
```

Current health-check endpoint:

```http
GET /health
```

---

# `src/db/db.ts`

This file manages the MongoDB connection.

It uses:

```text
mongoose.connect()
```

The MongoDB connection string is read from:

```text
MONGO_URI
```

If `MONGO_URI` is missing or the connection fails, the application exits during startup.

---

# `src/models/lead.model.ts`

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

## Name Validation

The name:

- is required
- is trimmed
- must contain at least 2 characters
- cannot exceed 100 characters

---

## Email Validation

The email:

- is required
- is trimmed
- is converted to lowercase
- must be unique
- must match the configured email pattern

---

## Phone Validation

The phone:

- is required
- is trimmed
- must contain 10 digits

Current format:

```text
9876543210
```

---

## Status

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

## Timestamps

The schema uses:

```ts
{
  timestamps: true;
}
```

Mongoose therefore automatically maintains:

```text
createdAt
updatedAt
```

---

# `src/controllers/lead.controller.ts`

This file contains the logic for lead-related API operations.

---

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
Read name/email/phone
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

Currently returns all leads from MongoDB.

Leads are sorted by:

```text
createdAt: -1
```

This means the newest leads are returned first.

### Planned improvements

Search and pagination will be added to this function.

Planned examples:

```http
GET /api/leads?search=john
```

```http
GET /api/leads?page=1&limit=10
```

```http
GET /api/leads?search=john&page=1&limit=10
```

---

# `updateLeadStatus()`

### Current Endpoint

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

The update uses Mongoose validation so that invalid status values are rejected.

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
Find and delete lead
   ↓
Return result
```

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

| Method | Endpoint                     | Purpose            | Status         |
| ------ | ---------------------------- | ------------------ | -------------- |
| POST   | `/api/leads`                 | Create lead        | ✅ Implemented |
| GET    | `/api/leads`                 | Get all leads      | ✅ Implemented |
| GET    | `/api/leads?search=value`    | Search leads       | 🔄 In Progress |
| GET    | `/api/leads?page=1&limit=10` | Paginate leads     | 🔄 In Progress |
| PATCH  | `/api/leads/:id`             | Update lead status | ✅ Implemented |
| DELETE | `/api/leads/:id`             | Delete lead        | ✅ Implemented |

---

# Error Handling

For the current development stage, errors are handled directly inside each controller using `try/catch`.

The current approach is intentionally simple:

```text
Controller
   │
   ├── try
   │    └── perform operation
   │
   └── catch
        └── return appropriate error response
```

A centralized error middleware is **not currently being used**.

A centralized error-handling system may be considered later if the application grows and repeated error-handling logic becomes difficult to maintain.

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
- [x] Create AGENT.md

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

**Status: 🔄 In Progress**

### Completed

- [x] `createLead()`
- [x] `getLeads()`
- [x] `updateLeadStatus()`
- [x] `deleteLead()`
- [x] Improve controller error handling
- [x] Add lead search
- [x] Add pagination
- [x] Combine search and pagination
- [x] Test APIs manually with Postman

- [x] Add `express-validator`
- [ ] Improve validation responses
- [ ] Add logging
- [ ] Improve API error consistency
- [ ] Add error handling middleware

## How tasks are distributed

- Controller → business logic
- AppError → creates application errors
- asyncHandler → catches async controller errors
- errorHandler → converts errors into HTTP responses
- Routes → connect URL → middleware → controller
- Types → TypeScript definitions

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
- [x] Environment variables
- [x] Development phases

Remaining:

- [ ] Finalize API documentation
- [ ] Document frontend architecture
- [ ] Document deployment
- [ ] Document testing strategy
- [ ] Document technical decisions
- [ ] Document technical trade-offs
- [ ] Finalize AGENT.md

---

# Development Guidelines

When adding a new feature:

1. Keep routes focused only on endpoint definitions.
2. Put request/response logic in controllers.
3. Keep database logic inside models or appropriate service layers as the application grows.
4. Use TypeScript types for request data.
5. Validate input before performing database operations.
6. Handle errors appropriately inside controllers for the current architecture.
7. Keep functions small and readable.
8. Avoid duplicating logic.
9. Update tests when adding or changing behavior.
10. Update this README when project functionality changes.

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

The current application intentionally remains simpler while the core functionality is being built.

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

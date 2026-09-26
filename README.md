# LeadFlow — Lead Management Application

A modern, full-stack lead tracking application built with React, TypeScript, Node.js, Express, and MongoDB.

**GitHub:** [3narinder/lead-flow](https://github.com/3narinder/lead-flow)

---

## 🎯 Overview

LeadFlow is a production-ready lead management system designed for sales teams and businesses to efficiently track and manage their leads through different stages of the sales pipeline.

**Key Features:**

- ✅ Create and manage leads
- ✅ Search leads by name, email, or phone
- ✅ Filter leads by status (new, contacted, qualified, lost)
- ✅ Sort leads by creation date or custom fields
- ✅ Paginate through large lead datasets
- ✅ Update lead status in real-time
- ✅ Delete leads
- ✅ Fully responsive design
- ✅ Real-time data synchronization

---

## 📊 Current Project Status

| Component        | Status         | Details                                            |
| ---------------- | -------------- | -------------------------------------------------- |
| Backend API      | ✅ Complete    | All CRUD operations implemented                    |
| Frontend UI      | ✅ Complete    | Full feature parity with backend                   |
| Database         | ✅ Complete    | MongoDB with Mongoose ORM                          |
| Backend Testing  | ✅ Complete    | Vitest + Supertest test suite                      |
| Frontend Testing | ⏳ In Progress | Vitest + React Testing Library                     |
| Deployment       | ⏳ Planned     | Vercel (frontend), Render (backend), MongoDB Atlas |
| Documentation    | ✅ Complete    | Comprehensive API & developer guides               |

---

## 🏗️ Architecture

### System Architecture

```
                    LeadFlow

┌──────────────────────────────────────┐
│       React Frontend (Vite)          │
│  TypeScript + Tailwind + React Query │
│                                      │
│  Components → Hooks → Services → API │
└────────────────┬─────────────────────┘
                 │
                 │ HTTP / JSON (REST API)
                 ▼
┌──────────────────────────────────────┐
│    Node.js Backend (Express)         │
│     TypeScript + Mongoose            │
│                                      │
│  Routes → Validators → Controllers → │
│       → Models → MongoDB             │
└────────────────┬─────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│         MongoDB Database             │
│                                      │
│       leads collection               │
└──────────────────────────────────────┘
```

### Backend Request Flow

```
Client Request
      ↓
Express Router
      ↓
Validation Middleware
      ├─ Validation Success → Continue
      └─ Validation Error → Error Handler
      ↓
asyncHandler
      ├─ Success → Controller
      └─ Error → Error Handler
      ↓
Controller
      ├─ Business Logic
      └─ Mongoose Model
      ↓
MongoDB
      ↓
Response → Client
```

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **React Hook Form** - Form state management
- **TanStack React Query** - Server state management
- **React Hot Toast** - Toast notifications
- **React Error Boundary** - Error handling
- **React Icons** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **express-validator** - Request validation
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables

### Database

- **MongoDB** - NoSQL database
- **Mongoose** - Database schema & validation

### Testing

- **Vitest** - Fast unit test framework
- **Supertest** - HTTP assertion library
- **React Testing Library** - Frontend component testing

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Configure MongoDB connection
# Edit .env and add your MONGO_URI

# 4. Start development server
npm run dev

# Backend runs on: http://localhost:5000
# Health check: http://localhost:5000/health
```

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# Frontend runs on: http://localhost:5173
# API proxy configured for /api calls
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {},
  "pagination": {}
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔌 API Endpoints

### 1. Create Lead

**Endpoint:** `POST /api/leads`

**Purpose:** Create a new lead

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "status": "new"
}
```

**Field Validation:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | Yes | 2-100 characters, trimmed |
| email | string | Yes | Valid email, unique, lowercase |
| phone | string | Yes | Exactly 10 digits |
| status | enum | No | new, contacted, qualified, lost |

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "new",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message               | Reason             |
| ------ | --------------------- | ------------------ |
| 400    | Validation failed     | Invalid input data |
| 409    | Email already exists  | Duplicate email    |
| 500    | Internal server error | Server error       |

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "new"
  }'
```

**JavaScript Fetch Example:**

```typescript
const response = await fetch("http://localhost:5000/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    status: "new",
  }),
});

const data = await response.json();
```

---

### 2. Get Leads

**Endpoint:** `GET /api/leads`

**Purpose:** Retrieve leads with optional search, filtering, sorting, and pagination

**Query Parameters:**

| Parameter | Type   | Optional | Default     | Example             |
| --------- | ------ | -------- | ----------- | ------------------- |
| search    | string | Yes      | ""          | `?search=john`      |
| status    | string | Yes      | ""          | `?status=qualified` |
| sortBy    | string | Yes      | "createdAt" | `?sortBy=name`      |
| sortOrder | string | Yes      | "desc"      | `?sortOrder=asc`    |
| page      | number | Yes      | 1           | `?page=2`           |
| limit     | number | Yes      | 10          | `?limit=20`         |

**Search Behavior:**

- Searches across: name, email, phone, status
- Case-insensitive matching
- Partial string matching

**Valid Status Values:**

```
new
contacted
qualified
lost
```

**Valid Sort Fields:**

```
createdAt (default)
name
email
phone
status
```

**Pagination:**

- Default page size: 10 leads per page
- Maximum recommended: 100 leads per page

**Request Examples:**

```
# Get all leads (default pagination)
GET /api/leads

# Search by name/email
GET /api/leads?search=john

# Filter by status
GET /api/leads?status=qualified

# Sort by name ascending
GET /api/leads?sortBy=name&sortOrder=asc

# Pagination
GET /api/leads?page=2&limit=20

# Combined query
GET /api/leads?search=john&status=qualified&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalLeads": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "status": "new",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "8765432109",
      "status": "contacted",
      "createdAt": "2024-01-14T15:20:00.000Z",
      "updatedAt": "2024-01-14T15:20:00.000Z"
    }
  ]
}
```

**cURL Examples:**

```bash
# Get all leads
curl http://localhost:5000/api/leads

# Search leads
curl "http://localhost:5000/api/leads?search=john"

# Filter and paginate
curl "http://localhost:5000/api/leads?status=qualified&page=1&limit=10"

# Complex query
curl "http://localhost:5000/api/leads?search=doe&status=qualified&sortBy=name&sortOrder=asc&page=1&limit=5"
```

**JavaScript Example:**

```typescript
// Using the frontend service
import { getLeads } from "../services/leadsService";

const response = await getLeads({
  search: "john",
  status: "qualified",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
});

console.log(response.pagination);
console.log(response.data);
```

---

### 3. Update Lead Status

**Endpoint:** `PATCH /api/leads/:id`

**Purpose:** Update a lead's status

**URL Parameters:**
| Parameter | Type | Required | Format |
|-----------|------|----------|--------|
| id | string | Yes | Valid MongoDB ObjectId |

**Request Body:**

```json
{
  "status": "qualified"
}
```

**Field Validation:**
| Field | Type | Required | Options |
|-------|------|----------|---------|
| status | string | Yes | new, contacted, qualified, lost |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "qualified",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message               | Reason               |
| ------ | --------------------- | -------------------- |
| 400    | Invalid lead ID       | Malformed ObjectId   |
| 400    | Validation failed     | Invalid status value |
| 404    | Lead not found        | ID doesn't exist     |
| 500    | Internal server error | Server error         |

**cURL Example:**

```bash
curl -X PATCH http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "qualified"}'
```

**JavaScript Example:**

```typescript
const leadId = "507f1f77bcf86cd799439011";

const response = await fetch(`http://localhost:5000/api/leads/${leadId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: "qualified" }),
});

const data = await response.json();
```

---

### 4. Delete Lead

**Endpoint:** `DELETE /api/leads/:id`

**Purpose:** Delete a lead permanently

**URL Parameters:**
| Parameter | Type | Required | Format |
|-----------|------|----------|--------|
| id | string | Yes | Valid MongoDB ObjectId |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "new",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message               | Reason             |
| ------ | --------------------- | ------------------ |
| 400    | Invalid lead ID       | Malformed ObjectId |
| 404    | Lead not found        | ID doesn't exist   |
| 500    | Internal server error | Server error       |

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/leads/507f1f77bcf86cd799439011
```

**JavaScript Example:**

```typescript
const leadId = "507f1f77bcf86cd799439011";

const response = await fetch(`http://localhost:5000/api/leads/${leadId}`, {
  method: "DELETE",
});

const data = await response.json();
```

---

### 5. Health Check

**Endpoint:** `GET /health`

**Purpose:** Verify API is running

**Success Response (200 OK):**

```json
{
  "status": "ok"
}
```

**cURL Example:**

```bash
curl http://localhost:5000/health
```

---

## 🗂️ Project Structure

### Backend

```
backend/
├── src/
│   ├── controllers/
│   │   └── leads.controllers.ts    # Lead business logic
│   ├── models/
│   │   └── lead.model.ts           # Mongoose schema
│   ├── routes/
│   │   └── leads.routes.ts         # API endpoints
│   ├── validator/
│   │   └── lead.validator.ts       # Request validation rules
│   ├── middleware/
│   │   ├── error.middleware.ts     # Error handling
│   │   └── validation.middleware.ts # Validation error handling
│   ├── types/
│   │   ├── lead.types.ts           # Lead TypeScript types
│   │   └── error.types.ts          # Error types
│   ├── utils/
│   │   ├── AppError.ts             # Custom error class
│   │   ├── AsyncHandler.ts         # Async error wrapper
│   │   └── leadQuery.ts            # Query builders
│   ├── db/
│   │   └── db.ts                   # MongoDB connection
│   ├── app.ts                      # Express app config
│   └── server.ts                   # Server entry point
├── test/
│   ├── health.test.ts              # Health endpoint tests
│   ├── leads.test.ts               # Lead API tests
│   └── setup.ts                    # Test configuration
├── .env                            # Environment variables
├── package.json
├── vitest.config.ts
└── tsconfig.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/                 # Reusable UI components
│   ├── features/
│   │   └── leads/
│   │       ├── LeadsTable.tsx      # Leads table feature
│   │       ├── useLeads.ts         # Leads data hook
│   │       └── LeadTableOperations.tsx
│   ├── ui/                         # Presentational components
│   │   ├── Search.tsx
│   │   ├── Filter.tsx
│   │   ├── Table.tsx
│   │   ├── Pagination.tsx
│   │   ├── LeadFormModal.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ...
│   ├── services/
│   │   └── leadsService.ts         # API client
│   ├── types/
│   │   └── lead.ts                 # TypeScript types
│   ├── hooks/
│   │   └── useMoveBack.ts
│   ├── lib/
│   │   └── toastConfig.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run specific test file
npm test leads.test
```

**Test Coverage:**

- ✅ Lead creation (valid & invalid)
- ✅ Lead retrieval (with search, filter, sort, pagination)
- ✅ Lead status updates
- ✅ Lead deletion
- ✅ Error handling
- ✅ Health check

### Frontend Testing (In Progress)

```bash
cd frontend

# Run tests (once ready)
npm test

# Run in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leadflow?retryWrites=true&w=majority

# Optional: Application Environment
NODE_ENV=development
```

### Frontend (Vite auto-configures)

API base URL is configured in `src/services/leadsService.ts`:

```typescript
const API_URL = "http://localhost:5000/api/leads";
```

For production, update to your deployed backend URL.

---

## 🚀 Deployment

### Planned Architecture

```
Frontend (React)
     ↓
  Vercel
     │
Backend (Express)
     ↓
  Render
     │
Database (MongoDB)
     ↓
MongoDB Atlas
```

### Frontend Deployment (Vercel)

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to Vercel
vercel deploy
```

### Backend Deployment (Render)

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment Variables for Production

**Backend on Render:**

```env
PORT=5000
MONGO_URI=<your-mongodb-atlas-uri>
NODE_ENV=production
```

**Frontend on Vercel:**

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📊 Lead Model

The Lead document in MongoDB contains:

```typescript
interface Lead {
  _id: ObjectId; // MongoDB ID (unique)
  name: string; // Lead name (2-100 chars)
  email: string; // Email address (unique)
  phone: string; // Phone number (10 digits)
  status: LeadStatus; // Status (new|contacted|qualified|lost)
  createdAt: Date; // Creation timestamp (auto)
  updatedAt: Date; // Last update timestamp (auto)
}

type LeadStatus = "new" | "contacted" | "qualified" | "lost";
```

**Default Status:** `new`

**Indexes:**

- `_id` (unique, primary key)
- `email` (unique)
- `createdAt` (for sorting)

---

## 🎨 Frontend Features

### Lead Management

- **Create:** Add new leads via modal form
- **Read:** View all leads in paginated table
- **Update:** Change lead status via dropdown
- **Delete:** Remove leads with confirmation

### Search & Filter

- **Real-time Search:** Search by name, email, or phone
- **Status Filter:** Filter leads by status
- **Sort:** Sort by creation date or custom fields
- **Pagination:** Navigate through results

### UI States

- **Loading:** Spinner shown while fetching data
- **Empty:** Helpful message when no leads exist
- **Error:** Toast notifications for failures
- **Success:** Toast notifications for actions

### Responsive Design

- Desktop optimized table view
- Mobile-friendly responsive layout
- Touch-friendly buttons and controls

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check MongoDB connection
# Verify MONGO_URI in .env is correct
# Ensure MongoDB is running

# Check port is not in use
lsof -i :5000
```

### Frontend can't connect to API

```bash
# Ensure backend is running on http://localhost:5000
# Check CORS is enabled
# Verify API_URL in leadsService.ts
```

### Tests failing

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run tests with verbose output
npm test -- --reporter=verbose
```

---

## 📖 Additional Resources

- **API Guide:** See this document for complete API reference
- **Development Guide:** Check AGENT.md for contribution guidelines
- **GitHub:** [3narinder/lead-flow](https://github.com/3narinder/lead-flow)

---

## 📝 License

MIT License - See LICENSE file in repository

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

See AGENT.md for detailed development guidelines.

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Status:** Production Ready ✅

---

## Quick Links

- [GitHub Repository](https://github.com/3narinder/lead-flow)
- [API Documentation](#-api-endpoints)
- [Development Guide](./AGENT.md)
- [Architecture](#️-architecture)

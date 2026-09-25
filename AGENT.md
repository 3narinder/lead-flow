# LeadFlow — AI Development Guide

## Project Context

LeadFlow is a lead management application built using the MERN stack with TypeScript.

The project is being developed incrementally, with the backend being built first and the frontend planned afterward.

### Current Stack

#### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- dotenv
- CORS
- express-validator

#### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

---

# Project Structure

```text
leadflow/

├── backend/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   └── app.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── lead.controller.ts
│   │   │
│   │   ├── db/
│   │   │   └── db.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   │
│   │   ├── models/
│   │   │   └── lead.model.ts
│   │   │
│   │   ├── routes/
│   │   │   └── leads.routes.ts
│   │   │
│   │   ├── types/
│   │   │   ├── error.types.ts
│   │   │   └── lead.types.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── AppError.ts
│   │   │   └── asyncHandler.ts
│   │   │
│   │   ├── validators/
│   │   │   └── lead.validator.ts
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
├── AGENTS.md
└── README.md
```

---

# Backend Architecture

The backend follows a simple separation of responsibilities:

```text
Request
   ↓
Routes
   ↓
Validation
   ↓
asyncHandler
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
```

Errors are handled separately:

```text
Error
  ↓
asyncHandler
  ↓
errorHandler
  ↓
HTTP Response
```

### Responsibilities

- **Routes** → Define API endpoints and request flow.
- **Validators** → Validate incoming request data.
- **Controllers** → Handle business logic and responses.
- **Models** → Define MongoDB document structure.
- **Middleware** → Handle validation and errors.
- **Types** → Define TypeScript types.
- **Utils** → Reusable utilities such as `AppError` and `asyncHandler`.
- **Database** → Manage MongoDB connection.

---

# Current Backend Features

The backend currently supports:

- Create lead
- Get leads
- Search leads
- Pagination
- Search + pagination
- Update lead status
- Delete lead
- Request validation
- Centralized error handling
- Basic server-side logging
- MongoDB connection
- Health-check endpoint

---

# Development Rules

1. Keep routes simple.
2. Keep business logic in controllers.
3. Keep validation in validator files.
4. Use TypeScript types.
5. Use `async/await`.
6. Use `asyncHandler` for asynchronous controllers.
7. Use functional `AppError` for expected application errors.
8. Use centralized error middleware.
9. Avoid unnecessary abstraction.
10. Keep code readable and easy to understand.
11. Add comments where they help explain the code.
12. Do not modify unrelated files when implementing a feature.
13. Test API changes manually during development.

---

# AI Usage

AI is used mainly for:

- Explaining concepts
- Repetitive code
- Boilerplate
- Small code improvements
- Debugging specific errors

Core project decisions and implementation understanding should remain with the developer.

AI-generated code should be reviewed and understood before being added to the project.

---

# Basic Reusable AI Prompts

## Add a New Controller

```text
I already have an Express + TypeScript project with an established controller pattern.

Create this controller:

[CONTROLLER NAME]

Follow the existing project structure.

Requirements:
- Use async/await.
- Use asyncHandler.
- Use AppError for expected errors.
- Keep business logic inside the controller.
- Follow the response structure already used in the project.
- Do not modify unrelated files.
- Add short comments for important logic.
```

---

## Add Validation

```text
I already have an Express + TypeScript project using express-validator.

Create validation for:

[REQUEST / ENDPOINT]

Validation rules:

[LIST RULES]

Requirements:
- Keep validation in the validator file.
- Use express-validator.
- Use clear error messages.
- Do not put validation logic inside the controller.
- Follow the existing validation pattern.
```

---

## Add a Route

```text
I already have an Express + TypeScript project with an established route structure.

Add this endpoint:

[METHOD] [ENDPOINT]

Requirements:
- Connect it to the existing controller.
- Add validation if required.
- Use handleValidationErrors where needed.
- Use asyncHandler for async controllers.
- Keep the route simple.
- Do not put business logic in the route.
- Do not modify unrelated routes.
```

---

## Explain Existing Code

```text
Explain this code to me step by step.

I am learning backend development, so explain:
1. What each important line does.
2. Why it is needed.
3. How it connects to the rest of the project.
4. What happens when a request reaches this code.

Do not rewrite the code unless I ask you to.
```

---

# Manual Development

The initial backend structure and core business logic were manually developed.

Manual work includes:

- Project setup
- Backend structure
- CRUD implementation
- Search
- Pagination
- Combining search and pagination
- API design decisions
- Postman testing
- Debugging runtime issues
- Reviewing and refining implementations

AI assistance was used selectively for repetitive code, explanations, and implementation support.

---

# Project Scope

LeadFlow is focused on **lead management**.

Authentication, login, authorization, and role-based access control are **not part of the planned project scope**.

The project should not introduce authentication or authorization systems unless the project requirements are deliberately changed later.

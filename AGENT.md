# AGENT.md — LeadFlow Development Guide

This document defines how to work on the LeadFlow project as an AI agent or developer.

LeadFlow is a full-stack lead management application currently in active development with automated testing being added to the frontend.

---

## 📋 Current Project State

### Completed Components

| Component              | Status         | Details                              |
| ---------------------- | -------------- | ------------------------------------ |
| **Backend API**        | ✅ Complete    | All CRUD endpoints implemented       |
| **Database**           | ✅ Complete    | MongoDB + Mongoose fully configured  |
| **Backend Validation** | ✅ Complete    | express-validator for all endpoints  |
| **Error Handling**     | ✅ Complete    | Centralized error middleware         |
| **Backend Testing**    | ✅ Complete    | Vitest + Supertest test suite        |
| **Frontend UI**        | ✅ Complete    | Full feature parity with backend     |
| **API Integration**    | ✅ Complete    | Frontend service layer complete      |
| **Frontend Testing**   | ⏳ In Progress | Vitest + React Testing Library setup |
| **Deployment**         | ⏳ Planned     | Vercel, Render, MongoDB Atlas        |

### What Works Now

**Backend:**

- ✅ Create leads (POST /api/leads)
- ✅ Get leads with pagination (GET /api/leads)
- ✅ Search leads by name/email/phone (GET /api/leads?search=value)
- ✅ Filter leads by status (GET /api/leads?status=qualified)
- ✅ Sort leads (GET /api/leads?sortBy=name&sortOrder=asc)
- ✅ Update lead status (PATCH /api/leads/:id)
- ✅ Delete leads (DELETE /api/leads/:id)
- ✅ Full request validation
- ✅ Comprehensive error handling
- ✅ Complete test coverage

**Frontend:**

- ✅ Lead dashboard with table
- ✅ Create lead form (modal)
- ✅ Search functionality
- ✅ Status filtering
- ✅ Sorting controls
- ✅ Pagination
- ✅ Status update dropdown
- ✅ Delete with confirmation
- ✅ Loading states
- ✅ Empty states
- ✅ Error states
- ✅ Responsive design

### In Progress

**Frontend Testing:**

- Component tests with React Testing Library
- Hook tests with Vitest
- Integration tests
- Coverage goals: 70%+

---

## 🎯 Core Development Principles

### Code Quality Rules

1. **Use TypeScript** - No `any` types; be explicit
2. **Keep It Simple** - Avoid unnecessary abstractions
3. **DRY** - Don't repeat yourself; reuse existing code
4. **SRP** - Single Responsibility Principle
5. **Readable** - Prioritize clarity over cleverness
6. **Tested** - Write tests for critical paths
7. **Documented** - Update docs when changing behavior

### Architecture Rules

**Backend:**

```
Routes (thin)
    ↓
Validation
    ↓
asyncHandler
    ↓
Controllers (business logic)
    ↓
Mongoose Models
    ↓
MongoDB
```

**Frontend:**

```
UI Components (presentation)
    ↓
Hooks (state management)
    ↓
Services (API calls)
    ↓
Express API
```

### DO's

- ✅ Use existing utilities (AppError, asyncHandler)
- ✅ Keep validation in validator files
- ✅ Keep business logic in controllers
- ✅ Keep API calls in service files
- ✅ Use TypeScript interfaces
- ✅ Test critical functionality
- ✅ Update documentation
- ✅ Use descriptive variable names
- ✅ Follow existing patterns
- ✅ Make small focused commits

### DON'Ts

- ❌ Don't use `any` in TypeScript
- ❌ Don't put business logic in routes
- ❌ Don't put API calls in components
- ❌ Don't modify unrelated files
- ❌ Don't skip validation
- ❌ Don't ignore errors
- ❌ Don't add authentication without a requirement
- ❌ Don't introduce unnecessary dependencies
- ❌ Don't rewrite working code
- ❌ Don't commit secrets or .env files

---

## 🛠️ Tech Stack Reference

### Backend Stack

```
Node.js 18+
├── Express 5.2.1
├── TypeScript 7.0.2
├── Mongoose 9.10.2
├── express-validator 7.3.2
├── CORS 2.8.6
├── Morgan 1.12.1
└── Testing
    ├── Vitest 5.0.2
    └── Supertest 7.3.0
```

### Frontend Stack

```
React 19.2.8
├── TypeScript 6.0.2
├── Vite 8.3.0
├── Tailwind CSS 4.3.3
├── React Router v7 7.18.4
├── React Hook Form 7.88.0
├── TanStack React Query 5.104.0
├── React Hot Toast 2.6.1
└── Testing (In Progress)
    ├── Vitest
    └── React Testing Library
```

### Database

```
MongoDB 4.0+
└── Mongoose 9.10.2
```

---

## 🚀 Development Workflow

### 1. Before Starting

```bash
# Ensure you're in the correct directory
cd lead-flow

# Check existing code
git log --oneline -10

# Review recent changes
git diff HEAD~5..HEAD

# Check TypeScript errors
npm run typecheck  # backend
npm run build      # frontend
```

### 2. Feature Implementation

When adding a feature:

**Backend:**

1. Check if validator exists for the endpoint
2. Add validation rules if needed
3. Implement controller logic
4. Add error handling (AppError)
5. Test with cURL or Postman
6. Update documentation

**Frontend:**

1. Create component or hook
2. Use TypeScript types
3. Call existing service methods
4. Handle loading/error/empty states
5. Test component interaction
6. Add tests

### 3. Testing

**Backend:**

```bash
cd backend
npm run test       # watch mode
npm run test:run   # once (CI)
```

**Frontend:**

```bash
cd frontend
npm test           # when ready
npm test -- --watch
npm test -- --coverage
```

### 4. Committing

Use meaningful commit messages:

```bash
# Feature
git commit -m "feat: add lead search functionality"

# Bug fix
git commit -m "fix: handle empty leads response"

# Docs
git commit -m "docs: update API documentation"

# Tests
git commit -m "test: add lead creation tests"

# Refactor
git commit -m "refactor: simplify lead service"
```

### 5. Code Review Checklist

Before submitting:

- [ ] TypeScript compiles without errors
- [ ] No `any` types used
- [ ] Tests pass (backend)
- [ ] Code follows project patterns
- [ ] Documentation updated
- [ ] No unrelated files modified
- [ ] Meaningful commit messages
- [ ] No console.log debugging code

---

## 📁 File Organization

### Adding Backend Files

**Don't create new folders unless necessary.**

**If adding a feature:**

1. Add validation to `src/validator/lead.validator.ts`
2. Add controller method to `src/controllers/leads.controllers.ts`
3. Add route to `src/routes/leads.routes.ts`
4. Add types to `src/types/lead.types.ts`

**Follow the existing pattern:**

```
Request → Validator → Route → Controller → Model → MongoDB
```

### Adding Frontend Files

**Component location:**

- Reusable UI components → `src/ui/`
- Feature components → `src/features/leads/`
- Custom hooks → `src/hooks/` or with the feature
- API calls → `src/services/leadsService.ts`

**Example:**

```
src/
├── ui/
│   └── NewComponent.tsx         (reusable)
├── features/
│   └── leads/
│       └── NewFeature.tsx       (feature-specific)
└── services/
    └── leadsService.ts          (update existing)
```

---

## 🔄 Request Flow Examples

### Creating a Lead

**Frontend → Backend:**

1. User fills form in LeadFormModal
2. Form validates input
3. Calls `createLead()` from leadsService
4. Service makes `POST /api/leads`

**Backend:**

1. Route receives request
2. `createLeadValidator` validates input
3. `asyncHandler` wraps controller
4. Controller creates lead in MongoDB
5. Response sent to frontend

**Response:**

```json
{
  "success": true,
  "data": {
    /* lead object */
  }
}
```

### Searching Leads

**Frontend:**

1. User types in Search component
2. Calls `getLeads({ search: "value" })`
3. Service sends `GET /api/leads?search=value`

**Backend:**

1. Route receives query parameters
2. Controller builds filter
3. MongoDB finds matching documents
4. Returns paginated results

**Response:**

```json
{
  "success": true,
  "pagination": {
    /* pagination info */
  },
  "data": [
    /* leads */
  ]
}
```

### Updating Status

**Frontend:**

1. User clicks status dropdown
2. Calls `updateLead(leadId, { status: "qualified" })`
3. Service sends `PATCH /api/leads/:id`

**Backend:**

1. Route receives PATCH request
2. Validates MongoDB ObjectId
3. Validates status value
4. Updates document
5. Returns updated lead

---

## 🧪 Testing Guidelines

### Backend Testing Strategy

**What to test:**

- ✅ Valid inputs create/update correctly
- ✅ Invalid inputs are rejected
- ✅ Edge cases (empty strings, special chars)
- ✅ Status transitions
- ✅ Pagination math
- ✅ Search matching
- ✅ Error responses

**What NOT to test:**

- ❌ Third-party library behavior
- ❌ MongoDB implementation details
- ❌ Exact error message wording (too specific)

**Test structure:**

```typescript
describe("createLead", () => {
  it("should create a lead with valid data", async () => {
    // Arrange
    const validLead = {
      name: "John",
      email: "john@test.com",
      phone: "1234567890",
    };

    // Act
    const response = await request(app).post("/api/leads").send(validLead);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### Frontend Testing Strategy

**What to test:**

- ✅ Component renders correctly
- ✅ Form validation works
- ✅ User interactions work
- ✅ Loading states appear
- ✅ Error messages display
- ✅ Empty state shows

**What NOT to test:**

- ❌ Implementation details
- ❌ Third-party libraries
- ❌ CSS styling

**Test structure:**

```typescript
describe('LeadForm', () => {
  it('should display validation error for invalid email', async () => {
    // Arrange
    render(<LeadForm />);
    const input = screen.getByLabelText('Email');

    // Act
    await userEvent.type(input, 'invalid-email');
    await userEvent.click(screen.getByText('Create'));

    // Assert
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });
});
```

---

## 🚨 Common Mistakes

### Backend

1. **Forgetting asyncHandler**
   ❌ Async errors not caught
   ✅ Always wrap async controllers

2. **Validation in controller**
   ❌ Mixed concerns
   ✅ Keep validation in validator files

3. **Not handling null checks**
   ❌ Crashes on missing data
   ✅ Always check if document exists

4. **Wrong error type**
   ❌ Generic errors don't help debugging
   ✅ Use AppError with status codes

### Frontend

1. **Fetching in component body**
   ❌ Creates infinite loops
   ✅ Use hooks or services

2. **Using `any` type**
   ❌ Loses type safety
   ✅ Define proper TypeScript types

3. **Not handling loading state**
   ❌ Confusing UX
   ✅ Show loader while fetching

4. **Modifying unrelated components**
   ❌ Side effects, breaks tests
   ✅ Only change what's needed

---

## 🔍 Code Review Questions

When reviewing code, ask:

**TypeScript:**

- [ ] Is the code TypeScript type-safe?
- [ ] Are all variables properly typed?
- [ ] Any `any` types that should be removed?

**Architecture:**

- [ ] Does it follow the existing pattern?
- [ ] Is the responsibility in the right layer?
- [ ] Could existing code be reused?

**Testing:**

- [ ] Are tests meaningful?
- [ ] Do tests verify behavior, not implementation?
- [ ] Is test coverage adequate?

**Performance:**

- [ ] Are there unnecessary re-renders?
- [ ] Any N+1 query problems?
- [ ] Could pagination/virtualization help?

**Documentation:**

- [ ] Is the change documented?
- [ ] Are new endpoints documented?
- [ ] Could examples help understanding?

---

## 📚 API Reference Quick Guide

### Creating Resources

```
POST /api/leads
Content-Type: application/json
Body: { name, email, phone, status? }
Response: 201 Created
```

### Reading Resources

```
GET /api/leads
Query: ?search=&status=&sortBy=&sortOrder=&page=&limit=
Response: 200 OK { pagination, data }
```

### Updating Resources

```
PATCH /api/leads/:id
Content-Type: application/json
Body: { status }
Response: 200 OK
```

### Deleting Resources

```
DELETE /api/leads/:id
Response: 200 OK
```

---

## 🐛 Debugging Tips

### Backend Debugging

```bash
# Check TypeScript errors
npm run typecheck

# Run tests in verbose mode
npm test -- --reporter=verbose

# Check API with curl
curl -X GET http://localhost:5000/api/leads

# Enable debug logging (add to controller)
console.log('Debug:', variable);

# Check database
# Login to MongoDB Atlas and view collections
```

### Frontend Debugging

```bash
# Check TypeScript errors
npm run build

# Open browser DevTools (F12)
# Check Network tab for API calls
# Check Console for errors

# Test component in isolation
npm test ComponentName

# Check React Query DevTools
# Should be visible in browser when running dev server
```

---

## 📊 Performance Considerations

### Backend Performance

1. **Database Indexing**
   - Email field has unique index
   - CreatedAt field can be indexed for sorting

2. **Pagination**
   - Always use pagination for list endpoints
   - Default limit: 10 leads per page

3. **Query Optimization**
   - Use `Promise.all()` for parallel queries
   - Only select needed fields

### Frontend Performance

1. **Component Memoization**
   - Memoize expensive components
   - Use React.memo for list items

2. **Data Fetching**
   - Use React Query for caching
   - Debounce search requests

3. **Bundle Size**
   - Monitor dependencies
   - Use tree-shaking where possible

---

## 🚀 Deployment Checklist

Before deploying to production:

**Backend:**

- [ ] All tests pass locally
- [ ] TypeScript compiles without errors
- [ ] Environment variables configured
- [ ] MongoDB Atlas connection working
- [ ] CORS configured for frontend URL
- [ ] Error logging enabled
- [ ] Validation comprehensive

**Frontend:**

- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] API URL points to production backend
- [ ] No console.log statements
- [ ] No hardcoded credentials
- [ ] Build optimized (npm run build)

**General:**

- [ ] Documentation up to date
- [ ] README reflects current state
- [ ] No secrets in git
- [ ] Meaningful commit history

---

## 🔗 Important Files Reference

### Backend Key Files

| File                                   | Purpose                   |
| -------------------------------------- | ------------------------- |
| `src/app.ts`                           | Express app configuration |
| `src/server.ts`                        | Server entry point        |
| `src/routes/leads.routes.ts`           | API route definitions     |
| `src/controllers/leads.controllers.ts` | Business logic            |
| `src/models/lead.model.ts`             | MongoDB schema            |
| `src/validator/lead.validator.ts`      | Request validation        |
| `src/utils/AppError.ts`                | Error class               |
| `src/utils/AsyncHandler.ts`            | Async wrapper             |
| `src/middleware/error.middleware.ts`   | Error handling            |

### Frontend Key Files

| File                                | Purpose             |
| ----------------------------------- | ------------------- |
| `src/App.tsx`                       | Main app component  |
| `src/services/leadsService.ts`      | API client          |
| `src/features/leads/useLeads.ts`    | Data hook           |
| `src/features/leads/LeadsTable.tsx` | Main feature        |
| `src/ui/`                           | Reusable components |
| `src/types/lead.ts`                 | TypeScript types    |

---

## 💡 Quick Examples

### Adding a New Lead Field

**Step 1: Backend**

```typescript
// src/models/lead.model.ts
const leadSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  status: String,
  newField: String, // Add here
  createdAt: Date,
  updatedAt: Date,
});
```

**Step 2: Validator**

```typescript
// src/validator/lead.validator.ts
export const createLeadValidator = [
  body("newField")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Field is required"),
];
```

**Step 3: Controller**

```typescript
// src/controllers/leads.controllers.ts
const lead = await Lead.create({
  name,
  email,
  phone,
  status: req.body.status,
  newField: req.body.newField, // Add here
});
```

**Step 4: Frontend Types**

```typescript
// src/types/lead.ts
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  newField: string; // Add here
}
```

**Step 5: Frontend Form**

```typescript
// Update LeadFormModal to include new field
<input
  type="text"
  name="newField"
  placeholder="New Field"
  required
/>
```

---

## ✅ Feature Checklist

When adding a feature, verify:

- [ ] Backend route created
- [ ] Validation added
- [ ] Controller logic implemented
- [ ] Error handling in place
- [ ] Test written
- [ ] API tested with curl/Postman
- [ ] Frontend component created
- [ ] Frontend service method added
- [ ] TypeScript types defined
- [ ] Loading/error states handled
- [ ] Documentation updated
- [ ] No unrelated files modified

---

## 🎓 Learning Resources

### Understanding the Stack

- **Express:** [Express.js Guide](https://expressjs.com/)
- **Mongoose:** [Mongoose Documentation](https://mongoosejs.com/)
- **React:** [React Documentation](https://react.dev/)
- **TypeScript:** [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Vitest:** [Vitest Documentation](https://vitest.dev/)

### Project Architecture

- See this AGENT.md for architecture patterns
- Read README.md for API documentation
- Check existing code for implementation examples

---

## 📞 Getting Help

When stuck:

1. **Check existing code** - There's likely a similar example
2. **Read documentation** - API docs, TypeScript docs
3. **Check tests** - Tests show how things should work
4. **Search issues** - Other developers may have faced this
5. **Ask in comments** - Document your confusion for future you

---

## 🎯 Next Priority Tasks

Based on current project state:

1. **Frontend Testing** (In Progress)
   - Add Vitest + React Testing Library
   - Test components and hooks
   - Aim for 70% coverage

2. **Deployment Configuration** (Planned)
   - Setup Vercel for frontend
   - Setup Render for backend
   - Configure MongoDB Atlas

3. **Performance Optimization** (Future)
   - Add caching layer (Redis)
   - Optimize database queries
   - Monitor bundle size

4. **Advanced Features** (Future)
   - Bulk operations
   - Export functionality
   - Advanced filtering
   - User preferences

---

**Last Updated:** January 2024
**Version:** 1.0
**Status:** Active Development ✅

For the latest information, check the [GitHub repository](https://github.com/3narinder/lead-flow).

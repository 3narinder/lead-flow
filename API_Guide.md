# LeadFlow API Guide — Complete Usage Examples

This guide provides practical examples for using the LeadFlow API across different scenarios.

**Base URL:** `http://localhost:5000` (development)

---

## 📊 Table of Contents

1. [Getting Started](#-getting-started)
2. [Create Operations](#-create-operations)
3. [Read Operations](#-read-operations)
4. [Update Operations](#-update-operations)
5. [Delete Operations](#-delete-operations)
6. [Advanced Queries](#-advanced-queries)
7. [Error Handling](#-error-handling)
8. [Real-World Scenarios](#-real-world-scenarios)

---

## 🚀 Getting Started

### Prerequisites

```bash
# Backend running
cd backend && npm run dev
# Runs on http://localhost:5000

# Frontend running (optional)
cd frontend && npm run dev
# Runs on http://localhost:5173
```

### Testing API

**Option 1: cURL (Command Line)**

```bash
curl http://localhost:5000/health
```

**Option 2: Postman**

- Import API endpoints
- Set base URL to localhost:5000
- Send requests

**Option 3: Thunder Client (VS Code)**

- Extension available in VS Code
- Create requests visually

**Option 4: Fetch (JavaScript)**

```javascript
fetch("http://localhost:5000/api/leads")
  .then((r) => r.json())
  .then((data) => console.log(data));
```

---

## ✏️ Create Operations

### 1. Create a Single Lead

**Endpoint:** `POST /api/leads`

**Minimal Request (Required Fields Only):**

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }'
```

**Response:**

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
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

### 2. Create Lead with Initial Status

**Request with Status:**

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "8765432109",
    "status": "contacted"
  }'
```

### 3. Create Multiple Leads (Script)

**Bash Script:**

```bash
#!/bin/bash

# Create multiple leads
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/leads \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Lead $i\",
      \"email\": \"lead$i@example.com\",
      \"phone\": \"987654321$i\"
    }"
  echo "Created lead $i"
done
```

**JavaScript Script:**

```javascript
async function createMultipleLeads(count) {
  for (let i = 1; i <= count; i++) {
    const response = await fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        phone: `987654321${i}`,
      }),
    });

    const data = await response.json();
    console.log(`Created lead ${i}:`, data.data._id);
  }
}

// Create 10 leads
createMultipleLeads(10);
```

### 4. Validation Examples

**Missing Required Field:**

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com"
    # Missing phone
  }'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number is required"
    }
  ]
}
```

**Invalid Email:**

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "not-an-email",
    "phone": "1234567890"
  }'
```

**Invalid Phone (Not 10 Digits):**

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "phone": "123"
  }'
```

---

## 📖 Read Operations

### 1. Get All Leads (Default Pagination)

**Simple Request:**

```bash
curl http://localhost:5000/api/leads
```

**Response:**

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
    }
    // ... more leads
  ]
}
```

### 2. Search Leads

**Search by Name:**

```bash
curl "http://localhost:5000/api/leads?search=john"
```

**Search by Email:**

```bash
curl "http://localhost:5000/api/leads?search=john@example.com"
```

**Search by Phone:**

```bash
curl "http://localhost:5000/api/leads?search=9876543210"
```

**Search by Status:**

```bash
curl "http://localhost:5000/api/leads?search=qualified"
```

**Case-Insensitive Search:**

```bash
# All these return the same results
curl "http://localhost:5000/api/leads?search=JOHN"
curl "http://localhost:5000/api/leads?search=john"
curl "http://localhost:5000/api/leads?search=JoHn"
```

### 3. Filter by Status

**Single Status:**

```bash
# Get all "new" leads
curl "http://localhost:5000/api/leads?status=new"

# Get all "contacted" leads
curl "http://localhost:5000/api/leads?status=contacted"

# Get all "qualified" leads
curl "http://localhost:5000/api/leads?status=qualified"

# Get all "lost" leads
curl "http://localhost:5000/api/leads?status=lost"
```

### 4. Sorting

**Sort by Field:**

```bash
# Sort by name ascending
curl "http://localhost:5000/api/leads?sortBy=name&sortOrder=asc"

# Sort by name descending
curl "http://localhost:5000/api/leads?sortBy=name&sortOrder=desc"

# Sort by creation date (newest first)
curl "http://localhost:5000/api/leads?sortBy=createdAt&sortOrder=desc"

# Sort by creation date (oldest first)
curl "http://localhost:5000/api/leads?sortBy=createdAt&sortOrder=asc"

# Sort by email
curl "http://localhost:5000/api/leads?sortBy=email&sortOrder=asc"

# Sort by phone
curl "http://localhost:5000/api/leads?sortBy=phone&sortOrder=asc"

# Sort by status
curl "http://localhost:5000/api/leads?sortBy=status&sortOrder=asc"
```

### 5. Pagination

**First Page (Default):**

```bash
curl "http://localhost:5000/api/leads?page=1&limit=10"
```

**Second Page:**

```bash
curl "http://localhost:5000/api/leads?page=2&limit=10"
```

**Custom Page Size:**

```bash
# 20 leads per page
curl "http://localhost:5000/api/leads?page=1&limit=20"

# 50 leads per page
curl "http://localhost:5000/api/leads?page=1&limit=50"

# 100 leads per page
curl "http://localhost:5000/api/leads?page=1&limit=100"
```

### 6. Combined Queries

**Search + Filter:**

```bash
# Find "john" who are "qualified"
curl "http://localhost:5000/api/leads?search=john&status=qualified"
```

**Search + Filter + Sort:**

```bash
# Find "john" who are "qualified", sorted by name
curl "http://localhost:5000/api/leads?search=john&status=qualified&sortBy=name&sortOrder=asc"
```

**Search + Filter + Sort + Pagination:**

```bash
# Find "john" who are "qualified", sorted by name, page 2, 15 per page
curl "http://localhost:5000/api/leads?search=john&status=qualified&sortBy=name&sortOrder=asc&page=2&limit=15"
```

### 7. Real-World Search Scenarios

**Find High-Priority Leads (Qualified Status):**

```bash
curl "http://localhost:5000/api/leads?status=qualified&sortBy=createdAt&sortOrder=desc&limit=10"
```

**Find Recently Added Contacts:**

```bash
curl "http://localhost:5000/api/leads?sortBy=createdAt&sortOrder=desc&limit=20"
```

**Find Contacted Leads (For Follow-up):**

```bash
curl "http://localhost:5000/api/leads?status=contacted&sortBy=updatedAt&sortOrder=asc"
```

**Find Leads by Company Name Keyword:**

```bash
# If leads have "TechCorp" in their name
curl "http://localhost:5000/api/leads?search=TechCorp"
```

---

## 🔄 Update Operations

### 1. Update Lead Status to "Contacted"

**Request:**

```bash
curl -X PATCH http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "contacted",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### 2. Update to "Qualified"

```bash
curl -X PATCH http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "qualified"}'
```

### 3. Update to "Lost"

```bash
curl -X PATCH http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "lost"}'
```

### 4. Bulk Status Update Script

**Bash Script (Update Multiple Leads):**

```bash
#!/bin/bash

# Lead IDs to update
leads=("id1" "id2" "id3" "id4" "id5")
new_status="qualified"

for lead_id in "${leads[@]}"; do
  curl -X PATCH "http://localhost:5000/api/leads/$lead_id" \
    -H "Content-Type: application/json" \
    -d "{\"status\": \"$new_status\"}"
  echo "Updated lead $lead_id to $new_status"
done
```

**JavaScript Script:**

```javascript
async function bulkUpdateStatus(leadIds, newStatus) {
  for (const leadId of leadIds) {
    const response = await fetch(`http://localhost:5000/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();
    console.log(`Updated ${leadId}:`, data.data.status);
  }
}

// Usage
bulkUpdateStatus(["id1", "id2", "id3"], "qualified");
```

### 5. Invalid Status Handling

**Invalid Status (400 Bad Request):**

```bash
curl -X PATCH http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "invalid"}'
```

**Response:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "status",
      "message": "Status must be one of: new, contacted, qualified, lost"
    }
  ]
}
```

### 6. Invalid Lead ID (404 Not Found)

```bash
curl -X PATCH http://localhost:5000/api/leads/invalid-id-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "qualified"}'
```

**Response:**

```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

## 🗑️ Delete Operations

### 1. Delete a Lead

**Request:**

```bash
curl -X DELETE http://localhost:5000/api/leads/507f1f77bcf86cd799439011
```

**Response:**

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

### 2. Bulk Delete Script

**Delete Multiple Leads:**

```bash
#!/bin/bash

# Lead IDs to delete
leads=("id1" "id2" "id3")

for lead_id in "${leads[@]}"; do
  curl -X DELETE "http://localhost:5000/api/leads/$lead_id"
  echo "Deleted lead $lead_id"
done
```

### 3. Delete with Confirmation

**JavaScript (With Confirmation):**

```javascript
async function deleteLeadWithConfirmation(leadId) {
  const confirmed = confirm(
    "Are you sure you want to delete this lead? This cannot be undone.",
  );

  if (!confirmed) {
    console.log("Deletion cancelled");
    return;
  }

  const response = await fetch(`http://localhost:5000/api/leads/${leadId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (data.success) {
    console.log("Lead deleted:", data.data.name);
  } else {
    console.error("Delete failed:", data.message);
  }
}
```

---

## 🔍 Advanced Queries

### 1. Get Leads Needing Follow-Up

**Strategy:** Find "contacted" leads sorted by oldest first

```bash
curl "http://localhost:5000/api/leads?status=contacted&sortBy=updatedAt&sortOrder=asc&limit=20"
```

### 2. Daily Report Query

**Get leads from today, sorted by creation time:**

```bash
# Note: Requires backend to parse date range
# Current implementation doesn't support date range filtering
# But you can fetch and filter in frontend

curl "http://localhost:5000/api/leads?sortBy=createdAt&sortOrder=desc&limit=100"
```

### 3. Find Duplicates

**Search for similar emails:**

```bash
# Frontend would need to parse and compare
# This gets partial matches
curl "http://localhost:5000/api/leads?search=example.com"
```

### 4. Advanced Pagination with Frontend

**Get all leads in batches:**

```javascript
async function getAllLeads() {
  let allLeads = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `http://localhost:5000/api/leads?page=${page}&limit=100`,
    );

    const data = await response.json();
    allLeads = [...allLeads, ...data.data];

    hasMore = data.pagination.hasNextPage;
    page++;
  }

  return allLeads;
}
```

### 5. Search with Fuzzy Matching (Frontend Logic)

```javascript
async function fuzzySearchLeads(query) {
  const response = await fetch(
    `http://localhost:5000/api/leads?search=${query}`,
  );

  const data = await response.json();

  // Further filter on frontend if needed
  const filtered = data.data.filter((lead) => {
    return (
      lead.name.toLowerCase().includes(query.toLowerCase()) ||
      lead.email.toLowerCase().includes(query.toLowerCase())
    );
  });

  return filtered;
}
```

---

## ⚠️ Error Handling

### 1. Network Errors

```javascript
async function getLeadsWithErrorHandling() {
  try {
    const response = await fetch("http://localhost:5000/api/leads");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return { data: [], error: error.message };
  }
}
```

### 2. Validation Errors

```javascript
async function createLeadWithValidation(leadData) {
  try {
    const response = await fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    });

    const data = await response.json();

    if (!data.success) {
      // Handle validation errors
      if (data.errors) {
        data.errors.forEach((error) => {
          console.error(`${error.field}: ${error.message}`);
        });
      } else {
        console.error(data.message);
      }
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}
```

### 3. 404 Handling

```javascript
async function updateLeadWithErrorHandling(leadId, updates) {
  try {
    const response = await fetch(`http://localhost:5000/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.status === 404) {
      console.error("Lead not found");
      return null;
    }

    if (!data.success) {
      console.error(data.message);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}
```

---

## 🌍 Real-World Scenarios

### Scenario 1: Sales Pipeline Management

**Task:** Move qualified leads from "contacted" to "qualified"

```bash
#!/bin/bash

# Step 1: Get all contacted leads
echo "Fetching contacted leads..."
response=$(curl -s "http://localhost:5000/api/leads?status=contacted&limit=50")

# Step 2: Extract IDs using jq (install if needed: brew install jq)
# For this example, assume we get IDs manually or from frontend

# Step 3: Update each to qualified
lead_ids=$(echo $response | jq -r '.data[].\_id')

for id in $lead_ids; do
  echo "Updating $id to qualified..."
  curl -X PATCH "http://localhost:5000/api/leads/$id" \
    -H "Content-Type: application/json" \
    -d '{"status": "qualified"}'
done
```

### Scenario 2: Weekly Report Generation

**Task:** Get all leads created this week

```javascript
async function getWeeklyLeadsReport() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const response = await fetch(
    "http://localhost:5000/api/leads?sortBy=createdAt&sortOrder=desc&limit=100",
  );

  const data = await response.json();

  // Filter leads created in last week (frontend filtering)
  const weeklyLeads = data.data.filter((lead) => {
    const leadDate = new Date(lead.createdAt);
    return leadDate >= weekAgo;
  });

  // Group by status
  const report = {
    total: weeklyLeads.length,
    byStatus: {
      new: weeklyLeads.filter((l) => l.status === "new").length,
      contacted: weeklyLeads.filter((l) => l.status === "contacted").length,
      qualified: weeklyLeads.filter((l) => l.status === "qualified").length,
      lost: weeklyLeads.filter((l) => l.status === "lost").length,
    },
  };

  return report;
}
```

### Scenario 3: Lead Scoring

**Task:** Identify leads that need immediate action

```javascript
async function getLeadsNeedingAction() {
  const response = await fetch(
    "http://localhost:5000/api/leads?status=new,contacted&sortBy=createdAt&limit=100",
  );

  const data = await response.json();

  // Score leads based on status and age
  const scored = data.data.map((lead) => ({
    ...lead,
    score: calculateLeadScore(lead),
  }));

  // Sort by score (highest first)
  return scored.sort((a, b) => b.score - a.score);
}

function calculateLeadScore(lead) {
  let score = 0;

  // Status scoring
  const statusScores = {
    new: 30,
    contacted: 50,
    qualified: 100,
    lost: 0,
  };

  score += statusScores[lead.status] || 0;

  // Age scoring (older = more urgency for contact)
  const ageInDays = Math.floor(
    (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (ageInDays > 7) score += 20;
  if (ageInDays > 14) score += 30;

  return score;
}
```

---

## 📋 API Cheat Sheet

| Operation | Method | Endpoint                  | Example                                    |
| --------- | ------ | ------------------------- | ------------------------------------------ |
| Create    | POST   | `/api/leads`              | `POST /api/leads`                          |
| Read All  | GET    | `/api/leads`              | `GET /api/leads?page=1&limit=10`           |
| Search    | GET    | `/api/leads?search=value` | `GET /api/leads?search=john`               |
| Filter    | GET    | `/api/leads?status=value` | `GET /api/leads?status=qualified`          |
| Sort      | GET    | `/api/leads?sortBy=field` | `GET /api/leads?sortBy=name&sortOrder=asc` |
| Update    | PATCH  | `/api/leads/:id`          | `PATCH /api/leads/123`                     |
| Delete    | DELETE | `/api/leads/:id`          | `DELETE /api/leads/123`                    |
| Health    | GET    | `/health`                 | `GET /health`                              |

---

## 🎓 Quick Practice Tasks

1. **Create 5 test leads** with different statuses
2. **Search for a lead** by email
3. **Update a lead** from "new" to "qualified"
4. **Get page 2** of leads
5. **Sort leads** by name alphabetically
6. **Delete a lead** and verify it's gone
7. **Get all qualified leads** sorted newest first
8. **Count leads** by filtering and manual count
9. **Create a lead** with an invalid phone number (see error)
10. **Update a non-existent lead** (see 404 error)

---

**Happy API testing!** 🚀

import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

//* @POST /api/leads -> create successfully, validation errors, duplicate email
describe("POST /api/leads", () => {
  it("should create a new lead", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
    });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.name).toBe("John Doe");
    expect(response.body.data.email).toBe("john@example.com");
    expect(response.body.data.phone).toBe("9876543210");
    expect(response.body.data.status).toBe("new");
  });

  it("should create a lead with a provided status", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543211",
      status: "qualified",
    });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("qualified");
  });

  it("should reject a lead when name is missing", async () => {
    const response = await request(app).post("/api/leads").send({
      email: "missing-name@example.com",
      phone: "9876543212",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject an invalid email", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "Invalid Email",
      email: "invalid-email",
      phone: "9876543213",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject an invalid phone number", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "Invalid Phone",
      email: "invalid-phone@example.com",
      phone: "123",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject an invalid status", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "Invalid Status",
      email: "invalid-status@example.com",
      phone: "9876543214",
      status: "something-invalid",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject a duplicate email", async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    const firstResponse = await request(app).post("/api/leads").send({
      name: "First Lead",
      email,
      phone: "9876543215",
    });

    expect(firstResponse.status).toBe(201);

    const response = await request(app).post("/api/leads").send({
      name: "Second Lead",
      email,
      phone: "9876543216",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("A lead with this email already exists");
  });
});

//* @GET /api/leads -> fetch all leads, pagination, search */
describe("GET /api/leads", () => {
  it("should return a list of leads", async () => {
    const response = await request(app).get("/api/leads");

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);

    expect(response.body).toHaveProperty("pagination");

    expect(response.body.pagination).toHaveProperty("page");
    expect(response.body.pagination).toHaveProperty("limit");
    expect(response.body.pagination).toHaveProperty("totalLeads");
    expect(response.body.pagination).toHaveProperty("totalPages");
    expect(response.body.pagination).toHaveProperty("hasNextPage");
    expect(response.body.pagination).toHaveProperty("hasPreviousPage");
  });

  it("should return leads using pagination", async () => {
    const response = await request(app).get("/api/leads").query({
      page: 1,
      limit: 5,
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.pagination.page).toBe(1);

    expect(response.body.pagination.limit).toBe(5);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should search leads", async () => {
    const response = await request(app).get("/api/leads").query({
      search: "john",
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);

    expect(response.body.pagination).toHaveProperty("totalLeads");
  });

  it("should combine search and pagination", async () => {
    const response = await request(app).get("/api/leads").query({
      search: "john",
      page: 1,
      limit: 5,
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);

    expect(response.body.pagination.page).toBe(1);

    expect(response.body.pagination.limit).toBe(5);

    expect(response.body.pagination).toHaveProperty("totalLeads");

    expect(response.body.pagination).toHaveProperty("totalPages");
  });
});

//* @PATCH /api/leads/:id -> update lead status, invalid ID, non-existent lead, invalid status */
describe("PATCH /api/leads/:id", () => {
  it("should update the lead status", async () => {
    // Create a lead first so we have a real ID.
    const createResponse = await request(app).post("/api/leads").send({
      name: "Patch Test Lead",
      email: "patch-test@example.com",
      phone: "9876543210",
    });

    const leadId = createResponse.body.data._id;

    // Update the lead status.
    const response = await request(app).patch(`/api/leads/${leadId}`).send({
      status: "qualified",
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id).toBe(leadId);

    expect(response.body.data.status).toBe("qualified");
  });

  it("should reject an invalid lead ID", async () => {
    const response = await request(app).patch("/api/leads/invalid-id").send({
      status: "qualified",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should return 404 when the lead does not exist", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app).patch(`/api/leads/${fakeId}`).send({
      status: "qualified",
    });

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
  });

  it("should reject an invalid status", async () => {
    const createResponse = await request(app).post("/api/leads").send({
      name: "Invalid Status Lead",
      email: "invalid-status-patch@example.com",
      phone: "9876543211",
    });

    const leadId = createResponse.body.data._id;

    const response = await request(app).patch(`/api/leads/${leadId}`).send({
      status: "invalid-status",
    });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject a request when status is missing", async () => {
    const createResponse = await request(app).post("/api/leads").send({
      name: "Missing Status Lead",
      email: "missing-status-patch@example.com",
      phone: "9876543212",
    });

    const leadId = createResponse.body.data._id;

    const response = await request(app).patch(`/api/leads/${leadId}`).send({});

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });
});

//* @DELETE /api/leads/:id -> delete lead, invalid ID, non-existent lead */
describe("DELETE /api/leads/:id", () => {
  it("should delete an existing lead", async () => {
    //* Create a lead first.
    const createResponse = await request(app).post("/api/leads").send({
      name: "Delete Test Lead",
      email: "delete-test@example.com",
      phone: "9876543213",
    });

    const leadId = createResponse.body.data._id;

    //* Delete the lead.
    const response = await request(app).delete(`/api/leads/${leadId}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("Lead deleted successfully");

    expect(response.body.data._id).toBe(leadId);
  });

  it("should reject an invalid lead ID", async () => {
    const response = await request(app).delete("/api/leads/invalid-id");

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should return 404 when the lead does not exist", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app).delete(`/api/leads/${fakeId}`);

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
  });
});

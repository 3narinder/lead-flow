import type {
  Lead,
  LeadFormValues,
  LeadStatus,
  BackendLead,
} from "../types/lead";

const API_URL = "http://localhost:5000/api/leads";

export interface GetLeadsParams {
  search?: string;
  status?: LeadStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface GetLeadsResponse {
  success: boolean;

  pagination: {
    page: number;
    limit: number;
    totalLeads: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  data: Lead[];
}

// GET
export const getLeads = async (
  params: GetLeadsParams,
): Promise<GetLeadsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.set("sortOrder", params.sortOrder);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const response = await fetch(`${API_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  const result = await response.json();

  return {
    ...result,
    data: result.data.map((lead: BackendLead) => ({
      ...lead,
      id: lead._id,
    })),
  };
};

// CREATE
export const createLead = async (values: LeadFormValues): Promise<Lead> => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Failed to create lead");
  }

  const result = await response.json();

  return result.data;
};

// UPDATE
export const updateLead = async (
  id: string,
  values: LeadFormValues,
): Promise<Lead> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Failed to update lead");
  }

  const result = await response.json();

  return result.data;
};

// DELETE
export const deleteLead = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete lead");
  }
};

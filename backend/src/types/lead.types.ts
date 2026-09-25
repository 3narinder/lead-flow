//* Defines the allowed lead status values.
export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

//* Data required when creating a lead.
export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

//* Data required when updating a lead's status.
export interface UpdateLeadStatusInput {
  status: LeadStatus;
}

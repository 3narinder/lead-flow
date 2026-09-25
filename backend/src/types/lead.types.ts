export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface UpdateLeadStatusInput {
  status: LeadStatus;
}

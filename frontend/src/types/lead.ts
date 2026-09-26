export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export interface BackendLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

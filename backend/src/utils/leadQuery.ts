import { SortOrder } from "mongoose";
import { LeadStatus } from "../types/lead.types.js";

// * Type for MongoDB lead filters.

type LeadFilter = {
  status?: LeadStatus;

  $or?: Array<{
    name?: {
      $regex: string;
      $options: string;
    };

    email?: {
      $regex: string;
      $options: string;
    };

    phone?: {
      $regex: string;
      $options: string;
    };

    status?: {
      $regex: string;
      $options: string;
    };
  }>;
};

// * Fields allowed for sorting.

const ALLOWED_SORT_FIELDS = [
  "name",
  "email",
  "phone",
  "status",
  "createdAt",
  "updatedAt",
] as const;

type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

//* Check whether a value is a valid LeadStatus.

export const isLeadStatus = (status: string): status is LeadStatus => {
  return ["new", "contacted", "qualified", "lost"].includes(status);
};

// * Build search and status filters.

export const buildLeadFilter = (
  search: string,
  status: LeadStatus | "",
): LeadFilter => {
  const filter: LeadFilter = {};

  //* Exact status filter
  if (status) {
    filter.status = status;
  }

  //* Search across name, email, phone and status
  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
      {
        status: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return filter;
};

// * Build sort object.
export const buildLeadSort = (
  sortBy: string,
  sortOrder: string,
): Record<string, SortOrder> => {
  const field: SortField = ALLOWED_SORT_FIELDS.includes(sortBy as SortField)
    ? (sortBy as SortField)
    : "createdAt";

  const order: SortOrder = sortOrder === "asc" ? 1 : -1;

  return {
    [field]: order,
  };
};

// * Build pagination values.
export const getPagination = (pageQuery: string, limitQuery: string) => {
  const page = Number(pageQuery);
  const limit = Number(limitQuery);

  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

  const currentLimit =
    Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 10;

  const skip = (currentPage - 1) * currentLimit;

  return {
    page: currentPage,
    limit: currentLimit,
    skip,
  };
};

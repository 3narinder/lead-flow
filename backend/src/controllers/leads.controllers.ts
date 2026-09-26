import { Request, Response } from "express";

import mongoose from "mongoose";
import Lead from "../models/lead.model.js";

import { CreateLeadInput, UpdateLeadStatusInput } from "../types/lead.types.js";

import { AppError } from "../utils/AppError.js";
import {
  buildLeadFilter,
  buildLeadSort,
  getPagination,
  isLeadStatus,
} from "../utils/leadQuery.js";

//* Check whether the provided ID is a valid MongoDB ObjectId

const isValidObjectId = (id: string | string[] | undefined): id is string => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
};

//* @POST /api/leads
//* Create a new lead
export const createLead = async (req: Request, res: Response) => {
  const { name, email, phone }: CreateLeadInput = req.body;

  const lead = await Lead.create({
    name,
    email,
    phone,
    status: req.body.status,
  });

  return res.status(201).json({
    success: true,
    data: lead,
  });
};

//* @GET /api/leads
//* Get leads with search, status filtering, sorting and pagination

export const getLeads = async (req: Request, res: Response) => {
  // * Search
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  //* Status
  const statusQuery =
    typeof req.query.status === "string" ? req.query.status.trim() : "";

  //* Validate status
  const status = isLeadStatus(statusQuery) ? statusQuery : "";

  //* Sorting
  const sortBy =
    typeof req.query.sortBy === "string" ? req.query.sortBy.trim() : "";

  const sortOrder =
    typeof req.query.sortOrder === "string" ? req.query.sortOrder.trim() : "";

  //* Pagination
  const page = typeof req.query.page === "string" ? req.query.page : "";

  const limit = typeof req.query.limit === "string" ? req.query.limit : "";

  //* Build query pieces
  const filter = buildLeadFilter(search, status);

  const sort = buildLeadSort(sortBy, sortOrder);

  const pagination = getPagination(page, limit);

  //* Get leads and total count at the same time.
  const [leads, totalLeads] = await Promise.all([
    Lead.find(filter).sort(sort).skip(pagination.skip).limit(pagination.limit),

    Lead.countDocuments(filter),
  ]);

  //* Calculate total pages.
  const totalPages = Math.ceil(totalLeads / pagination.limit);

  //* Send response.
  return res.status(200).json({
    success: true,

    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalLeads,
      totalPages,

      hasNextPage: pagination.page < totalPages,

      hasPreviousPage: pagination.page > 1,
    },

    data: leads,
  });
};

//* @PATCH /api/leads/:id
//* Update a lead's status

export const updateLeadStatus = async (req: Request, res: Response) => {
  const leadId = req.params.id;

  //* Validate MongoDB ObjectId.
  if (!isValidObjectId(leadId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lead ID",
    });
  }

  const { status }: UpdateLeadStatusInput = req.body;

  const lead = await Lead.findByIdAndUpdate(
    leadId,
    { status },
    {
      new: true,
      runValidators: true,
    },
  );

  //* A valid MongoDB ID does not necessarily mean that a lead exists.
  if (!lead) {
    throw AppError("Lead not found", 404);
  }

  return res.status(200).json({
    success: true,
    data: lead,
  });
};

//* @DELETE /api/leads/:id
//* Delete a lead

export const deleteLead = async (req: Request, res: Response) => {
  const leadId = req.params.id;

  //* Validate the MongoDB ObjectId before querying.

  if (!isValidObjectId(leadId)) {
    throw AppError("Invalid lead ID", 400);
  }

  const lead = await Lead.findByIdAndDelete(leadId);

  //* The ID can be valid but the lead may not exist.
  if (!lead) {
    throw AppError("Lead not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Lead deleted successfully",
    data: lead,
  });
};

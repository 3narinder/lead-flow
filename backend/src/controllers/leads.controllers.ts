import { Request, Response } from "express";

import mongoose from "mongoose";
import Lead from "../models/lead.model.js";

import { CreateLeadInput, UpdateLeadStatusInput } from "../types/lead.types.js";

import { AppError } from "../utils/AppError.js";

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

//* --------------------------------------------------
//* @GET /api/leads
//* Get leads with search, sorting and pagination
//* --------------------------------------------------

export const getLeads = async (req: Request, res: Response) => {
  //* ----------------------------------------------
  //* Search
  //* ----------------------------------------------

  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  //* ----------------------------------------------
  //* Pagination
  //* ----------------------------------------------

  const page = typeof req.query.page === "string" ? Number(req.query.page) : 1;

  //* Limit the number of leads returned per page to a maximum of 100. Default is 10.
  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

  //* Make sure page and limit are valid numbers and page is a positive integer.
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

  //* Make sure limit is a positive integer and doesn't exceed 100.
  const currentLimit =
    Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 10;

  //* Number of documents to skip
  const skip = (currentPage - 1) * currentLimit;

  //* ----------------------------------------------
  //* Build search filter
  //* ----------------------------------------------

  const filter: Record<string, unknown> = {};

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

  //* ----------------------------------------------
  //* Get leads + total count
  //* ----------------------------------------------
  //* Run both database operations at the same time
  //* Query 1: Get the current page of leads.
  //* Query 2: Count all matching leads.

  const [leads, totalLeads] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(currentLimit),

    Lead.countDocuments(filter),
  ]);

  //* Calculate total number of pages.
  const totalPages = Math.ceil(totalLeads / currentLimit);

  return res.status(200).json({
    success: true,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      totalLeads,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
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

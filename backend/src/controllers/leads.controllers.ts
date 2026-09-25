import { Request, Response } from "express";
import mongoose from "mongoose";
import { CreateLeadInput, UpdateLeadStatusInput } from "../types/lead.types.js";
import Lead from "../models/lead.model.js";

//* Check whether the provided ID is a valid MongoDB ObjectId

const isValidObjectId = (id: string | string[] | undefined): id is string => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
};

//* POST /api/leads
//* Create a new lead
export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone }: CreateLeadInput = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
    });

    return res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    /*
     * MongoDB duplicate key error: The email field is unique in the Lead model. If a user tries to create another lead with the same email, MongoDB returns error code 11000.
     */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A lead with this email already exists",
      });
    }

    /*
     * Mongoose validation error: This can happen when the data does not satisfy the validation rules defined in the Lead schema. */
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    /*
     * Any unexpected database/server error. */
    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
    });
  }
};

//* --------------------------------------------------
//* GET /api/leads
//* Get leads with search and pagination
//*
//* Examples:
//* GET /api/leads
//* GET /api/leads?search=john
//* GET /api/leads?page=2&limit=10
//* GET /api/leads?search=gmail&page=2&limit=5
//* --------------------------------------------------

export const getLeads = async (req: Request, res: Response) => {
  try {
    //* ----------------------------------------------
    //* Search
    //* ----------------------------------------------

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    //* ----------------------------------------------
    //* Pagination
    //* ----------------------------------------------

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    //* Make sure page and limit are valid numbers
    const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

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

    const [leads, totalLeads] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(currentLimit),

      Lead.countDocuments(filter),
    ]);

    //* ----------------------------------------------
    //* Pagination information
    //* ----------------------------------------------

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
  } catch (error) {
    console.error("Error fetching leads:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

//* PATCH /api/leads/:id
//* Update a lead's status

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const leadId = req.params.id;

    /*
     * Check the MongoDB ObjectId before querying. Without this check, an invalid ID can result in a Mongoose CastError.
     */
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

    /*
     * A valid MongoDB ID does not necessarily mean that a lead exists.
     */
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    console.error("Error updating lead status:", error);

    /*
     * Mongoose validation error. For example, if an invalid status is provided.
     */
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update lead status",
    });
  }
};

//* DELETE /api/leads/:id
//* Delete a lead

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const leadId = req.params.id;

    /*
     * Validate the MongoDB ObjectId before querying.
     */
    if (!isValidObjectId(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findByIdAndDelete(leadId);

    /*
     * The ID can be valid but the lead may not exist.
     */
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error deleting lead:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
    });
  }
};

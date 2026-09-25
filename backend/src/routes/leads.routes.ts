import express from "express";
import {
  createLead,
  deleteLead,
  getLeads,
  updateLeadStatus,
} from "../controllers/leads.controllers.js";
import {
  createLeadValidator,
  updateLeadStatusValidator,
} from "../validator/lead.validator.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/", createLeadValidator, handleValidationErrors, createLead);
router.get("/", getLeads);
router.patch(
  "/:id",
  updateLeadStatusValidator,
  handleValidationErrors,
  updateLeadStatus,
);
router.delete("/:id", deleteLead);

export default router;

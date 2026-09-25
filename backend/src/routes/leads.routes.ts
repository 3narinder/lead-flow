import express from "express";

import {
  createLeadValidator,
  updateLeadStatusValidator,
} from "../validator/lead.validator.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  createLead,
  deleteLead,
  getLeads,
  updateLeadStatus,
} from "../controllers/leads.controllers.js";

const router = express.Router();

router.post(
  "/",
  createLeadValidator,
  handleValidationErrors,
  asyncHandler(createLead),
);
router.get("/", asyncHandler(getLeads));
router.patch(
  "/:id",
  updateLeadStatusValidator,
  handleValidationErrors,
  asyncHandler(updateLeadStatus),
);
router.delete("/:id", asyncHandler(deleteLead));

export default router;

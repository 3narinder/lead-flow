import { body } from "express-validator";

export const createLeadValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain 10 digits"),

  body("status")
    .optional()
    .isIn(["new", "contacted", "qualified", "lost"])
    .withMessage("Invalid lead status"),
];

export const updateLeadStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["new", "contacted", "qualified", "lost"])
    .withMessage("Invalid lead status"),
];

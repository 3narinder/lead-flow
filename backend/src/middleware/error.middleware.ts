import { Request, Response, NextFunction } from "express";
import { AppErrorType } from "../types/error.types.js";
/*
 * Centralized Express error-handling middleware. Every error forwarded using next(error) eventually reaches this function.
 */

export const errorHandler = (
  error: Error | AppErrorType,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error);

  //* Handle errors intentionally created by our application.
  if ("statusCode" in error && error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  //* Anything that reaches this point is an unexpected server/programming error.
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

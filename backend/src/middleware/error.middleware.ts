import { Request, Response, NextFunction } from "express";
import { AppErrorType } from "../types/error.types.js";

export const errorHandler = (
  error: Error | AppErrorType,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error);

  if ("statusCode" in error && error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

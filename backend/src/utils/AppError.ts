import { AppErrorType } from "../types/error.types.js";

export const AppError = (message: string, statusCode: number): AppErrorType => {
  const error = new Error(message) as AppErrorType;

  error.statusCode = statusCode;
  error.isOperational = true;

  return error;
};

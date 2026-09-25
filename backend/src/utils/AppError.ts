import { AppErrorType } from "../types/error.types.js";

/*
 *Creates an application-level error.We use a function instead of a class because this project follows a functional approach.
 */

export const AppError = (message: string, statusCode: number): AppErrorType => {
  const error = new Error(message) as AppErrorType;

  error.statusCode = statusCode;
  error.isOperational = true;

  return error;
};

//* Describes the structure of our custom application errors.
export interface AppErrorType extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface AppErrorType extends Error {
  statusCode: number;
  isOperational: boolean;
}

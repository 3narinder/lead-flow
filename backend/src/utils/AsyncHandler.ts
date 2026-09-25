import { Request, Response, NextFunction } from "express";

/*
 * Represents the shape of an async Express controller. Our controllers use async/await, so they return a Promise.
 */
type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

/*
 * Wraps an async controller and forwards rejected promises to Express's error middleware. This prevents every controller from needing its own repetitive try/catch block.
 */
export const asyncHandler = (controller: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //* Execute the controller.If the controller throws an error or  its promise rejects, .catch(next) forwards that error to Express.
    Promise.resolve(controller(req, res, next)).catch(next);
  };
};

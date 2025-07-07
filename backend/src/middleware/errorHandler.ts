import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR LOGGED: ", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "An unexpected error occurred";

  res.status(statusCode).json({
    error: message,
  });
};

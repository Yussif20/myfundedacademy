import { env } from "@/env";
import AppError from "@/helpers/errors/AppError";
import handleZodError from "@/helpers/errors/handleZodError";
import { logger } from "@/utils/logger";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: Record<string, any> = {};

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (err?.code === "P2002") {
    statusCode = 409;
    const field = err.meta?.target?.join(", ") || "unknown field";
    message = `Duplicate value exists for: ${field}.`;
    errorDetails =
      env.NODE_ENV === "development" ? { code: err.code, target: err.meta?.target } : {};
  } else if (err?.code === "P2003") {
    statusCode = 400;
    message = "Invalid reference: a related record was not found.";
    errorDetails = env.NODE_ENV === "development" ? { code: err.code, meta: err.meta } : {};
  } else if (err?.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
    errorDetails = env.NODE_ENV === "development" ? { code: err.code, cause: err.meta?.cause } : {};
  } else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided.";
    errorDetails = env.NODE_ENV === "development" ? { message: err.message } : {};
  } else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Database operation failed. Please check your request.";
    errorDetails = env.NODE_ENV === "development" ? { code: err.code, meta: err.meta } : {};
  } else if (err instanceof PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "An unexpected error occurred. Please try again later.";
    errorDetails = env.NODE_ENV === "development" ? { error: err.message } : {};
  } else if (err instanceof AppError) {
    statusCode = err.statusCode || 500;
    message = err.message || "Application error occurred.";
    errorDetails =
      env.NODE_ENV === "development" ? { stack: err.stack, ...(err.data || {}) } : err.data || {};
  } else if (err?.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON format in request body.";
    errorDetails = {
      issues: [
        {
          path: "body",
          message: "The server could not parse your input. Please provide valid JSON.",
        },
      ],
    };
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again.";
    errorDetails = env.NODE_ENV === "development" ? { stack: err.stack } : {};
  } else if (err instanceof Error) {
    statusCode = (err as any)?.statusCode || 500;
    message = err.message || "An unexpected error occurred.";
    errorDetails = env.NODE_ENV === "development" ? { stack: err.stack } : {};
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errorDetails,
  });

  let logType: "success" | "warning" | "error" | "info" = "info";
  if (statusCode >= 500) logType = "error";
  else if (statusCode >= 400) logType = "warning";

  logger[logType](`${statusCode} ${message}`, { type: "ERROR" });
  logger.info(`${req.method} ${req.url}`, { type: "Request" });
};

export default errorMiddleware;

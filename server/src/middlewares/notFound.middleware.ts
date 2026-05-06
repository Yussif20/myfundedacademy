import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFoundMiddleware = (req: Request, res: Response, _next: NextFunction) => {
  logger.warning("Path not found: " + req.originalUrl);

  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
};

export default notFoundMiddleware;

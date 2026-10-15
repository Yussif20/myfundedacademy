import { env } from "@/env";
import sendResponse from "@/utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const rootMiddleware = async (_req: Request, res: Response, _next: NextFunction) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Nibras API is running",
    data: {
      server_url: env.SERVER_URL,
      version: "v1",
    },
  });
};

export default rootMiddleware;

import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "@/env";
import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { logger } from "@/utils/logger";
import httpStatus from "http-status";
import { resetDemoData } from "./demo.seed";

const digest = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time comparison; false when the endpoint is disabled. */
export const isValidResetSecret = (provided: unknown, expected = env.DEMO_RESET_SECRET): boolean => {
  if (!expected || typeof provided !== "string" || !provided) return false;
  return timingSafeEqual(digest(provided), digest(expected));
};

export const DemoController = {
  reset: catchAsync(async (req, res) => {
    if (!env.DEMO_RESET_SECRET) throw new AppError(httpStatus.NOT_FOUND, "Not found.");
    if (!isValidResetSecret(req.headers["x-demo-reset-secret"])) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid reset secret.");
    }
    const summary = await resetDemoData(prisma);
    logger.info(`Demo data reset in ${summary.ms}ms`, { type: "DEMO" });
    sendResponse(res, { statusCode: httpStatus.OK, message: "Demo data reset.", data: summary });
  }),
};

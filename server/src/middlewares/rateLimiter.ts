import AppError from "@/helpers/errors/AppError";
import rateLimit from "express-rate-limit";
import httpStatusCode from "http-status";

const rateLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiterMiddleware;

export const requestsLimiter = (timeSec = 10, limit = 50, message?: string) =>
  rateLimit({
    windowMs: timeSec * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: any) => {
      const retryAfter = Math.ceil(
        ((req.rateLimit?.resetTime?.getTime() ?? Date.now()) - Date.now()) / 1000,
      );
      throw new AppError(
        httpStatusCode.TOO_MANY_REQUESTS,
        message || `Too many requests. Try again in ${retryAfter} seconds.`,
        { errorType: "rate_limit", remainingTime: retryAfter },
      );
    },
  });

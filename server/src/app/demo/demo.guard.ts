import AppError from "@/helpers/errors/AppError";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { demoBlockReason } from "./demo.policy";

const DEMO_EMAIL = /@example\.com$/i;
const HIDDEN_EMAIL = "hidden@example.com";

/**
 * Replaces every non-demo `email` field in a JSON payload, so the public demo
 * accounts (notably the read-only admin) never see real users' addresses.
 */
export const redactEmails = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(redactEmails);
  if (value instanceof Date || value === null || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = k === "email" && typeof v === "string" && !DEMO_EMAIL.test(v) ? HIDDEN_EMAIL : redactEmails(v);
  }
  return out;
};

/**
 * Mounted in front of every /api/v1 route. Non-demo sessions pass straight
 * through; demo sessions (access token carries `demo: true`) are checked
 * against demoBlockReason and get real users' emails redacted.
 */
export const demoGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isDemo) return next();
  const reason = demoBlockReason({
    method: req.method,
    path: req.path,
    role: req.user.role,
    body: req.body,
  });
  if (reason) return next(new AppError(httpStatus.FORBIDDEN, reason, { demo: true }));

  const json = res.json.bind(res);
  res.json = (body: unknown) => json(redactEmails(JSON.parse(JSON.stringify(body ?? null))));
  return next();
};

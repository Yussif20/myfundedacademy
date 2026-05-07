import { ServerError_T } from "@/types";

/** Extracts a user-friendly message from an RTK Query error. */
export function extractApiError(err: unknown, fallback = "Something went wrong."): string {
  if (!err || typeof err !== "object") return fallback;
  const e = err as { data?: ServerError_T; status?: number; error?: string };
  if (e.data?.message) return e.data.message;
  if (e.error) return e.error;
  if (typeof e.status === "number") return `Request failed (${e.status}).`;
  return fallback;
}

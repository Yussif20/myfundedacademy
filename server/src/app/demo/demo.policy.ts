import { UserRoleEnum } from "@prisma/client";

export type DemoRequest = {
  method: string;
  /** Path relative to /api/v1, e.g. "/courses/abc/publish". */
  path: string;
  role: UserRoleEnum;
  body?: unknown;
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** PATCH /users/me may only switch the UI language. */
const PROFILE_KEYS_ALLOWED = new Set(["preferredLocale"]);

/**
 * Decides whether a write from a demo session is allowed. Returns a
 * user-facing reason when it is blocked, or null when it may proceed.
 *
 * The demo data is reset nightly, so ordinary learning and authoring flows
 * (progress, quizzes, reviews, Stripe test checkout, editing your own course)
 * stay open. Anything that changes identity, removes shared data, publishes,
 * or stores files is blocked. The demo admin is read-only.
 */
export const demoBlockReason = (req: DemoRequest): string | null => {
  const method = req.method.toUpperCase();
  if (SAFE_METHODS.has(method)) return null;

  const path = req.path.replace(/\/+$/, "") || "/";
  if (path === "/auth/logout") return null;

  if (req.role === "ADMIN") return "The demo admin account is read-only.";

  if (path === "/users/me/change-password") {
    return "Password changes are disabled in the demo.";
  }
  if (path === "/users/me" && method === "PATCH") {
    const keys = Object.keys((req.body as Record<string, unknown>) ?? {});
    return keys.every((k) => PROFILE_KEYS_ALLOWED.has(k))
      ? null
      : "Profile changes are disabled in the demo.";
  }
  if (path === "/instructors/me") return "Profile changes are disabled in the demo.";
  if (path.startsWith("/users") || path.startsWith("/instructors")) {
    return "Account management is disabled in the demo.";
  }
  if (path.startsWith("/uploads/")) return "File uploads are disabled in the demo.";

  // Courses: /courses/:id (DELETE) and /courses/:id/publish|unpublish.
  // Section, lesson and attachment edits on your own course stay allowed.
  const course = path.match(/^\/courses\/([^/]+)(?:\/(publish|unpublish))?$/);
  if (course && course[1] !== "sections" && course[1] !== "lessons") {
    if (method === "DELETE") return "Deleting courses is disabled in the demo.";
    if (course[2]) return "Publishing and unpublishing are disabled in the demo.";
  }

  if (method === "DELETE" && /^\/reviews\/[^/]+$/.test(path)) {
    return "Deleting reviews is disabled in the demo.";
  }
  if (method === "DELETE" && path.startsWith("/quizzes/")) {
    return "Deleting quizzes is disabled in the demo.";
  }
  if (path.startsWith("/categories")) return "Category management is disabled in the demo.";

  return null;
};

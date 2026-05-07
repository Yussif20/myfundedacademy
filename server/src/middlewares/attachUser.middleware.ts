import { verifyAccessToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";

/**
 * Optional-auth: decodes Bearer token if present and attaches req.user,
 * but does NOT reject unauthenticated requests. Use this on public-facing
 * endpoints whose response shape changes based on caller's role.
 */
const attachUser = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!bearer) return next();
  try {
    const payload = verifyAccessToken(bearer);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    // Invalid/expired token — proceed as anonymous.
  }
  return next();
};

export default attachUser;

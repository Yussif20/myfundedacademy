import { Response } from "express";
import { env } from "@/env";
import { parseDuration } from "./tokens";

export const REFRESH_COOKIE_NAME = "nb_rt";

// In dev: Lax (works on localhost, http allowed).
// In prod: None+Secure (frontend and API are on different origins —
// e.g. *.vercel.app and *.onrender.com — so the cookie has to opt in
// to cross-site sending. None requires Secure, which we set).
const cookieOptions = () => ({
  httpOnly: true as const,
  secure: env.NODE_ENV !== "development",
  sameSite: env.NODE_ENV === "development" ? ("lax" as const) : ("none" as const),
  path: "/api/v1/auth",
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
});

export const setRefreshCookie = (res: Response, token: string) => {
  const maxAge = parseDuration(env.JWT_REFRESH_EXPIRES_IN);
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...cookieOptions(),
    maxAge,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions());
};

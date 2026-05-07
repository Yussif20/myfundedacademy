import { Response } from "express";
import { env } from "@/env";
import { parseDuration } from "./tokens";

export const REFRESH_COOKIE_NAME = "mfa_rt";

export const setRefreshCookie = (res: Response, token: string) => {
  const maxAge = parseDuration(env.JWT_REFRESH_EXPIRES_IN);
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV !== "development",
    sameSite: env.NODE_ENV === "development" ? "lax" : "strict",
    maxAge,
    path: "/api/v1/auth",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV !== "development",
    sameSite: env.NODE_ENV === "development" ? "lax" : "strict",
    path: "/api/v1/auth",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  });
};

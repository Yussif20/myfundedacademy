import AppError from "@/helpers/errors/AppError";
import { verifyAccessToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { UserRoleEnum } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRoleEnum;
    };
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!bearer) {
    return next(new AppError(httpStatus.UNAUTHORIZED, "Authentication required."));
  }

  try {
    const payload = verifyAccessToken(bearer);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "Access token expired.", {
          accessTokenExpired: true,
        }),
      );
    }
    if (err instanceof JsonWebTokenError) {
      return next(new AppError(httpStatus.UNAUTHORIZED, "Invalid access token."));
    }
    return next(err);
  }
};

export const requireRole =
  (...roles: UserRoleEnum[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(httpStatus.UNAUTHORIZED, "Authentication required."));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(httpStatus.FORBIDDEN, "You do not have permission for this action."),
      );
    }
    return next();
  };

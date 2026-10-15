import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "@/env";
import { UserRoleEnum } from "@prisma/client";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRoleEnum;
  /** Set for seeded demo accounts; the demo guard keys off this. */
  demo?: boolean;
};

export type RefreshTokenPayload = {
  sub: string;
  jti: string;
};

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);

export const signRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;

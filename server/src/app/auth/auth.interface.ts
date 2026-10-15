import { UserRoleEnum } from "@prisma/client";

export type SafeUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRoleEnum;
  preferredLocale: string;
  isEmailVerified: boolean;
  isDemo: boolean;
  bio: string;
  country: string;
  profile: string;
  createdAt: Date;
};

export type SignupInput = {
  fullName: string;
  email: string;
  password: string;
  country?: string;
  preferredLocale?: "en" | "ar";
};

export type LoginInput = {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
};

export type LoginResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

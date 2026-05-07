import { UserRoleEnum, UserStatus } from "@prisma/client";

export type UpdateMeInput = {
  fullName?: string;
  bio?: string;
  country?: string;
  profile?: string;
  preferredLocale?: "en" | "ar";
};

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  role?: UserRoleEnum;
  country?: string;
  bio?: string;
  preferredLocale?: "en" | "ar";
};

export type UpdateUserInput = {
  fullName?: string;
  role?: UserRoleEnum;
  status?: UserStatus;
  bio?: string;
  country?: string;
};

export type ListUsersQuery = {
  page: number;
  limit: number;
  role?: UserRoleEnum;
  search?: string;
};

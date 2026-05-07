import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password is too long.");

export const UsersValidation = {
  updateMe: z.object({
    body: z.object({
      fullName: z.string().min(2).max(120).optional(),
      bio: z.string().max(500).optional(),
      country: z.string().max(80).optional(),
      profile: z.string().max(500).optional(),
      preferredLocale: z.enum(["en", "ar"]).optional(),
    }),
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, "Current password is required."),
      newPassword: passwordSchema,
    }),
  }),

  // Admin
  listUsers: z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(20),
      role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).optional(),
      search: z.string().optional(),
    }),
  }),

  createUser: z.object({
    body: z.object({
      fullName: z.string().min(2).max(120),
      email: z.string().email().toLowerCase().trim(),
      password: passwordSchema,
      role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).optional().default("STUDENT"),
      country: z.string().max(80).optional().default(""),
      bio: z.string().max(500).optional().default(""),
      preferredLocale: z.enum(["en", "ar"]).optional().default("en"),
    }),
  }),

  updateUser: z.object({
    params: z.object({ id: z.string().uuid("Invalid user id.") }),
    body: z.object({
      fullName: z.string().min(2).max(120).optional(),
      role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).optional(),
      status: z.enum(["ACTIVE", "SUSPENDED", "DELETED"]).optional(),
      bio: z.string().max(500).optional(),
      country: z.string().max(80).optional(),
    }),
  }),

  deleteUser: z.object({
    params: z.object({ id: z.string().uuid("Invalid user id.") }),
  }),
};

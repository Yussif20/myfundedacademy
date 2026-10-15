import { z } from "zod";

const localeSchema = z.enum(["en", "ar"]).optional().default("en");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password is too long.");

export const AuthValidation = {
  signup: z.object({
    body: z.object({
      fullName: z.string().min(2, "Name must be at least 2 characters.").max(120),
      email: z.string().email("Invalid email address.").toLowerCase().trim(),
      password: passwordSchema,
      country: z.string().max(80).optional().default(""),
      preferredLocale: localeSchema,
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email("Invalid email address.").toLowerCase().trim(),
      password: z.string().min(1, "Password is required."),
    }),
  }),

  demoLogin: z.object({
    body: z.object({
      role: z.enum(["student", "instructor", "admin"]),
    }),
  }),

  verifyEmail: z.object({
    body: z.object({
      token: z.string().min(10, "Verification token is required."),
    }),
  }),

  resendVerification: z.object({
    body: z.object({
      email: z.string().email("Invalid email address.").toLowerCase().trim(),
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: z.string().email("Invalid email address.").toLowerCase().trim(),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string().min(10, "Reset token is required."),
      password: passwordSchema,
    }),
  }),
};

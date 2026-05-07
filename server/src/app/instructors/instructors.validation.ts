import { z } from "zod";

export const InstructorsValidation = {
  list: z.object({
    query: z.object({
      featured: z.coerce.boolean().optional(),
    }),
  }),

  get: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),

  create: z.object({
    body: z.object({
      email: z.string().email().toLowerCase().trim(),
      fullName: z.string().min(2).max(120),
      password: z.string().min(8).max(128),
      country: z.string().max(80).optional().default(""),
      preferredLocale: z.enum(["en", "ar"]).optional().default("en"),

      headline: z.string().max(160).optional().default(""),
      headlineArabic: z.string().max(160).optional().default(""),
      bio: z.string().max(2000).optional().default(""),
      bioArabic: z.string().max(2000).optional().default(""),
      expertise: z.array(z.string().max(60)).max(20).optional().default([]),
      twitterUrl: z.string().url().optional().or(z.literal("")).default(""),
      linkedinUrl: z.string().url().optional().or(z.literal("")).default(""),
      websiteUrl: z.string().url().optional().or(z.literal("")).default(""),
      profile: z.string().max(500).optional().default(""),
      isFeatured: z.boolean().optional().default(false),
    }),
  }),

  update: z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      fullName: z.string().min(2).max(120).optional(),
      country: z.string().max(80).optional(),
      preferredLocale: z.enum(["en", "ar"]).optional(),
      profile: z.string().max(500).optional(),

      headline: z.string().max(160).optional(),
      headlineArabic: z.string().max(160).optional(),
      bio: z.string().max(2000).optional(),
      bioArabic: z.string().max(2000).optional(),
      expertise: z.array(z.string().max(60)).max(20).optional(),
      twitterUrl: z.string().url().optional().or(z.literal("")),
      linkedinUrl: z.string().url().optional().or(z.literal("")),
      websiteUrl: z.string().url().optional().or(z.literal("")),
      isFeatured: z.boolean().optional(),
    }),
  }),

  remove: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),
};

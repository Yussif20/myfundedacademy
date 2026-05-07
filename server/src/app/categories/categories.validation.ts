import { z } from "zod";

export const CategoriesValidation = {
  list: z.object({
    query: z.object({
      featured: z.coerce.boolean().optional(),
    }),
  }),

  get: z.object({
    params: z.object({ idOrSlug: z.string().min(1) }),
  }),

  create: z.object({
    body: z.object({
      name: z.string().min(2).max(80),
      nameArabic: z.string().max(80).optional().default(""),
      description: z.string().max(500).optional().default(""),
      descriptionArabic: z.string().max(500).optional().default(""),
      icon: z.string().max(120).optional().default(""),
      order: z.number().int().min(0).optional().default(0),
      isFeatured: z.boolean().optional().default(false),
    }),
  }),

  update: z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      name: z.string().min(2).max(80).optional(),
      nameArabic: z.string().max(80).optional(),
      description: z.string().max(500).optional(),
      descriptionArabic: z.string().max(500).optional(),
      icon: z.string().max(120).optional(),
      order: z.number().int().min(0).optional(),
      isFeatured: z.boolean().optional(),
    }),
  }),

  remove: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),
};

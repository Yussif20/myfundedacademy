import { z } from "zod";

export const ReviewsValidation = {
  upsertCourseReview: z.object({
    params: z.object({ slug: z.string().min(1) }),
    body: z.object({
      rating: z.number().int().min(1).max(5),
      title: z.string().max(160).optional().default(""),
      titleArabic: z.string().max(160).optional().default(""),
      body: z.string().max(2000).optional().default(""),
      bodyArabic: z.string().max(2000).optional().default(""),
    }),
  }),

  listCourseReviews: z.object({
    params: z.object({ slug: z.string().min(1) }),
    query: z.object({
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    }),
  }),

  getMyReview: z.object({
    params: z.object({ slug: z.string().min(1) }),
  }),

  removeReview: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),
};

import { z } from "zod";

const courseLevel = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]);
const courseLanguage = z.enum(["EN", "AR", "BOTH"]);
const accessTier = z.enum(["FREE", "STARTER", "PRO"]);
const courseStatus = z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED"]);

export const CoursesValidation = {
  // ---- Catalog ----
  list: z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(12),
      categoryId: z.string().uuid().optional(),
      categorySlug: z.string().optional(),
      instructorId: z.string().uuid().optional(),
      status: courseStatus.optional(),
      featured: z.coerce.boolean().optional(),
      search: z.string().optional(),
    }),
  }),

  get: z.object({
    params: z.object({ idOrSlug: z.string().min(1) }),
  }),

  previewOtp: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),

  // ---- Course CRUD (admin) ----
  create: z.object({
    body: z.object({
      title: z.string().min(2).max(160),
      titleArabic: z.string().max(160).optional().default(""),
      shortDescription: z.string().max(280).optional().default(""),
      shortDescriptionArabic: z.string().max(280).optional().default(""),
      description: z.string().max(8000).optional().default(""),
      descriptionArabic: z.string().max(8000).optional().default(""),
      thumbnail: z.string().max(500).optional().default(""),
      promoVideoVdoId: z.string().max(120).optional().default(""),
      level: courseLevel.optional().default("ALL_LEVELS"),
      language: courseLanguage.optional().default("EN"),
      oneTimePrice: z.number().min(0).optional().default(0),
      accessTier: accessTier.optional().default("FREE"),
      isFeatured: z.boolean().optional().default(false),
      categoryId: z.string().uuid().nullable().optional(),
      instructorId: z.string().uuid(),
    }),
  }),

  update: z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      title: z.string().min(2).max(160).optional(),
      titleArabic: z.string().max(160).optional(),
      shortDescription: z.string().max(280).optional(),
      shortDescriptionArabic: z.string().max(280).optional(),
      description: z.string().max(8000).optional(),
      descriptionArabic: z.string().max(8000).optional(),
      thumbnail: z.string().max(500).optional(),
      promoVideoVdoId: z.string().max(120).optional(),
      level: courseLevel.optional(),
      language: courseLanguage.optional(),
      oneTimePrice: z.number().min(0).optional(),
      accessTier: accessTier.optional(),
      isFeatured: z.boolean().optional(),
      categoryId: z.string().uuid().nullable().optional(),
      instructorId: z.string().uuid().optional(),
    }),
  }),

  remove: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),

  publish: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),

  // ---- Section ----
  createSection: z.object({
    params: z.object({ courseId: z.string().uuid() }),
    body: z.object({
      title: z.string().min(2).max(160),
      titleArabic: z.string().max(160).optional().default(""),
      order: z.number().int().min(0).optional(),
    }),
  }),

  updateSection: z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      title: z.string().min(2).max(160).optional(),
      titleArabic: z.string().max(160).optional(),
      order: z.number().int().min(0).optional(),
    }),
  }),

  removeSection: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),

  reorderSections: z.object({
    params: z.object({ courseId: z.string().uuid() }),
    body: z.object({
      ids: z.array(z.string().uuid()).min(1).max(100),
    }),
  }),

  // ---- Lesson ----
  createLesson: z.object({
    params: z.object({ sectionId: z.string().uuid() }),
    body: z.object({
      title: z.string().min(2).max(200),
      titleArabic: z.string().max(200).optional().default(""),
      description: z.string().max(2000).optional().default(""),
      descriptionArabic: z.string().max(2000).optional().default(""),
      vdoVideoId: z.string().max(120).optional().default(""),
      durationMin: z.number().int().min(0).optional().default(0),
      isFreePreview: z.boolean().optional().default(false),
      order: z.number().int().min(0).optional(),
    }),
  }),

  updateLesson: z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      title: z.string().min(2).max(200).optional(),
      titleArabic: z.string().max(200).optional(),
      description: z.string().max(2000).optional(),
      descriptionArabic: z.string().max(2000).optional(),
      vdoVideoId: z.string().max(120).optional(),
      durationMin: z.number().int().min(0).optional(),
      isFreePreview: z.boolean().optional(),
      order: z.number().int().min(0).optional(),
    }),
  }),

  removeLesson: z.object({
    params: z.object({ id: z.string().uuid() }),
  }),

  reorderLessons: z.object({
    params: z.object({ sectionId: z.string().uuid() }),
    body: z.object({
      ids: z.array(z.string().uuid()).min(1).max(200),
    }),
  }),

  // ---- Lesson attachments ----
  addAttachment: z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      fileName: z.string().min(1).max(200),
      fileKey: z.string().min(1).max(300),
      fileSize: z.number().int().min(0).optional().default(0),
      fileType: z.string().max(100).optional().default(""),
    }),
  }),

  removeAttachment: z.object({
    params: z.object({ id: z.string().uuid(), attachmentId: z.string().uuid() }),
  }),
};

import { z } from "zod";

export const UploadsValidation = {
  thumbnailPresign: z.object({
    body: z.object({
      fileName: z.string().min(1).max(200),
      contentType: z
        .string()
        .min(1)
        .max(120)
        .refine((v) => /^image\/(png|jpeg|jpg|webp|avif|gif)$/i.test(v), {
          message: "Only PNG, JPEG, WebP, AVIF, or GIF images are allowed.",
        }),
      contentLength: z
        .number()
        .int()
        .min(1)
        .max(8 * 1024 * 1024), // 8 MB cap for thumbnails
    }),
  }),

  attachmentPresign: z.object({
    body: z.object({
      fileName: z.string().min(1).max(200),
      contentType: z.string().min(1).max(120),
      contentLength: z
        .number()
        .int()
        .min(1)
        .max(50 * 1024 * 1024), // 50 MB cap for attachments
    }),
  }),

  videoCredentials: z.object({
    body: z.object({
      title: z.string().min(2).max(200),
    }),
  }),
};

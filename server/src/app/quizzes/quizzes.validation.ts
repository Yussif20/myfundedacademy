import { z } from "zod";

const optionSchema = z.object({
  id: z.string().uuid().optional(), // present when editing existing
  text: z.string().min(1).max(400),
  textArabic: z.string().max(400).optional().default(""),
  isCorrect: z.boolean().optional().default(false),
});

const questionSchema = z.object({
  id: z.string().uuid().optional(),
  prompt: z.string().min(2).max(1000),
  promptArabic: z.string().max(1000).optional().default(""),
  explanation: z.string().max(2000).optional().default(""),
  explanationArabic: z.string().max(2000).optional().default(""),
  options: z
    .array(optionSchema)
    .min(2)
    .max(8)
    .refine((opts) => opts.some((o) => o.isCorrect), {
      message: "At least one option must be marked correct.",
    }),
});

export const QuizzesValidation = {
  // ---- Admin ----
  upsertCourseQuiz: z.object({
    params: z.object({ courseId: z.string().uuid() }),
    body: z.object({
      title: z.string().max(200).optional().default(""),
      titleArabic: z.string().max(200).optional().default(""),
      passingScore: z.number().int().min(0).max(100).optional().default(70),
      questions: z.array(questionSchema).min(1).max(50),
    }),
  }),

  removeCourseQuiz: z.object({
    params: z.object({ courseId: z.string().uuid() }),
  }),

  // ---- Student ----
  getCourseQuiz: z.object({
    params: z.object({ slug: z.string().min(1) }),
  }),

  attemptQuiz: z.object({
    params: z.object({ slug: z.string().min(1) }),
    body: z.object({
      answers: z.record(z.string().uuid(), z.string().uuid()),
    }),
  }),

  // ---- Certificate ----
  issueCertificate: z.object({
    params: z.object({ slug: z.string().min(1) }),
  }),

  verifyCertificate: z.object({
    params: z.object({ code: z.string().min(4).max(40) }),
  }),
};

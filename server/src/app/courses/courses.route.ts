import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { CoursesController } from "./courses.controller";
import { CoursesValidation } from "./courses.validation";

const router = express.Router();

// Public reads
router.get("/", validateRequest(CoursesValidation.list), CoursesController.list);
router.get("/:idOrSlug", validateRequest(CoursesValidation.get), CoursesController.get);

// Free-preview OTP (public — service enforces lesson.isFreePreview + course PUBLISHED)
router.post(
  "/lessons/:id/preview-otp",
  validateRequest(CoursesValidation.previewOtp),
  CoursesController.previewOtp,
);

// Authenticated playback OTP (access-checked, watermarked with viewer email)
router.post(
  "/lessons/:id/playback-otp",
  requireAuth,
  validateRequest(CoursesValidation.playbackOtp),
  CoursesController.playbackOtp,
);

// Progress (auth)
router.post(
  "/lessons/:id/progress",
  requireAuth,
  validateRequest(CoursesValidation.upsertProgress),
  CoursesController.upsertProgress,
);

router.get(
  "/:idOrSlug/progress",
  requireAuth,
  validateRequest(CoursesValidation.getCourseProgress),
  CoursesController.getCourseProgress,
);

// Course mutations: open to ADMIN and INSTRUCTOR. The service layer enforces
// per-course ownership for INSTRUCTORs (they can only touch their own courses).
const author = [requireAuth, requireRole("ADMIN", "INSTRUCTOR")];

// Course CRUD
router.post("/", ...author, validateRequest(CoursesValidation.create), CoursesController.create);
router.patch(
  "/:id",
  ...author,
  validateRequest(CoursesValidation.update),
  CoursesController.update,
);
router.delete(
  "/:id",
  ...author,
  validateRequest(CoursesValidation.remove),
  CoursesController.remove,
);
router.post(
  "/:id/publish",
  ...author,
  validateRequest(CoursesValidation.publish),
  CoursesController.publish,
);
router.post(
  "/:id/unpublish",
  ...author,
  validateRequest(CoursesValidation.publish),
  CoursesController.unpublish,
);

// Sections
router.post(
  "/:courseId/sections",
  ...author,
  validateRequest(CoursesValidation.createSection),
  CoursesController.createSection,
);
router.patch(
  "/sections/:id",
  ...author,
  validateRequest(CoursesValidation.updateSection),
  CoursesController.updateSection,
);
router.delete(
  "/sections/:id",
  ...author,
  validateRequest(CoursesValidation.removeSection),
  CoursesController.removeSection,
);
router.post(
  "/:courseId/sections/reorder",
  ...author,
  validateRequest(CoursesValidation.reorderSections),
  CoursesController.reorderSections,
);

// Lessons
router.post(
  "/sections/:sectionId/lessons",
  ...author,
  validateRequest(CoursesValidation.createLesson),
  CoursesController.createLesson,
);
router.patch(
  "/lessons/:id",
  ...author,
  validateRequest(CoursesValidation.updateLesson),
  CoursesController.updateLesson,
);
router.delete(
  "/lessons/:id",
  ...author,
  validateRequest(CoursesValidation.removeLesson),
  CoursesController.removeLesson,
);
router.post(
  "/sections/:sectionId/lessons/reorder",
  ...author,
  validateRequest(CoursesValidation.reorderLessons),
  CoursesController.reorderLessons,
);

// Lesson attachments
router.post(
  "/lessons/:id/attachments",
  ...author,
  validateRequest(CoursesValidation.addAttachment),
  CoursesController.addAttachment,
);
router.delete(
  "/lessons/:id/attachments/:attachmentId",
  ...author,
  validateRequest(CoursesValidation.removeAttachment),
  CoursesController.removeAttachment,
);

export const CoursesRoutes = router;

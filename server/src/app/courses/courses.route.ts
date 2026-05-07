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

const admin = [requireAuth, requireRole("ADMIN")];

// Course CRUD
router.post("/", ...admin, validateRequest(CoursesValidation.create), CoursesController.create);
router.patch("/:id", ...admin, validateRequest(CoursesValidation.update), CoursesController.update);
router.delete(
  "/:id",
  ...admin,
  validateRequest(CoursesValidation.remove),
  CoursesController.remove,
);
router.post(
  "/:id/publish",
  ...admin,
  validateRequest(CoursesValidation.publish),
  CoursesController.publish,
);
router.post(
  "/:id/unpublish",
  ...admin,
  validateRequest(CoursesValidation.publish),
  CoursesController.unpublish,
);

// Sections
router.post(
  "/:courseId/sections",
  ...admin,
  validateRequest(CoursesValidation.createSection),
  CoursesController.createSection,
);
router.patch(
  "/sections/:id",
  ...admin,
  validateRequest(CoursesValidation.updateSection),
  CoursesController.updateSection,
);
router.delete(
  "/sections/:id",
  ...admin,
  validateRequest(CoursesValidation.removeSection),
  CoursesController.removeSection,
);
router.post(
  "/:courseId/sections/reorder",
  ...admin,
  validateRequest(CoursesValidation.reorderSections),
  CoursesController.reorderSections,
);

// Lessons
router.post(
  "/sections/:sectionId/lessons",
  ...admin,
  validateRequest(CoursesValidation.createLesson),
  CoursesController.createLesson,
);
router.patch(
  "/lessons/:id",
  ...admin,
  validateRequest(CoursesValidation.updateLesson),
  CoursesController.updateLesson,
);
router.delete(
  "/lessons/:id",
  ...admin,
  validateRequest(CoursesValidation.removeLesson),
  CoursesController.removeLesson,
);
router.post(
  "/sections/:sectionId/lessons/reorder",
  ...admin,
  validateRequest(CoursesValidation.reorderLessons),
  CoursesController.reorderLessons,
);

// Lesson attachments
router.post(
  "/lessons/:id/attachments",
  ...admin,
  validateRequest(CoursesValidation.addAttachment),
  CoursesController.addAttachment,
);
router.delete(
  "/lessons/:id/attachments/:attachmentId",
  ...admin,
  validateRequest(CoursesValidation.removeAttachment),
  CoursesController.removeAttachment,
);

export const CoursesRoutes = router;

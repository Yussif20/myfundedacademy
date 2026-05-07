import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { QuizzesController } from "./quizzes.controller";
import { QuizzesValidation } from "./quizzes.validation";

const router = express.Router();

const admin = [requireAuth, requireRole("ADMIN")];

// ---- Admin: course quiz authoring ----
router.get("/admin/courses/:courseId", ...admin, QuizzesController.getCourseQuizForAdmin);
router.put(
  "/admin/courses/:courseId",
  ...admin,
  validateRequest(QuizzesValidation.upsertCourseQuiz),
  QuizzesController.upsertCourseQuiz,
);
router.delete(
  "/admin/courses/:courseId",
  ...admin,
  validateRequest(QuizzesValidation.removeCourseQuiz),
  QuizzesController.removeCourseQuiz,
);

// ---- Student ----
router.get(
  "/courses/:slug",
  validateRequest(QuizzesValidation.getCourseQuiz),
  QuizzesController.getCourseQuizForStudent,
);
router.post(
  "/courses/:slug/attempt",
  requireAuth,
  validateRequest(QuizzesValidation.attemptQuiz),
  QuizzesController.attemptQuiz,
);

// ---- Certificate ----
router.post(
  "/courses/:slug/certificate",
  requireAuth,
  validateRequest(QuizzesValidation.issueCertificate),
  QuizzesController.issueCertificate,
);
router.get(
  "/courses/:slug/certificate/me",
  requireAuth,
  QuizzesController.getMyCertificateForCourse,
);
router.get("/certificates/me", requireAuth, QuizzesController.listMyCertificates);
router.get(
  "/certificates/verify/:code",
  validateRequest(QuizzesValidation.verifyCertificate),
  QuizzesController.verifyCertificate,
);

export const QuizzesRoutes = router;

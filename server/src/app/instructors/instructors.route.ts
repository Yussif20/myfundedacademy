import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { InstructorsController } from "./instructors.controller";
import { InstructorsValidation } from "./instructors.validation";

const router = express.Router();

// Public reads
router.get("/", validateRequest(InstructorsValidation.list), InstructorsController.list);

// Me-scoped (instructor self-service). Must come BEFORE /:id so the literal
// segment "me" doesn't get matched as a uuid by the param route.
const instructor = [requireAuth, requireRole("INSTRUCTOR", "ADMIN")];

router.get("/me", ...instructor, InstructorsController.getMe);
router.patch(
  "/me",
  ...instructor,
  validateRequest(InstructorsValidation.updateMe),
  InstructorsController.updateMe,
);
router.get("/me/courses", ...instructor, InstructorsController.listMyCourses);
router.get("/me/stats", ...instructor, InstructorsController.getMyStats);
router.get("/me/students", ...instructor, InstructorsController.listMyStudents);
router.get("/me/earnings", ...instructor, InstructorsController.getMyEarnings);

router.get("/:id", validateRequest(InstructorsValidation.get), InstructorsController.get);

// Admin writes
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(InstructorsValidation.create),
  InstructorsController.create,
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(InstructorsValidation.update),
  InstructorsController.update,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(InstructorsValidation.remove),
  InstructorsController.remove,
);

export const InstructorsRoutes = router;

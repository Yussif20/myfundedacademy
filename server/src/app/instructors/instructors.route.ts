import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { InstructorsController } from "./instructors.controller";
import { InstructorsValidation } from "./instructors.validation";

const router = express.Router();

// Public reads
router.get("/", validateRequest(InstructorsValidation.list), InstructorsController.list);
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

import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { CategoriesController } from "./categories.controller";
import { CategoriesValidation } from "./categories.validation";

const router = express.Router();

// Public reads
router.get("/", validateRequest(CategoriesValidation.list), CategoriesController.list);
router.get("/:idOrSlug", validateRequest(CategoriesValidation.get), CategoriesController.get);

// Admin writes
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoriesValidation.create),
  CategoriesController.create,
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoriesValidation.update),
  CategoriesController.update,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoriesValidation.remove),
  CategoriesController.remove,
);

export const CategoriesRoutes = router;

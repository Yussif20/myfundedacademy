import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { UsersController } from "./users.controller";
import { UsersValidation } from "./users.validation";

const router = express.Router();

// Self
router.get("/me", requireAuth, UsersController.getMe);
router.patch(
  "/me",
  requireAuth,
  validateRequest(UsersValidation.updateMe),
  UsersController.updateMe,
);
router.post(
  "/me/change-password",
  requireAuth,
  validateRequest(UsersValidation.changePassword),
  UsersController.changePassword,
);

// Admin
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(UsersValidation.listUsers),
  UsersController.listUsers,
);
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(UsersValidation.createUser),
  UsersController.createUser,
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(UsersValidation.updateUser),
  UsersController.updateUser,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(UsersValidation.deleteUser),
  UsersController.deleteUser,
);

export const UsersRoutes = router;

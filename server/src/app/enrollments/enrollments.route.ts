import express from "express";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { EnrollmentsController } from "./enrollments.controller";

const router = express.Router();

router.get("/me", requireAuth, EnrollmentsController.listMine);

// Admin: every enrollment platform-wide
router.get("/", requireAuth, requireRole("ADMIN"), EnrollmentsController.listAll);

export const EnrollmentsRoutes = router;

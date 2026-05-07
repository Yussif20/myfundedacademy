import express from "express";
import { requireAuth } from "@/middlewares/auth.middleware";
import { EnrollmentsController } from "./enrollments.controller";

const router = express.Router();

router.get("/me", requireAuth, EnrollmentsController.listMine);

export const EnrollmentsRoutes = router;

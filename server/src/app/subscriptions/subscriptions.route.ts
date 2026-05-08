import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsValidation } from "./subscriptions.validation";

const router = express.Router();

router.post(
  "/checkout",
  requireAuth,
  validateRequest(SubscriptionsValidation.checkout),
  SubscriptionsController.checkout,
);
router.get("/me", requireAuth, SubscriptionsController.getMine);
router.post("/cancel", requireAuth, SubscriptionsController.cancel);
router.post("/portal", requireAuth, SubscriptionsController.billingPortal);

// Admin: every subscription
router.get("/", requireAuth, requireRole("ADMIN"), SubscriptionsController.listAll);

export const SubscriptionsRoutes = router;

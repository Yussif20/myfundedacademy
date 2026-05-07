import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth } from "@/middlewares/auth.middleware";
import { OrdersController } from "./orders.controller";
import { OrdersValidation } from "./orders.validation";

const router = express.Router();

router.post(
  "/checkout-course",
  requireAuth,
  validateRequest(OrdersValidation.checkoutCourse),
  OrdersController.checkoutCourse,
);

router.get("/me", requireAuth, OrdersController.listMine);
router.get("/me/by-session/:sessionId", requireAuth, OrdersController.getMineBySession);

export const OrdersRoutes = router;

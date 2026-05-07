import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth } from "@/middlewares/auth.middleware";
import { ReviewsController } from "./reviews.controller";
import { ReviewsValidation } from "./reviews.validation";

const router = express.Router();

router.get(
  "/courses/:slug",
  validateRequest(ReviewsValidation.listCourseReviews),
  ReviewsController.listCourseReviews,
);
router.post(
  "/courses/:slug",
  requireAuth,
  validateRequest(ReviewsValidation.upsertCourseReview),
  ReviewsController.upsertCourseReview,
);
router.get(
  "/courses/:slug/me",
  requireAuth,
  validateRequest(ReviewsValidation.getMyReview),
  ReviewsController.getMyReview,
);
router.delete(
  "/:id",
  requireAuth,
  validateRequest(ReviewsValidation.removeReview),
  ReviewsController.removeReview,
);

export const ReviewsRoutes = router;

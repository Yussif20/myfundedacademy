import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { UploadsController } from "./uploads.controller";
import { UploadsValidation } from "./uploads.validation";

const router = express.Router();

const admin = [requireAuth, requireRole("ADMIN")];

router.post(
  "/thumbnail-presign",
  ...admin,
  validateRequest(UploadsValidation.thumbnailPresign),
  UploadsController.thumbnailPresign,
);

router.post(
  "/attachment-presign",
  ...admin,
  validateRequest(UploadsValidation.attachmentPresign),
  UploadsController.attachmentPresign,
);

router.post(
  "/video-credentials",
  ...admin,
  validateRequest(UploadsValidation.videoCredentials),
  UploadsController.videoCredentials,
);

export const UploadsRoutes = router;

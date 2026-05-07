import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { UploadsController } from "./uploads.controller";
import { UploadsValidation } from "./uploads.validation";

const router = express.Router();

// Open to ADMIN + INSTRUCTOR. Both can presign uploads; backend operations
// that consume the presigned URL still gate on course ownership in the
// courses service.
const author = [requireAuth, requireRole("ADMIN", "INSTRUCTOR")];

router.post(
  "/thumbnail-presign",
  ...author,
  validateRequest(UploadsValidation.thumbnailPresign),
  UploadsController.thumbnailPresign,
);

router.post(
  "/attachment-presign",
  ...author,
  validateRequest(UploadsValidation.attachmentPresign),
  UploadsController.attachmentPresign,
);

router.post(
  "/video-credentials",
  ...author,
  validateRequest(UploadsValidation.videoCredentials),
  UploadsController.videoCredentials,
);

export const UploadsRoutes = router;

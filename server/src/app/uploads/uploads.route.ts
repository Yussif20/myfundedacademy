import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { UploadsController } from "./uploads.controller";
import { UploadsValidation } from "./uploads.validation";

const router = express.Router();

// Avatars: any authenticated user can upload their own profile picture.
router.post(
  "/avatar-presign",
  requireAuth,
  validateRequest(UploadsValidation.avatarPresign),
  UploadsController.avatarPresign,
);

// Course thumbnails / videos / attachments: ADMIN + INSTRUCTOR only.
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

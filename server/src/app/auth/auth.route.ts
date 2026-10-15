import express from "express";
import validateRequest from "@/middlewares/validate-request";
import { requestsLimiter } from "@/middlewares/rateLimiter";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  requestsLimiter(3600, 5, "Too many signup attempts. Try again in an hour."),
  validateRequest(AuthValidation.signup),
  AuthController.signup,
);

router.post(
  "/login",
  requestsLimiter(900, 10, "Too many login attempts. Try again in 15 minutes."),
  validateRequest(AuthValidation.login),
  AuthController.login,
);

router.post(
  "/demo-login",
  requestsLimiter(900, 30, "Too many demo sign-ins. Try again in 15 minutes."),
  validateRequest(AuthValidation.demoLogin),
  AuthController.demoLogin,
);

router.post("/refresh-token", requestsLimiter(60, 60), AuthController.refreshToken);

router.post("/logout", AuthController.logout);

router.post(
  "/verify-email",
  requestsLimiter(900, 20),
  validateRequest(AuthValidation.verifyEmail),
  AuthController.verifyEmail,
);

router.post(
  "/resend-verification",
  requestsLimiter(3600, 5, "Too many requests. Please wait an hour."),
  validateRequest(AuthValidation.resendVerification),
  AuthController.resendVerification,
);

router.post(
  "/forgot-password",
  requestsLimiter(3600, 5, "Too many password reset requests. Try again in an hour."),
  validateRequest(AuthValidation.forgotPassword),
  AuthController.forgotPassword,
);

router.post(
  "/reset-password",
  requestsLimiter(900, 10),
  validateRequest(AuthValidation.resetPassword),
  AuthController.resetPassword,
);

export const AuthRoutes = router;

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { DEMO_ACCOUNTS, DemoRole } from "@/app/demo/demo.constants";
import { REFRESH_COOKIE_NAME, clearRefreshCookie, setRefreshCookie } from "@/utils/cookies";

const signup = catchAsync(async (req, res) => {
  const result = await AuthService.signup(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Account created. Check your email to verify.",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip || "",
  });
  setRefreshCookie(res, result.refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Signed in successfully.",
    data: { user: result.user, accessToken: result.accessToken },
  });
});

const demoLogin = catchAsync(async (req, res) => {
  const role = req.body.role as DemoRole;
  const result = await AuthService.demoLogin(
    DEMO_ACCOUNTS[role],
    req.headers["user-agent"] || "",
    req.ip || "",
  );
  setRefreshCookie(res, result.refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Signed in to the demo.",
    data: { user: result.user, accessToken: result.accessToken },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const cookieToken = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE_NAME];
  const result = await AuthService.refresh(
    cookieToken || "",
    req.headers["user-agent"] || "",
    req.ip || "",
  );
  setRefreshCookie(res, result.refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Session refreshed.",
    data: { user: result.user, accessToken: result.accessToken },
  });
});

const logout = catchAsync(async (req, res) => {
  const cookieToken = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE_NAME];
  await AuthService.logout(cookieToken);
  clearRefreshCookie(res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Signed out.",
    data: null,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const result = await AuthService.verifyEmail(req.body.token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Email verified. You can sign in now.",
    data: result,
  });
});

const resendVerification = catchAsync(async (req, res) => {
  await AuthService.resendVerification(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "If an unverified account exists for that email, a new link is on its way.",
    data: null,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.forgotPassword(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "If an account exists for that email, a reset link is on its way.",
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password updated. Please sign in with your new password.",
    data: null,
  });
});

export const AuthController = {
  signup,
  login,
  demoLogin,
  refreshToken,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};

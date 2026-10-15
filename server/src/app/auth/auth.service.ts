import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import { hashPassword, comparePassword } from "@/utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/utils/jwt";
import { generateRandomToken, expiresInHours, expiresInMinutes } from "@/utils/tokens";
import { sendEmail } from "@/lib/email";
import {
  passwordChangedTemplate,
  passwordResetTemplate,
  verifyEmailTemplate,
} from "@/lib/email/templates";
import { env } from "@/env";
import httpStatus from "http-status";
import { LoginInput, LoginResult, SafeUser, SignupInput } from "./auth.interface";

const toSafeUser = (u: {
  id: string;
  email: string;
  fullName: string;
  role: any;
  preferredLocale: string;
  isEmailVerified: boolean;
  isDemo: boolean;
  bio: string | null;
  country: string | null;
  profile: string | null;
  createdAt: Date;
}): SafeUser => ({
  id: u.id,
  email: u.email,
  fullName: u.fullName,
  role: u.role,
  preferredLocale: u.preferredLocale,
  isEmailVerified: u.isEmailVerified,
  isDemo: u.isDemo,
  bio: u.bio || "",
  country: u.country || "",
  profile: u.profile || "",
  createdAt: u.createdAt,
});

const signup = async (input: SignupInput): Promise<{ email: string }> => {
  const existing = await prisma.user.findFirst({
    where: { email: input.email, isDeleted: false },
  });
  if (existing) {
    // Always respond as if signup succeeded to avoid email enumeration. The email
    // is only sent if the user is genuinely new — silent no-op for duplicates.
    return { email: input.email };
  }

  const passwordHash = await hashPassword(input.password);
  const verificationToken = generateRandomToken();

  const user = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      password: passwordHash,
      country: input.country || "",
      preferredLocale: input.preferredLocale || "en",
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: expiresInHours(24),
    },
  });

  const link = `${env.FRONTEND_URL}/${user.preferredLocale}/verify-email?token=${verificationToken}`;
  const tpl = verifyEmailTemplate({
    fullName: user.fullName,
    link,
    locale: user.preferredLocale as "en" | "ar",
  });
  await sendEmail({ to: user.email, ...tpl });

  return { email: user.email };
};

const login = async (input: LoginInput): Promise<LoginResult> => {
  const user = await prisma.user.findFirst({
    where: { email: input.email, isDeleted: false },
  });
  if (!user || !user.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

  const ok = await comparePassword(input.password, user.password);
  if (!ok) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is not active.");
  }

  if (!user.isEmailVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "Please verify your email before signing in.", {
      emailNotVerified: true,
    });
  }

  return issueTokens(user, input.userAgent, input.ip);
};

const issueTokens = async (
  user: { id: string; email: string; role: any; fullName: string; isDemo?: boolean },
  userAgent?: string,
  ip?: string,
): Promise<LoginResult> => {
  const refreshToken = signRefreshToken({ sub: user.id, jti: generateRandomToken(16) });
  const refreshHash = await hashPassword(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshHash,
      userAgent: userAgent || "",
      ip: ip || "",
      expiresAt: expiresInHours(24 * 7),
    },
  });

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    ...(user.isDemo ? { demo: true } : {}),
  });

  const fullUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

  return {
    user: toSafeUser(fullUser),
    accessToken,
    refreshToken,
  };
};

const refresh = async (
  refreshToken: string,
  userAgent?: string,
  ip?: string,
): Promise<LoginResult> => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token.", {
      refreshTokenExpired: true,
      signOut: true,
    });
  }

  const tokens = await prisma.refreshToken.findMany({
    where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } },
  });

  let matched: (typeof tokens)[0] | null = null;
  for (const t of tokens) {
    if (await comparePassword(refreshToken, t.tokenHash)) {
      matched = t;
      break;
    }
  }

  if (!matched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not recognised.", {
      signOut: true,
    });
  }

  await prisma.refreshToken.update({
    where: { id: matched.id },
    data: { revokedAt: new Date() },
  });

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.isDeleted || user.status !== "ACTIVE") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account no longer active.", { signOut: true });
  }

  return issueTokens(user, userAgent, ip);
};

const logout = async (refreshToken: string | undefined): Promise<void> => {
  if (!refreshToken) return;
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return;
  }

  const tokens = await prisma.refreshToken.findMany({
    where: { userId: payload.sub, revokedAt: null },
  });
  for (const t of tokens) {
    if (await comparePassword(refreshToken, t.tokenHash)) {
      await prisma.refreshToken.update({
        where: { id: t.id },
        data: { revokedAt: new Date() },
      });
      return;
    }
  }
};

const verifyEmail = async (token: string): Promise<{ email: string }> => {
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationTokenExpires: { gt: new Date() },
      isDeleted: false,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Verification link is invalid or has expired.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });

  return { email: user.email };
};

const resendVerification = async (email: string): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: { email, isDeleted: false, isEmailVerified: false },
  });
  // Silent no-op if user doesn't exist or already verified — prevents enumeration.
  if (!user) return;

  const token = generateRandomToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expiresInHours(24),
    },
  });

  const link = `${env.FRONTEND_URL}/${user.preferredLocale}/verify-email?token=${token}`;
  const tpl = verifyEmailTemplate({
    fullName: user.fullName,
    link,
    locale: user.preferredLocale as "en" | "ar",
  });
  await sendEmail({ to: user.email, ...tpl });
};

const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findFirst({ where: { email, isDeleted: false } });
  // Silent no-op if user doesn't exist — prevents enumeration. Demo accounts
  // are password-less and their inboxes don't exist, so they're skipped too.
  if (!user || user.isDemo) return;

  const token = generateRandomToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: token,
      resetPasswordTokenExpires: expiresInMinutes(60),
    },
  });

  const link = `${env.FRONTEND_URL}/${user.preferredLocale}/reset-password?token=${token}`;
  const tpl = passwordResetTemplate({
    fullName: user.fullName,
    link,
    locale: user.preferredLocale as "en" | "ar",
  });
  await sendEmail({ to: user.email, ...tpl });
};

const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordTokenExpires: { gt: new Date() },
      isDeleted: false,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Reset link is invalid or has expired.");
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordTokenExpires: null,
    },
  });

  // Revoke all refresh tokens — every device has to log in again.
  await prisma.refreshToken.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  const tpl = passwordChangedTemplate({
    fullName: user.fullName,
    locale: user.preferredLocale as "en" | "ar",
  });
  await sendEmail({ to: user.email, ...tpl });
};

/**
 * Password-less sign-in for the seeded "Try the demo" accounts. Only users
 * flagged isDemo can be reached this way. Old tokens are pruned first because
 * a shared demo account collects one refresh token per visitor, and refresh()
 * bcrypt-compares against every live one.
 */
const demoLogin = async (email: string, userAgent?: string, ip?: string): Promise<LoginResult> => {
  const user = await prisma.user.findFirst({
    where: { email, isDemo: true, isDeleted: false, status: "ACTIVE" },
  });
  if (!user) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "The demo is being reset. Please try again in a minute.",
    );
  }

  const KEEP_LIVE_TOKENS = 9;
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id, OR: [{ revokedAt: { not: null } }, { expiresAt: { lt: new Date() } }] },
  });
  const stale = await prisma.refreshToken.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    skip: KEEP_LIVE_TOKENS,
    select: { id: true },
  });
  if (stale.length) {
    await prisma.refreshToken.deleteMany({ where: { id: { in: stale.map((t) => t.id) } } });
  }

  return issueTokens(user, userAgent, ip);
};

export const AuthService = {
  signup,
  login,
  demoLogin,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};

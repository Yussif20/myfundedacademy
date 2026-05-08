import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import { hashPassword, comparePassword } from "@/utils/password";
import { sendEmail } from "@/lib/email";
import { passwordChangedTemplate } from "@/lib/email/templates";
import httpStatus from "http-status";
import { CreateUserInput, ListUsersQuery, UpdateMeInput, UpdateUserInput } from "./users.interface";
import { Prisma } from "@prisma/client";

const PUBLIC_FIELDS = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  status: true,
  preferredLocale: true,
  isEmailVerified: true,
  bio: true,
  country: true,
  profile: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const getMe = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: PUBLIC_FIELDS,
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  return user;
};

const updateMe = async (userId: string, input: UpdateMeInput) => {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: PUBLIC_FIELDS,
  });
  return updated;
};

const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  const ok = await comparePassword(currentPassword, user.password);
  if (!ok) {
    throw new AppError(httpStatus.BAD_REQUEST, "Current password is incorrect.");
  }

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHash },
  });

  // Revoke all refresh tokens to force re-login on every other device.
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  const tpl = passwordChangedTemplate({
    fullName: user.fullName,
    locale: user.preferredLocale as "en" | "ar",
  });
  await sendEmail({ to: user.email, ...tpl });
};

// ---- Admin ----

const listUsers = async (query: ListUsersQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));

  const where: Prisma.UserWhereInput = {
    isDeleted: false,
    ...(query.role ? { role: query.role } : {}),
    ...(query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: "insensitive" } },
            { fullName: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: PUBLIC_FIELDS,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

const createUser = async (input: CreateUserInput) => {
  const existing = await prisma.user.findFirst({
    where: { email: input.email, isDeleted: false },
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "A user with that email already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      password: passwordHash,
      role: input.role || "STUDENT",
      bio: input.bio || "",
      country: input.country || "",
      preferredLocale: input.preferredLocale || "en",
      isEmailVerified: true, // Admin-created accounts skip email verification.
    },
    select: PUBLIC_FIELDS,
  });
  return user;
};

const updateUser = async (id: string, input: UpdateUserInput) => {
  const updated = await prisma.user.update({
    where: { id },
    data: input,
    select: PUBLIC_FIELDS,
  });

  // If suspending, revoke all refresh tokens.
  if (input.status && input.status !== "ACTIVE") {
    await prisma.refreshToken.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  return updated;
};

const deleteUser = async (id: string): Promise<void> => {
  // Soft-delete + free the unique email slot so the same address can sign up again.
  // The tombstoned email keeps the original for forensics: deleted+<id>+<orig>@purged.local
  const user = await prisma.user.findUnique({
    where: { id },
    select: { email: true, isDeleted: true },
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  if (user.isDeleted) return; // idempotent — already tombstoned

  const tombstonedEmail = `deleted+${id}+${user.email}@purged.local`.toLowerCase();

  await prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
      status: "DELETED",
      email: tombstonedEmail,
    },
  });
  await prisma.refreshToken.updateMany({
    where: { userId: id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const UsersService = {
  getMe,
  updateMe,
  changePassword,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};

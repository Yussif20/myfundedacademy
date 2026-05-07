import { prisma } from "@/lib/db/db";
import { hashPassword } from "@/utils/password";
import { env } from "@/env";
import { logger } from "@/utils/logger";

export async function seedAdmin(): Promise<void> {
  const existing = await prisma.user.findFirst({
    where: { email: env.ADMIN_EMAIL, isDeleted: false },
  });

  if (existing) {
    if (existing.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "ADMIN" },
      });
      logger.success(`Admin role re-applied to ${env.ADMIN_EMAIL}`, { type: "SEED" });
    } else {
      logger.info(`Admin already seeded: ${env.ADMIN_EMAIL}`, { type: "SEED" });
    }
    return;
  }

  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);

  await prisma.user.create({
    data: {
      email: env.ADMIN_EMAIL,
      fullName: "Platform Admin",
      password: passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      authType: "EMAIL_PASSWORD",
      isEmailVerified: true,
      preferredLocale: "en",
    },
  });

  logger.success(`Admin seeded: ${env.ADMIN_EMAIL}`, { type: "SEED" });
}

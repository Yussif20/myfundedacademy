import { prisma } from "@/lib/db/db";
import type {
  AccessTier,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRoleEnum,
} from "@prisma/client";

const ACTIVE_SUB_STATUSES: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];

const planTierLevel: Record<SubscriptionPlan, number> = {
  STARTER_MONTHLY: 1,
  PRO_MONTHLY: 2,
  PRO_ANNUAL: 2,
};

const courseTierLevel: Record<AccessTier, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
};

/**
 * Returns true if the given user can fully consume the given course's
 * paywalled content. Admins always pass; instructors who own the course
 * always pass. Per-course Enrollment is honoured. Otherwise, an active
 * subscription whose plan level >= the course's accessTier grants access.
 */
export const userHasCourseAccess = async (
  userId: string | null | undefined,
  course: { id: string; accessTier: AccessTier },
  userRole?: UserRoleEnum,
): Promise<boolean> => {
  if (userRole === "ADMIN") return true;
  if (!userId) return false;

  // Instructors get free access to their own courses. One join via the
  // instructor relation rather than two roundtrips.
  if (userRole === "INSTRUCTOR") {
    const owns = await prisma.course.findFirst({
      where: { id: course.id, instructor: { userId } },
      select: { id: true },
    });
    if (owns) return true;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
    select: { id: true, expiresAt: true },
  });
  if (enrollment && (!enrollment.expiresAt || enrollment.expiresAt > new Date())) {
    return true;
  }

  if (course.accessTier === "FREE") return false; // FREE courses still require explicit enrollment for MVP

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true, status: true, currentPeriodEnd: true },
  });

  if (!subscription) return false;
  if (!ACTIVE_SUB_STATUSES.includes(subscription.status)) return false;
  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) return false;

  return planTierLevel[subscription.plan] >= courseTierLevel[course.accessTier];
};

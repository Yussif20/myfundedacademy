import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { hashPassword } from "@/utils/password";

const PROFILE_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
      fullName: true,
      country: true,
      profile: true,
      preferredLocale: true,
      role: true,
      status: true,
      isEmailVerified: true,
      createdAt: true,
    },
  },
} as const;

export const InstructorsService = {
  async list(filter: { featured?: boolean }) {
    return prisma.instructorProfile.findMany({
      where: {
        ...(filter.featured !== undefined ? { isFeatured: filter.featured } : {}),
        user: { isDeleted: false, status: "ACTIVE" },
      },
      include: PROFILE_INCLUDE,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  },

  async get(id: string) {
    const profile = await prisma.instructorProfile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE,
    });
    if (!profile) throw new AppError(httpStatus.NOT_FOUND, "Instructor not found.");
    return profile;
  },

  async create(input: {
    email: string;
    fullName: string;
    password: string;
    country?: string;
    preferredLocale?: "en" | "ar";
    profile?: string;
    headline?: string;
    headlineArabic?: string;
    bio?: string;
    bioArabic?: string;
    expertise?: string[];
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    isFeatured?: boolean;
  }) {
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
        role: "INSTRUCTOR",
        status: "ACTIVE",
        authType: "EMAIL_PASSWORD",
        isEmailVerified: true,
        country: input.country || "",
        preferredLocale: input.preferredLocale || "en",
        profile: input.profile || "",
        instructorProfile: {
          create: {
            headline: input.headline || "",
            headlineArabic: input.headlineArabic || "",
            bio: input.bio || "",
            bioArabic: input.bioArabic || "",
            expertise: input.expertise || [],
            twitterUrl: input.twitterUrl || "",
            linkedinUrl: input.linkedinUrl || "",
            websiteUrl: input.websiteUrl || "",
            isFeatured: input.isFeatured ?? false,
          },
        },
      },
      include: { instructorProfile: true },
    });

    if (!user.instructorProfile) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Instructor creation failed.");
    }

    return InstructorsService.get(user.instructorProfile.id);
  },

  async update(
    id: string,
    input: Partial<{
      fullName: string;
      country: string;
      preferredLocale: "en" | "ar";
      profile: string;
      headline: string;
      headlineArabic: string;
      bio: string;
      bioArabic: string;
      expertise: string[];
      twitterUrl: string;
      linkedinUrl: string;
      websiteUrl: string;
      isFeatured: boolean;
    }>,
  ) {
    const profile = await prisma.instructorProfile.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!profile) throw new AppError(httpStatus.NOT_FOUND, "Instructor not found.");

    const userPatch: Record<string, unknown> = {};
    if (input.fullName !== undefined) userPatch.fullName = input.fullName;
    if (input.country !== undefined) userPatch.country = input.country;
    if (input.preferredLocale !== undefined) userPatch.preferredLocale = input.preferredLocale;
    if (input.profile !== undefined) userPatch.profile = input.profile;

    const profilePatch: Record<string, unknown> = {};
    (
      [
        "headline",
        "headlineArabic",
        "bio",
        "bioArabic",
        "expertise",
        "twitterUrl",
        "linkedinUrl",
        "websiteUrl",
        "isFeatured",
      ] as const
    ).forEach((k) => {
      if (input[k] !== undefined) profilePatch[k] = input[k] as never;
    });

    await prisma.$transaction([
      ...(Object.keys(userPatch).length
        ? [prisma.user.update({ where: { id: profile.userId }, data: userPatch })]
        : []),
      ...(Object.keys(profilePatch).length
        ? [prisma.instructorProfile.update({ where: { id }, data: profilePatch })]
        : []),
    ]);

    return InstructorsService.get(id);
  },

  /**
   * Returns the InstructorProfile linked to the current user. Used by the
   * instructor workspace's profile editor + dashboard.
   */
  async getMe(userId: string) {
    const profile = await prisma.instructorProfile.findFirst({
      where: { userId },
      include: PROFILE_INCLUDE,
    });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No instructor profile on file.");
    }
    return profile;
  },

  /**
   * Self-edit for instructors. Excludes admin-only fields like isFeatured.
   */
  async updateMe(
    userId: string,
    input: Partial<{
      fullName: string;
      country: string;
      preferredLocale: "en" | "ar";
      profile: string;
      headline: string;
      headlineArabic: string;
      bio: string;
      bioArabic: string;
      expertise: string[];
      twitterUrl: string;
      linkedinUrl: string;
      websiteUrl: string;
    }>,
  ) {
    const profile = await prisma.instructorProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No instructor profile on file.");
    }
    return InstructorsService.update(profile.id, input);
  },

  /**
   * Lists courses authored by the current user (any status, including drafts).
   * Used by the instructor's "my courses" page.
   */
  async listMyCourses(userId: string) {
    const profile = await prisma.instructorProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No instructor profile on file.");
    }
    const courses = await prisma.course.findMany({
      where: { instructorId: profile.id, isDeleted: false },
      orderBy: [{ updatedAt: "desc" }],
      include: {
        category: { select: { id: true, slug: true, name: true, nameArabic: true } },
        instructor: {
          select: {
            id: true,
            headline: true,
            headlineArabic: true,
            isFeatured: true,
            user: { select: { id: true, fullName: true, profile: true } },
          },
        },
        _count: { select: { sections: true, enrollments: true, reviews: true } },
      },
    });
    return courses;
  },

  /**
   * Aggregate KPIs for the instructor dashboard.
   * - courseCount: total courses (any status)
   * - publishedCount: subset that are PUBLISHED
   * - totalEnrollments: distinct enrollments across all my courses
   * - avgRating: average rating across all reviews of my courses
   */
  async getMyStats(userId: string) {
    const profile = await prisma.instructorProfile.findFirst({
      where: { userId },
      select: {
        id: true,
        courses: {
          where: { isDeleted: false },
          select: { id: true, status: true },
        },
      },
    });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No instructor profile on file.");
    }
    const courseIds = profile.courses.map((c) => c.id);
    const courseCount = profile.courses.length;
    const publishedCount = profile.courses.filter((c) => c.status === "PUBLISHED").length;

    if (courseIds.length === 0) {
      return { courseCount: 0, publishedCount: 0, totalEnrollments: 0, avgRating: 0 };
    }

    const [enrollmentCount, ratingAgg] = await Promise.all([
      prisma.enrollment.count({ where: { courseId: { in: courseIds } } }),
      prisma.review.aggregate({
        where: { courseId: { in: courseIds }, isDeleted: false },
        _avg: { rating: true },
      }),
    ]);

    return {
      courseCount,
      publishedCount,
      totalEnrollments: enrollmentCount,
      avgRating: Number(ratingAgg._avg.rating ?? 0),
    };
  },

  /**
   * Returns every (student, course) enrollment across the current
   * instructor's courses, annotated with completion progress.
   */
  async listMyStudents(userId: string) {
    const profile = await prisma.instructorProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No instructor profile on file.");
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: profile.id, isDeleted: false },
      select: { id: true, slug: true, title: true, titleArabic: true, totalLessons: true },
    });
    if (courses.length === 0) return [];

    const courseIdToMeta = new Map(courses.map((c) => [c.id, c]));
    const courseIds = courses.map((c) => c.id);

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds }, user: { isDeleted: false } },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            country: true,
            profile: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });
    if (enrollments.length === 0) return [];

    // Count completed lessons per (user, course) in one query and bucket
    // them client-side to avoid N+1.
    const userIds = Array.from(new Set(enrollments.map((e) => e.userId)));
    const completed = await prisma.progress.findMany({
      where: {
        userId: { in: userIds },
        completedAt: { not: null },
        lesson: { section: { courseId: { in: courseIds } } },
      },
      select: {
        userId: true,
        lesson: { select: { section: { select: { courseId: true } } } },
      },
    });
    const completionByKey = new Map<string, number>();
    for (const p of completed) {
      const key = `${p.userId}:${p.lesson.section.courseId}`;
      completionByKey.set(key, (completionByKey.get(key) ?? 0) + 1);
    }

    return enrollments.map((e) => {
      const course = courseIdToMeta.get(e.courseId)!;
      const completedLessons = completionByKey.get(`${e.userId}:${e.courseId}`) ?? 0;
      const progressPct =
        course.totalLessons > 0
          ? Math.min(100, Math.round((completedLessons / course.totalLessons) * 100))
          : 0;
      return {
        enrollmentId: e.id,
        enrolledAt: e.enrolledAt,
        expiresAt: e.expiresAt,
        source: e.source,
        student: e.user,
        course: {
          id: course.id,
          slug: course.slug,
          title: course.title,
          titleArabic: course.titleArabic,
          totalLessons: course.totalLessons,
        },
        completedLessons,
        progressPct,
      };
    });
  },

  /**
   * Active subscribers whose plan tier grants access to at least one of
   * the instructor's courses. Mirrors the plan/course tier mapping used
   * in lib/payments/access.ts. Returns an empty list when the instructor
   * only has FREE courses (subscriptions don't grant access to FREE
   * tier — those still require explicit enrollment).
   */
  async listMySubscribers(userId: string, search?: string) {
    const profile = await prisma.instructorProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No instructor profile on file.");
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: profile.id, isDeleted: false },
      select: { accessTier: true },
    });

    const tierLevel: Record<"FREE" | "STARTER" | "PRO", number> = {
      FREE: 0,
      STARTER: 1,
      PRO: 2,
    };
    const planLevel: Record<"STARTER_MONTHLY" | "PRO_MONTHLY" | "PRO_ANNUAL", number> = {
      STARTER_MONTHLY: 1,
      PRO_MONTHLY: 2,
      PRO_ANNUAL: 2,
    };

    // Smallest paid tier the instructor offers; subscribers must meet or
    // exceed it to view any of their content.
    const paidLevels = courses
      .map((c) => tierLevel[c.accessTier as keyof typeof tierLevel])
      .filter((l) => l > 0);
    if (paidLevels.length === 0) return [];

    const minPaidLevel = Math.min(...paidLevels);
    const eligiblePlans = (Object.keys(planLevel) as Array<keyof typeof planLevel>).filter(
      (p) => planLevel[p] >= minPaidLevel,
    );
    if (eligiblePlans.length === 0) return [];

    const trimmed = search?.trim();
    return prisma.subscription.findMany({
      where: {
        plan: { in: eligiblePlans },
        status: { in: ["ACTIVE", "TRIALING"] },
        user: { isDeleted: false },
        ...(trimmed
          ? {
              user: {
                isDeleted: false,
                OR: [
                  { fullName: { contains: trimmed, mode: "insensitive" } },
                  { email: { contains: trimmed, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            country: true,
            profile: true,
            createdAt: true,
          },
        },
      },
    });
  },

  /**
   * Gross revenue across the instructor's courses. One-time COMPLETED
   * orders only (subscription orders aren't course-attributed).
   * NOTE: This is platform gross — payout split via Stripe Connect lands
   * post-MVP. Frontend displays a clear disclaimer.
   */
  async getMyEarnings(userId: string) {
    const profile = await prisma.instructorProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No instructor profile on file.");
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: profile.id, isDeleted: false },
      select: { id: true, slug: true, title: true, titleArabic: true },
    });
    if (courses.length === 0) {
      return {
        totalGross: 0,
        last30Gross: 0,
        currency: "usd",
        orderCount: 0,
        byCourse: [] as Array<{
          course: { id: string; slug: string; title: string; titleArabic: string };
          orderCount: number;
          gross: number;
        }>,
        recent: [] as Array<{
          id: string;
          amount: number;
          currency: string;
          paidAt: Date;
          courseId: string | null;
          courseTitle: string;
          student: { id: string; fullName: string; email: string } | null;
        }>,
      };
    }

    const courseIds = courses.map((c) => c.id);
    const courseById = new Map(courses.map((c) => [c.id, c]));

    const since30 = new Date();
    since30.setDate(since30.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        courseId: { in: courseIds },
        status: "COMPLETED",
        type: "ONE_TIME",
      },
      orderBy: { paidAt: "desc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        courseId: true,
        paidAt: true,
        createdAt: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    const totalGross = orders.reduce((s, o) => s + o.amount, 0);
    const last30Gross = orders
      .filter((o) => (o.paidAt ?? o.createdAt) >= since30)
      .reduce((s, o) => s + o.amount, 0);

    const byCourseMap = new Map<string, { count: number; gross: number }>();
    for (const o of orders) {
      if (!o.courseId) continue;
      const m = byCourseMap.get(o.courseId) ?? { count: 0, gross: 0 };
      m.count += 1;
      m.gross += o.amount;
      byCourseMap.set(o.courseId, m);
    }
    const byCourse = Array.from(byCourseMap.entries())
      .map(([courseId, m]) => {
        const c = courseById.get(courseId)!;
        return {
          course: {
            id: c.id,
            slug: c.slug,
            title: c.title,
            titleArabic: c.titleArabic,
          },
          orderCount: m.count,
          gross: m.gross,
        };
      })
      .sort((a, b) => b.gross - a.gross);

    const recent = orders.slice(0, 10).map((o) => ({
      id: o.id,
      amount: o.amount,
      currency: o.currency,
      paidAt: o.paidAt ?? o.createdAt,
      courseId: o.courseId,
      courseTitle: o.courseId ? (courseById.get(o.courseId)?.title ?? "") : "",
      student: o.user,
    }));

    return {
      totalGross,
      last30Gross,
      currency: orders[0]?.currency ?? "usd",
      orderCount: orders.length,
      byCourse,
      recent,
    };
  },

  async remove(id: string): Promise<void> {
    const profile = await prisma.instructorProfile.findUnique({
      where: { id },
      select: { userId: true, courses: { where: { isDeleted: false }, select: { id: true } } },
    });
    if (!profile) throw new AppError(httpStatus.NOT_FOUND, "Instructor not found.");
    if (profile.courses.length > 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Instructor still has active courses. Reassign or delete them first.",
      );
    }

    await prisma.$transaction([
      prisma.refreshToken.updateMany({
        where: { userId: profile.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: profile.userId },
        data: { isDeleted: true, status: "DELETED" },
      }),
    ]);
  },
};

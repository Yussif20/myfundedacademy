import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { userHasCourseAccess } from "@/lib/payments/access";
import type { UserRoleEnum } from "@prisma/client";

const REVIEW_PUBLIC_INCLUDE = {
  user: { select: { id: true, fullName: true, profile: true, country: true } },
} as const;

export const ReviewsService = {
  async upsertCourseReview(
    slug: string,
    user: { id: string; role: UserRoleEnum },
    input: {
      rating: number;
      title?: string;
      titleArabic?: string;
      body?: string;
      bodyArabic?: string;
    },
  ) {
    const course = await prisma.course.findFirst({
      where: { slug, isDeleted: false, status: "PUBLISHED" },
      select: { id: true, accessTier: true },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    // Reviews are gated on enrollment / active sub / admin — same gate
    // as paid playback. Drives review quality and prevents drive-by trolling.
    const has = await userHasCourseAccess(user.id, course, user.role);
    if (!has) {
      throw new AppError(httpStatus.FORBIDDEN, "Only enrolled students can review this course.");
    }

    return prisma.review.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      create: {
        userId: user.id,
        courseId: course.id,
        rating: input.rating,
        title: input.title ?? "",
        titleArabic: input.titleArabic ?? "",
        body: input.body ?? "",
        bodyArabic: input.bodyArabic ?? "",
      },
      update: {
        rating: input.rating,
        title: input.title ?? "",
        titleArabic: input.titleArabic ?? "",
        body: input.body ?? "",
        bodyArabic: input.bodyArabic ?? "",
        isDeleted: false,
      },
    });
  },

  async listCourseReviews(
    slug: string,
    query: { page?: number | string; limit?: number | string },
  ) {
    const course = await prisma.course.findFirst({
      where: { slug, isDeleted: false, status: "PUBLISHED" },
      select: { id: true },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

    const where = { courseId: course.id, isDeleted: false };

    const [total, data, agg, distRaw] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: REVIEW_PUBLIC_INCLUDE,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.aggregate({ where, _avg: { rating: true } }),
      prisma.review.groupBy({
        by: ["rating"],
        where,
        _count: { rating: true },
      }),
    ]);

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of distRaw) {
      distribution[row.rating] = row._count.rating;
    }

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.max(1, Math.ceil(total / limit)),
        averageRating: agg._avg.rating ?? 0,
        distribution,
      },
    };
  },

  async getMyReview(slug: string, userId: string) {
    const course = await prisma.course.findFirst({
      where: { slug, isDeleted: false },
      select: { id: true },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    return prisma.review.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
  },

  async removeReview(id: string, requester: { id: string; role: UserRoleEnum }) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review || review.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Review not found.");
    }
    if (review.userId !== requester.id && requester.role !== "ADMIN") {
      throw new AppError(httpStatus.FORBIDDEN, "Not your review.");
    }
    await prisma.review.update({ where: { id }, data: { isDeleted: true } });
  },

  /** Aggregate helper used by course list/get to surface stars + count. */
  async summariesForCourses(courseIds: string[]) {
    if (courseIds.length === 0) return new Map<string, { avg: number; count: number }>();
    const rows = await prisma.review.groupBy({
      by: ["courseId"],
      where: { courseId: { in: courseIds }, isDeleted: false },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const map = new Map<string, { avg: number; count: number }>();
    for (const r of rows) {
      map.set(r.courseId, { avg: r._avg.rating ?? 0, count: r._count.rating });
    }
    return map;
  },
};

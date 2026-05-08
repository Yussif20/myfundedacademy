import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import AppError from "@/helpers/errors/AppError";
import { prisma } from "@/lib/db/db";
import { Prisma } from "@prisma/client";

export const EnrollmentsController = {
  listMine: catchAsync(async (req, res) => {
    if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            titleArabic: true,
            shortDescription: true,
            shortDescriptionArabic: true,
            thumbnail: true,
            totalLessons: true,
            totalDurationMin: true,
            level: true,
            instructor: { select: { user: { select: { fullName: true } } } },
          },
        },
      },
    });
    sendResponse(res, { statusCode: httpStatus.OK, data: enrollments });
  }),

  /**
   * Admin-only: every enrollment platform-wide. Annotated with completion
   * progress per (user, course). Optional search filters on student
   * name/email or course title; optional courseId narrows to one course.
   */
  listAll: catchAsync(async (req, res) => {
    const search = (req.query.search as string | undefined)?.trim() || undefined;
    const courseId = (req.query.courseId as string | undefined) || undefined;

    const where: Prisma.EnrollmentWhereInput = {
      user: { isDeleted: false },
      course: { isDeleted: false },
      ...(courseId ? { courseId } : {}),
      ...(search
        ? {
            OR: [
              { user: { fullName: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              { course: { title: { contains: search, mode: "insensitive" } } },
              { course: { titleArabic: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const enrollments = await prisma.enrollment.findMany({
      where,
      orderBy: { enrolledAt: "desc" },
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
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            titleArabic: true,
            totalLessons: true,
            instructor: {
              select: {
                id: true,
                user: { select: { id: true, fullName: true } },
              },
            },
          },
        },
      },
    });
    if (enrollments.length === 0) {
      sendResponse(res, { statusCode: httpStatus.OK, data: [] });
      return;
    }

    // Per (user, course) completed-lesson count in one query.
    const userIds = Array.from(new Set(enrollments.map((e) => e.userId)));
    const courseIds = Array.from(new Set(enrollments.map((e) => e.courseId)));
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

    const data = enrollments.map((e) => {
      const completedLessons = completionByKey.get(`${e.userId}:${e.courseId}`) ?? 0;
      const total = e.course.totalLessons;
      const progressPct =
        total > 0 ? Math.min(100, Math.round((completedLessons / total) * 100)) : 0;
      return {
        enrollmentId: e.id,
        enrolledAt: e.enrolledAt,
        expiresAt: e.expiresAt,
        source: e.source,
        student: e.user,
        course: {
          id: e.course.id,
          slug: e.course.slug,
          title: e.course.title,
          titleArabic: e.course.titleArabic,
          totalLessons: total,
          instructor: e.course.instructor
            ? {
                id: e.course.instructor.id,
                fullName: e.course.instructor.user.fullName,
              }
            : null,
        },
        completedLessons,
        progressPct,
      };
    });

    sendResponse(res, { statusCode: httpStatus.OK, data });
  }),
};

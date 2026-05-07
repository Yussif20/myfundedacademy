import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import AppError from "@/helpers/errors/AppError";
import { prisma } from "@/lib/db/db";

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
};

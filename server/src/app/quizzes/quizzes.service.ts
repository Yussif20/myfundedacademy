import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { generateRandomToken } from "@/utils/tokens";
import { userHasCourseAccess } from "@/lib/payments/access";
import type { UserRoleEnum } from "@prisma/client";

type AnswerMap = Record<string, string>; // questionId -> selectedOptionId

const QUIZ_INCLUDE_FOR_STUDENT = {
  questions: {
    orderBy: { order: "asc" } as const,
    include: {
      options: {
        orderBy: { order: "asc" } as const,
        // Only expose id + text — never isCorrect — to students.
        select: { id: true, text: true, textArabic: true, order: true },
      },
    },
  },
} as const;

const QUIZ_INCLUDE_FOR_ADMIN = {
  questions: {
    orderBy: { order: "asc" } as const,
    include: { options: { orderBy: { order: "asc" } } },
  },
} as const;

export const QuizzesService = {
  // ============== ADMIN ==============

  /**
   * Replaces the quiz for a course wholesale: nukes existing questions/
   * options, recreates from the input. Simpler than diffing for the MVP.
   */
  async upsertCourseQuiz(
    courseId: string,
    input: {
      title?: string;
      titleArabic?: string;
      passingScore?: number;
      questions: Array<{
        prompt: string;
        promptArabic?: string;
        explanation?: string;
        explanationArabic?: string;
        options: Array<{
          text: string;
          textArabic?: string;
          isCorrect?: boolean;
        }>;
      }>;
    },
  ) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, isDeleted: true },
    });
    if (!course || course.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    }

    return prisma.$transaction(async (tx) => {
      const existing = await tx.quiz.findUnique({ where: { courseId } });
      if (existing) {
        await tx.quizQuestion.deleteMany({ where: { quizId: existing.id } });
        await tx.quiz.update({
          where: { id: existing.id },
          data: {
            title: input.title ?? "",
            titleArabic: input.titleArabic ?? "",
            passingScore: input.passingScore ?? 70,
          },
        });
      } else {
        await tx.quiz.create({
          data: {
            courseId,
            title: input.title ?? "",
            titleArabic: input.titleArabic ?? "",
            passingScore: input.passingScore ?? 70,
          },
        });
      }

      const quiz = await tx.quiz.findUniqueOrThrow({ where: { courseId } });

      // Recreate questions + options
      for (let qi = 0; qi < input.questions.length; qi++) {
        const q = input.questions[qi];
        const created = await tx.quizQuestion.create({
          data: {
            quizId: quiz.id,
            prompt: q.prompt,
            promptArabic: q.promptArabic ?? "",
            explanation: q.explanation ?? "",
            explanationArabic: q.explanationArabic ?? "",
            order: qi,
          },
        });
        for (let oi = 0; oi < q.options.length; oi++) {
          const opt = q.options[oi];
          await tx.quizOption.create({
            data: {
              questionId: created.id,
              text: opt.text,
              textArabic: opt.textArabic ?? "",
              isCorrect: opt.isCorrect ?? false,
              order: oi,
            },
          });
        }
      }

      return tx.quiz.findUnique({ where: { courseId }, include: QUIZ_INCLUDE_FOR_ADMIN });
    });
  },

  async removeCourseQuiz(courseId: string): Promise<void> {
    await prisma.quiz.deleteMany({ where: { courseId } });
  },

  async getCourseQuizForAdmin(courseId: string) {
    return prisma.quiz.findUnique({
      where: { courseId },
      include: QUIZ_INCLUDE_FOR_ADMIN,
    });
  },

  // ============== STUDENT ==============

  /**
   * Returns the quiz with questions + options, but never reveals which
   * option is correct. The student's UI calls /attempt to grade.
   */
  async getCourseQuizForStudent(slug: string) {
    const course = await prisma.course.findFirst({
      where: { slug, isDeleted: false, status: "PUBLISHED" },
      select: { id: true },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    const quiz = await prisma.quiz.findUnique({
      where: { courseId: course.id },
      include: QUIZ_INCLUDE_FOR_STUDENT,
    });
    if (!quiz) throw new AppError(httpStatus.NOT_FOUND, "No quiz on this course yet.");
    return quiz;
  },

  async attemptQuiz(slug: string, user: { id: string; role: UserRoleEnum }, answers: AnswerMap) {
    const course = await prisma.course.findFirst({
      where: { slug, isDeleted: false, status: "PUBLISHED" },
      select: { id: true, accessTier: true },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    const has = await userHasCourseAccess(user.id, course, user.role);
    if (!has) {
      throw new AppError(httpStatus.FORBIDDEN, "You don't have access to this course.");
    }

    const quiz = await prisma.quiz.findUnique({
      where: { courseId: course.id },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) throw new AppError(httpStatus.NOT_FOUND, "No quiz on this course.");

    const total = quiz.questions.length;
    if (total === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Quiz has no questions yet.");
    }

    // Score: 1 point per question correctly answered.
    let correct = 0;
    const breakdown: Array<{
      questionId: string;
      selectedOptionId: string | null;
      correctOptionId: string | null;
      isCorrect: boolean;
    }> = [];

    for (const q of quiz.questions) {
      const correctOption = q.options.find((o) => o.isCorrect);
      const selectedId = answers[q.id] || null;
      const isCorrect = Boolean(selectedId && correctOption && selectedId === correctOption.id);
      if (isCorrect) correct++;
      breakdown.push({
        questionId: q.id,
        selectedOptionId: selectedId,
        correctOptionId: correctOption?.id ?? null,
        isCorrect,
      });
    }

    const score = Math.round((correct / total) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score,
        passed,
        answers: answers as never,
      },
    });

    return {
      attemptId: attempt.id,
      score,
      passed,
      passingScore: quiz.passingScore,
      total,
      correct,
      breakdown,
    };
  },

  // ============== CERTIFICATE ==============

  /**
   * Issues a certificate if and only if:
   *  - user has access to the course
   *  - all course lessons completed in Progress
   *  - if the course has a quiz, user has passed at least once
   * Idempotent: re-running for an already-issued cert returns the same row.
   */
  async issueCertificate(slug: string, user: { id: string; role: UserRoleEnum }) {
    const course = await prisma.course.findFirst({
      where: { slug, isDeleted: false, status: "PUBLISHED" },
      include: {
        sections: { include: { lessons: { select: { id: true } } } },
        quiz: { select: { id: true } },
      },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    const has = await userHasCourseAccess(
      user.id,
      { id: course.id, accessTier: course.accessTier },
      user.role,
    );
    if (!has) {
      throw new AppError(httpStatus.FORBIDDEN, "You don't have access to this course.");
    }

    const lessonIds = course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    if (lessonIds.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Course has no lessons yet.");
    }

    const completedCount = await prisma.progress.count({
      where: { userId: user.id, lessonId: { in: lessonIds }, completedAt: { not: null } },
    });
    if (completedCount < lessonIds.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Complete every lesson in this course before issuing a certificate.",
      );
    }

    let passedQuiz = false;
    if (course.quiz) {
      const passingAttempt = await prisma.quizAttempt.findFirst({
        where: { userId: user.id, quizId: course.quiz.id, passed: true },
      });
      if (!passingAttempt) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Pass the final quiz before issuing a certificate.",
        );
      }
      passedQuiz = true;
    }

    const cert = await prisma.certificate.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      create: {
        userId: user.id,
        courseId: course.id,
        passedQuiz,
        code: `MFA-${generateRandomToken(6)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "0")
          .slice(0, 8)}`,
      },
      update: { passedQuiz },
    });

    return cert;
  },

  async listMyCertificates(userId: string) {
    return prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            titleArabic: true,
            thumbnail: true,
            instructor: { select: { user: { select: { fullName: true } } } },
          },
        },
      },
    });
  },

  async getMyCertificateForCourse(userId: string, slug: string) {
    const course = await prisma.course.findFirst({
      where: { slug, isDeleted: false },
      select: { id: true },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    const cert = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            titleArabic: true,
            instructor: { select: { user: { select: { fullName: true } } } },
          },
        },
        user: { select: { fullName: true, email: true } },
      },
    });
    if (!cert) throw new AppError(httpStatus.NOT_FOUND, "No certificate yet.");
    return cert;
  },

  /** Public — anyone with the code can verify validity. */
  async verifyCertificate(code: string) {
    const cert = await prisma.certificate.findUnique({
      where: { code },
      include: {
        course: { select: { title: true, titleArabic: true, slug: true } },
        user: { select: { fullName: true } },
      },
    });
    if (!cert) throw new AppError(httpStatus.NOT_FOUND, "Certificate not found.");
    return cert;
  },
};

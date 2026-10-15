import { randomUUID } from "node:crypto";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateRandomToken } from "@/utils/tokens";
import {
  DEMO_ADMIN,
  DEMO_CATEGORIES,
  DEMO_COURSES,
  DEMO_INSTRUCTORS,
  DEMO_LEARNERS,
  DEMO_REVIEWS,
  DEMO_STUDENT,
  DEMO_VIDEOS,
} from "./demo.data";

type Tx = Prisma.TransactionClient;

export type DemoResetSummary = {
  deleted: { users: number; courses: number };
  created: {
    users: number;
    courses: number;
    lessons: number;
    enrollments: number;
    orders: number;
    reviews: number;
  };
  ms: number;
};

const DAY = 24 * 3600_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY);

/**
 * Deletes everything owned by demo accounts. Scope is strictly:
 *   1. courses whose instructor's user has isDemo = true (their sections,
 *      lessons, enrolments, quizzes, reviews and certificates cascade), then
 *   2. users with isDemo = true (their tokens, orders, progress, … cascade).
 * Categories are shared and only ever upserted, never deleted.
 */
async function wipeDemoData(tx: Tx) {
  const courses = await tx.course.deleteMany({
    where: { instructor: { user: { isDemo: true } } },
  });
  const users = await tx.user.deleteMany({ where: { isDemo: true } });
  return { users: users.count, courses: courses.count };
}

async function countNonDemo(tx: Tx) {
  const [users, courses] = await Promise.all([
    tx.user.count({ where: { isDemo: false } }),
    tx.course.count({ where: { instructor: { user: { isDemo: false } } } }),
  ]);
  return { users, courses };
}

/** Deterministic pseudo-random so every reset produces the same data. */
const pick = (seed: number, n: number) => ((seed * 9301 + 49297) % 233280) % n;

async function createDemoData(tx: Tx) {
  // ---- Categories (shared; upsert by slug) ----
  const categoryIds = new Map<string, string>();
  for (const [i, c] of DEMO_CATEGORIES.entries()) {
    const row = await tx.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.name[0],
        nameArabic: c.name[1],
        description: c.description[0],
        descriptionArabic: c.description[1],
        icon: c.icon,
        order: i,
        isFeatured: true,
      },
    });
    categoryIds.set(c.slug, row.id);
  }

  // ---- Users ----
  const users: Prisma.UserCreateManyInput[] = [];
  const base = { isDemo: true, isEmailVerified: true, password: null, status: "ACTIVE" as const };

  const studentId = randomUUID();
  users.push({ ...base, id: studentId, email: DEMO_STUDENT.email, fullName: DEMO_STUDENT.fullName, country: DEMO_STUDENT.country, role: "STUDENT", createdAt: daysAgo(120) });
  users.push({ ...base, id: randomUUID(), email: DEMO_ADMIN.email, fullName: DEMO_ADMIN.fullName, country: DEMO_ADMIN.country, role: "ADMIN", createdAt: daysAgo(400) });

  const instructorUserIds = new Map<string, string>();
  for (const ins of DEMO_INSTRUCTORS) {
    const id = randomUUID();
    instructorUserIds.set(ins.key, id);
    users.push({ ...base, id, email: ins.email, fullName: ins.fullName, country: ins.country, bio: ins.bio[0], role: "INSTRUCTOR", createdAt: daysAgo(300) });
  }

  const learnerIds: string[] = [];
  for (const [i, l] of DEMO_LEARNERS.entries()) {
    const id = randomUUID();
    learnerIds.push(id);
    users.push({ ...base, id, email: l.email, fullName: l.fullName, country: l.country, preferredLocale: l.locale, role: "STUDENT", createdAt: daysAgo(100 - i * 5) });
  }
  await tx.user.createMany({ data: users });

  const profileIds = new Map<string, string>();
  await tx.instructorProfile.createMany({
    data: DEMO_INSTRUCTORS.map((ins, i) => {
      const id = randomUUID();
      profileIds.set(ins.key, id);
      return {
        id,
        userId: instructorUserIds.get(ins.key)!,
        headline: ins.headline[0],
        headlineArabic: ins.headline[1],
        bio: ins.bio[0],
        bioArabic: ins.bio[1],
        expertise: ins.expertise,
        isFeatured: i < 2,
      };
    }),
  });

  // ---- Courses, sections, lessons, quizzes ----
  const courses: Prisma.CourseCreateManyInput[] = [];
  const sections: Prisma.SectionCreateManyInput[] = [];
  const lessons: Prisma.LessonCreateManyInput[] = [];
  const quizzes: Prisma.QuizCreateManyInput[] = [];
  const questions: Prisma.QuizQuestionCreateManyInput[] = [];
  const options: Prisma.QuizOptionCreateManyInput[] = [];

  type CourseInfo = {
    id: string;
    slug: string;
    price: number;
    lessonIds: string[];
    quizId: string;
    answers: Record<string, string>;
  };
  const info: CourseInfo[] = [];
  let videoIdx = 0;

  for (const [ci, c] of DEMO_COURSES.entries()) {
    const courseId = randomUUID();
    const lessonIds: string[] = [];
    let totalMin = 0;

    c.sections.forEach((s, si) => {
      const sectionId = randomUUID();
      sections.push({ id: sectionId, courseId, title: s.title[0], titleArabic: s.title[1], order: si });
      s.lessons.forEach(([en, ar, minutes], li) => {
        const video = DEMO_VIDEOS[videoIdx++ % DEMO_VIDEOS.length];
        const id = randomUUID();
        lessonIds.push(id);
        totalMin += minutes;
        lessons.push({
          id,
          sectionId,
          title: en,
          titleArabic: ar,
          description: `Demo lesson. Sample video: ${video.credit}.`,
          descriptionArabic: `درس تجريبي. الفيديو للعرض فقط: ${video.credit}.`,
          order: li,
          vdoVideoId: `mp4:${video.url}`,
          durationMin: minutes,
          isFreePreview: si === 0 && li === 0,
        });
      });
    });

    const quizId = randomUUID();
    quizzes.push({
      id: quizId,
      courseId,
      title: "Final quiz",
      titleArabic: "الاختبار النهائي",
      passingScore: 70,
    });
    const answers: Record<string, string> = {};
    c.quiz.forEach((q, qi) => {
      const questionId = randomUUID();
      questions.push({
        id: questionId,
        quizId,
        prompt: q.prompt[0],
        promptArabic: q.prompt[1],
        explanation: q.explanation[0],
        explanationArabic: q.explanation[1],
        order: qi,
      });
      q.options.forEach((o, oi) => {
        const optionId = randomUUID();
        if (oi === q.correct) answers[questionId] = optionId;
        options.push({ id: optionId, questionId, text: o[0], textArabic: o[1], isCorrect: oi === q.correct, order: oi });
      });
    });

    courses.push({
      id: courseId,
      slug: c.slug,
      title: c.title[0],
      titleArabic: c.title[1],
      shortDescription: c.short[0],
      shortDescriptionArabic: c.short[1],
      description: c.description[0],
      descriptionArabic: c.description[1],
      thumbnail: `/demo/courses/${c.slug}.svg`,
      level: c.level,
      language: c.language,
      status: "PUBLISHED",
      oneTimePrice: c.price,
      accessTier: c.accessTier,
      totalDurationMin: totalMin,
      totalLessons: lessonIds.length,
      isFeatured: c.featured,
      publishedAt: daysAgo(150 - ci * 10),
      createdAt: daysAgo(160 - ci * 10),
      categoryId: categoryIds.get(c.category) ?? null,
      instructorId: profileIds.get(c.instructor)!,
    });
    info.push({ id: courseId, slug: c.slug, price: c.price, lessonIds, quizId, answers });
  }

  await tx.course.createMany({ data: courses });
  await tx.section.createMany({ data: sections });
  await tx.lesson.createMany({ data: lessons });
  await tx.quiz.createMany({ data: quizzes });
  await tx.quizQuestion.createMany({ data: questions });
  await tx.quizOption.createMany({ data: options });

  // ---- Enrolments, orders, reviews, progress ----
  const enrollments: Prisma.EnrollmentCreateManyInput[] = [];
  const orders: Prisma.OrderCreateManyInput[] = [];
  const reviews: Prisma.ReviewCreateManyInput[] = [];
  const progress: Prisma.ProgressCreateManyInput[] = [];
  const attempts: Prisma.QuizAttemptCreateManyInput[] = [];
  const certificates: Prisma.CertificateCreateManyInput[] = [];

  const enrol = (userId: string, course: CourseInfo, when: Date) => {
    enrollments.push({ userId, courseId: course.id, source: course.price > 0 ? "PURCHASE" : "FREE", enrolledAt: when });
    if (course.price > 0) {
      orders.push({
        userId,
        courseId: course.id,
        type: "ONE_TIME",
        status: "COMPLETED",
        amount: course.price,
        currency: "usd",
        paidAt: when,
        createdAt: when,
      });
    }
  };

  // Learners: each takes 3–5 courses, spread over the last ~90 days so the
  // instructor earnings and admin charts have a shape.
  learnerIds.forEach((userId, li) => {
    const count = 3 + (li % 3);
    const taken = new Set<number>();
    for (let k = 0; taken.size < count; k++) taken.add(pick(li * 7 + k * 13 + 3, info.length));
    [...taken].forEach((ci, k) => {
      const course = info[ci];
      const when = daysAgo(2 + pick(li * 31 + k * 17, 88));
      enrol(userId, course, when);

      const done = pick(li + k * 5, course.lessonIds.length + 1);
      course.lessonIds.slice(0, done).forEach((lessonId, n) =>
        progress.push({ userId, lessonId, lastWatchedSeconds: 0, completedAt: new Date(when.getTime() + (n + 1) * DAY) }),
      );

      if ((li + k) % 2 === 0) {
        const r = DEMO_REVIEWS[pick(li * 3 + k * 11, DEMO_REVIEWS.length)];
        reviews.push({
          userId,
          courseId: course.id,
          rating: r.rating,
          title: r.title[0],
          titleArabic: r.title[1],
          body: r.body[0],
          bodyArabic: r.body[1],
          createdAt: new Date(when.getTime() + 5 * DAY),
        });
      }
    });
  });

  // Demo student: one finished course with a passed quiz and certificate,
  // one in progress, one free course just started.
  const bySlug = new Map(info.map((c) => [c.slug, c]));
  const finished = bySlug.get("demo-arabic-calligraphy-naskh")!;
  const inProgress = bySlug.get("demo-react-typescript")!;
  const started = bySlug.get("demo-html-css-basics")!;

  enrol(studentId, finished, daysAgo(40));
  enrol(studentId, inProgress, daysAgo(12));
  enrol(studentId, started, daysAgo(3));

  finished.lessonIds.forEach((lessonId, n) =>
    progress.push({ userId: studentId, lessonId, completedAt: daysAgo(38 - n * 3) }),
  );
  inProgress.lessonIds.slice(0, 3).forEach((lessonId, n) =>
    progress.push({ userId: studentId, lessonId, completedAt: daysAgo(10 - n * 2) }),
  );
  progress.push({ userId: studentId, lessonId: started.lessonIds[0], completedAt: daysAgo(2) });

  attempts.push({
    userId: studentId,
    quizId: finished.quizId,
    score: 100,
    passed: true,
    answers: finished.answers,
    completedAt: daysAgo(17),
  });
  certificates.push({
    userId: studentId,
    courseId: finished.id,
    passedQuiz: true,
    issuedAt: daysAgo(17),
    code: `NB-${generateRandomToken(6).toUpperCase().replace(/[^A-Z0-9]/g, "0").slice(0, 8)}`,
  });
  reviews.push({
    userId: studentId,
    courseId: finished.id,
    rating: 5,
    title: "My first framed phrase!",
    titleArabic: "أول عبارة أؤطّرها!",
    body: "The dot measurements finally made proportions click for me.",
    bodyArabic: "القياس بالنقاط جعل النِّسَب واضحة لي أخيرًا.",
    createdAt: daysAgo(16),
  });

  await tx.enrollment.createMany({ data: enrollments, skipDuplicates: true });
  await tx.order.createMany({ data: orders });
  await tx.review.createMany({ data: reviews, skipDuplicates: true });
  await tx.progress.createMany({ data: progress, skipDuplicates: true });
  await tx.quizAttempt.createMany({ data: attempts });
  await tx.certificate.createMany({ data: certificates });

  return {
    users: users.length,
    courses: courses.length,
    lessons: lessons.length,
    enrollments: enrollments.length,
    orders: orders.length,
    reviews: reviews.length,
  };
}

/**
 * Idempotent: wipes demo-owned data and recreates it in one transaction.
 * Aborts (and rolls back) if the number of non-demo users or courses changes.
 */
export async function resetDemoData(prisma: PrismaClient): Promise<DemoResetSummary> {
  const started = Date.now();
  return prisma.$transaction(
    async (tx) => {
      const before = await countNonDemo(tx);
      const deleted = await wipeDemoData(tx);
      const created = await createDemoData(tx);
      const after = await countNonDemo(tx);
      if (before.users !== after.users || before.courses !== after.courses) {
        throw new Error(
          `Demo reset aborted: non-demo data changed (users ${before.users}→${after.users}, courses ${before.courses}→${after.courses}).`,
        );
      }
      return { deleted, created, ms: Date.now() - started };
    },
    { timeout: 120_000, maxWait: 20_000 },
  );
}

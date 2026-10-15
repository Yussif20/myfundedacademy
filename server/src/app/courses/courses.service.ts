import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { slugify } from "@/utils/slug";
import { Prisma, UserRoleEnum } from "@prisma/client";
import { deleteObject } from "@/lib/storage/r2";
import { deleteVideo } from "@/lib/video/vdocipher";
import { userHasCourseAccess } from "@/lib/payments/access";

type Actor = { id: string; role: UserRoleEnum };

/** Adapt an Actor (writer side) to the viewer shape that get() expects. */
const actorToViewer = (actor: Actor) => ({
  isAdmin: actor.role === "ADMIN",
  userId: actor.id,
  role: actor.role,
});

/**
 * Resolves the InstructorProfile.id for a given user, or null if the user
 * doesn't have one. Cached implicitly per request via Prisma's connection.
 */
async function getInstructorProfileId(userId: string): Promise<string | null> {
  const profile = await prisma.instructorProfile.findFirst({
    where: { userId },
    select: { id: true },
  });
  return profile?.id ?? null;
}

/**
 * Throws 403 unless the actor owns the course (instructor) or is an admin.
 * Call as the FIRST thing inside any mutation that touches a course.
 */
export async function assertCourseOwnership(courseId: string, actor: Actor): Promise<void> {
  if (actor.role === "ADMIN") return;
  if (actor.role !== "INSTRUCTOR") {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission for this action.");
  }
  const [course, profileId] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true, isDeleted: true },
    }),
    getInstructorProfileId(actor.id),
  ]);
  if (!course || course.isDeleted) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
  if (!profileId) throw new AppError(httpStatus.FORBIDDEN, "No instructor profile on file.");
  if (course.instructorId !== profileId) {
    throw new AppError(httpStatus.FORBIDDEN, "You don't have access to this course.");
  }
}

async function assertSectionOwnership(sectionId: string, actor: Actor): Promise<void> {
  if (actor.role === "ADMIN") return;
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { courseId: true },
  });
  if (!section) throw new AppError(httpStatus.NOT_FOUND, "Section not found.");
  return assertCourseOwnership(section.courseId, actor);
}

async function assertLessonOwnership(lessonId: string, actor: Actor): Promise<void> {
  if (actor.role === "ADMIN") return;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { section: { select: { courseId: true } } },
  });
  if (!lesson) throw new AppError(httpStatus.NOT_FOUND, "Lesson not found.");
  return assertCourseOwnership(lesson.section.courseId, actor);
}

const COURSE_LIST_INCLUDE = {
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
  _count: { select: { sections: true, reviews: { where: { isDeleted: false } } } },
} as const;

const COURSE_DETAIL_INCLUDE = {
  ...COURSE_LIST_INCLUDE,
  sections: {
    orderBy: { order: "asc" } as const,
    include: {
      lessons: {
        orderBy: { order: "asc" } as const,
        include: { attachments: true },
      },
    },
  },
} as const;

const recomputeTotals = async (courseId: string) => {
  const sections = await prisma.section.findMany({
    where: { courseId },
    include: { lessons: { select: { durationMin: true } } },
  });
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalDurationMin = sections.reduce(
    (acc, s) => acc + s.lessons.reduce((a, l) => a + (l.durationMin || 0), 0),
    0,
  );
  await prisma.course.update({
    where: { id: courseId },
    data: { totalLessons, totalDurationMin },
  });
};

export const CoursesService = {
  // ---------- Catalog ----------
  async list(
    query: {
      page?: number | string;
      limit?: number | string;
      categoryId?: string;
      categorySlug?: string;
      instructorId?: string;
      status?: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
      featured?: boolean | string;
      search?: string;
    },
    viewer?: { isAdmin: boolean },
  ) {
    // req.query values may arrive as strings; coerce defensively.
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const featured =
      query.featured === undefined
        ? undefined
        : query.featured === true || query.featured === "true";

    // Public callers (non-admin) only see PUBLISHED courses, regardless of
    // any status filter they pass.
    const isAdmin = viewer?.isAdmin === true;
    const status = isAdmin ? query.status : "PUBLISHED";

    const where: Prisma.CourseWhereInput = {
      isDeleted: false,
      ...(status ? { status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.categorySlug ? { category: { slug: query.categorySlug } } : {}),
      ...(query.instructorId ? { instructorId: query.instructorId } : {}),
      ...(featured !== undefined ? { isFeatured: featured } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: "insensitive" } },
              { shortDescription: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, courses] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        include: COURSE_LIST_INCLUDE,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    // Annotate average rating per course (one DB roundtrip).
    const { ReviewsService } = await import("@/app/reviews/reviews.service");
    const summaries = await ReviewsService.summariesForCourses(courses.map((c) => c.id));
    const data = courses.map((c) => {
      const s = summaries.get(c.id);
      return {
        ...c,
        averageRating: s?.avg ?? 0,
        reviewCount: s?.count ?? 0,
      };
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },

  async get(idOrSlug: string, viewer?: { isAdmin: boolean; userId?: string; role?: UserRoleEnum }) {
    const isAdmin = viewer?.isAdmin === true;

    // Instructors can fetch their own courses regardless of status so they
    // can edit drafts; everyone else is locked to PUBLISHED.
    const myInstructorProfileId =
      viewer?.role === "INSTRUCTOR" && viewer?.userId
        ? await getInstructorProfileId(viewer.userId)
        : null;

    const course = await prisma.course.findFirst({
      where: {
        AND: [
          { isDeleted: false },
          { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
          isAdmin
            ? {}
            : myInstructorProfileId
              ? { OR: [{ status: "PUBLISHED" }, { instructorId: myInstructorProfileId }] }
              : { status: "PUBLISHED" },
        ],
      },
      include: COURSE_DETAIL_INCLUDE,
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    const isOwner = !!myInstructorProfileId && myInstructorProfileId === course.instructorId;

    const viewerHasAccess = await userHasCourseAccess(
      viewer?.userId,
      { id: course.id, accessTier: course.accessTier },
      viewer?.role,
    );

    // Annotate review summary
    const { ReviewsService } = await import("@/app/reviews/reviews.service");
    const summaries = await ReviewsService.summariesForCourses([course.id]);
    const summary = summaries.get(course.id);
    const reviewMeta = {
      averageRating: summary?.avg ?? 0,
      reviewCount: summary?.count ?? 0,
    };

    // Hide vdoVideoId on non-preview lessons for public callers without
    // access — defence in depth so the raw ID can't be used by a determined
    // visitor. Admins, owning instructors, and enrolled users see all IDs.
    if (!isAdmin && !isOwner && !viewerHasAccess) {
      return {
        ...course,
        ...reviewMeta,
        viewerHasAccess: false,
        sections: course.sections.map((s) => ({
          ...s,
          lessons: s.lessons.map((l) => ({
            ...l,
            vdoVideoId: l.isFreePreview ? l.vdoVideoId : "",
          })),
        })),
      };
    }
    return { ...course, ...reviewMeta, viewerHasAccess: true };
  },

  /**
   * Issues a short-lived VdoCipher OTP for a free-preview lesson on a
   * published course. Public — no auth required.
   */
  async getPreviewOtp(lessonId: string, viewerInfo: { ip: string; userAgent: string }) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: {
            course: { select: { status: true, isDeleted: true } },
          },
        },
      },
    });
    if (!lesson) throw new AppError(httpStatus.NOT_FOUND, "Lesson not found.");
    if (!lesson.isFreePreview) {
      throw new AppError(httpStatus.FORBIDDEN, "This lesson is not available as a preview.");
    }
    if (lesson.section.course.isDeleted || lesson.section.course.status !== "PUBLISHED") {
      throw new AppError(httpStatus.NOT_FOUND, "Lesson not available.");
    }
    if (!lesson.vdoVideoId) {
      throw new AppError(httpStatus.NOT_FOUND, "No video uploaded for this lesson yet.");
    }

    const { getPlaybackSource } = await import("@/lib/video/provider");
    return getPlaybackSource({
      videoId: lesson.vdoVideoId,
      ttlSeconds: 300,
      annotation: [
        {
          type: "rtext",
          text: `Preview · ${viewerInfo.ip || "anonymous"}`,
          alpha: "0.6",
          color: "0xFFFFFF",
          size: "12",
          interval: "5000",
        },
      ],
    });
  },

  /**
   * Authenticated playback OTP for an enrolled student. Watermark burns
   * the viewer's email + IP into every play so any leak is traceable.
   * Free-preview lessons skip the access check (anyone can play those).
   */
  async getAuthenticatedPlaybackOtp(
    lessonId: string,
    viewer: { userId: string; email: string; role: UserRoleEnum; ip: string },
  ) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: {
            course: {
              select: { id: true, status: true, isDeleted: true, accessTier: true },
            },
          },
        },
      },
    });
    if (!lesson) throw new AppError(httpStatus.NOT_FOUND, "Lesson not found.");
    if (lesson.section.course.isDeleted || lesson.section.course.status !== "PUBLISHED") {
      throw new AppError(httpStatus.NOT_FOUND, "Lesson not available.");
    }
    if (!lesson.vdoVideoId) {
      throw new AppError(httpStatus.NOT_FOUND, "No video uploaded for this lesson yet.");
    }

    if (!lesson.isFreePreview) {
      const has = await userHasCourseAccess(
        viewer.userId,
        { id: lesson.section.course.id, accessTier: lesson.section.course.accessTier },
        viewer.role,
      );
      if (!has) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You don't have access to this course. Enroll or subscribe to start watching.",
        );
      }
    }

    const { getPlaybackSource } = await import("@/lib/video/provider");
    return getPlaybackSource({
      videoId: lesson.vdoVideoId,
      ttlSeconds: 600,
      annotation: [
        {
          type: "rtext",
          text: `${viewer.email} · ${viewer.ip}`,
          alpha: "0.7",
          color: "0xFFFFFF",
          size: "14",
          interval: "5000",
        },
      ],
    });
  },

  /**
   * Upserts a per-user, per-lesson progress row. Pass `completed: true` to
   * mark the lesson done; `false` to undo. lastWatchedSeconds is monotonic
   * — we never decrease it (so a brief seek-backwards doesn't lose state).
   */
  async upsertProgress(
    userId: string,
    lessonId: string,
    input: { completed?: boolean; lastWatchedSeconds?: number },
    viewerRole?: UserRoleEnum,
  ) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          select: {
            course: { select: { id: true, status: true, isDeleted: true, accessTier: true } },
          },
        },
      },
    });
    if (!lesson) throw new AppError(httpStatus.NOT_FOUND, "Lesson not found.");
    if (lesson.section.course.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Lesson not available.");
    }

    if (!lesson.isFreePreview) {
      const has = await userHasCourseAccess(
        userId,
        { id: lesson.section.course.id, accessTier: lesson.section.course.accessTier },
        viewerRole,
      );
      if (!has) {
        throw new AppError(httpStatus.FORBIDDEN, "You don't have access to this course.");
      }
    }

    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    const lastWatched =
      input.lastWatchedSeconds !== undefined
        ? Math.max(input.lastWatchedSeconds, existing?.lastWatchedSeconds ?? 0)
        : (existing?.lastWatchedSeconds ?? 0);

    const completedAt =
      input.completed === true
        ? (existing?.completedAt ?? new Date())
        : input.completed === false
          ? null
          : (existing?.completedAt ?? null);

    return prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, lastWatchedSeconds: lastWatched, completedAt },
      update: { lastWatchedSeconds: lastWatched, completedAt },
    });
  },

  /**
   * All progress rows for a course, scoped to one user. Frontend uses this
   * to render the curriculum tree with completion checkmarks.
   */
  async getCourseProgress(idOrSlug: string, userId: string) {
    const course = await prisma.course.findFirst({
      where: { isDeleted: false, OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      select: {
        id: true,
        sections: {
          select: {
            lessons: { select: { id: true } },
          },
        },
      },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    const lessonIds = course.sections.flatMap((s) => s.lessons.map((l) => l.id));
    if (lessonIds.length === 0) return [];

    return prisma.progress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
      orderBy: { updatedAt: "desc" },
    });
  },

  // ---------- Course CRUD ----------
  async create(
    input: {
      title: string;
      titleArabic?: string;
      shortDescription?: string;
      shortDescriptionArabic?: string;
      description?: string;
      descriptionArabic?: string;
      thumbnail?: string;
      promoVideoVdoId?: string;
      level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
      language?: "EN" | "AR" | "BOTH";
      oneTimePrice?: number;
      accessTier?: "FREE" | "STARTER" | "PRO";
      isFeatured?: boolean;
      categoryId?: string | null;
      instructorId?: string;
    },
    actor: Actor,
  ) {
    // Instructors can only create courses for themselves; admins can target any.
    let instructorId = input.instructorId;
    if (actor.role === "INSTRUCTOR") {
      const ownProfileId = await getInstructorProfileId(actor.id);
      if (!ownProfileId) throw new AppError(httpStatus.FORBIDDEN, "No instructor profile on file.");
      instructorId = ownProfileId;
    }
    if (!instructorId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Instructor is required.");
    }
    if (actor.role !== "ADMIN" && actor.role !== "INSTRUCTOR") {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission for this action.");
    }

    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: instructorId },
      select: { id: true },
    });
    if (!instructor) throw new AppError(httpStatus.BAD_REQUEST, "Instructor does not exist.");

    if (input.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
        select: { id: true, isDeleted: true },
      });
      if (!category || category.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category does not exist.");
      }
    }

    let slug = slugify(input.title);
    let n = 1;
    while (await prisma.course.findUnique({ where: { slug } })) {
      n++;
      slug = `${slugify(input.title)}-${n}`;
    }

    const course = await prisma.course.create({
      data: {
        slug,
        title: input.title,
        titleArabic: input.titleArabic || "",
        shortDescription: input.shortDescription || "",
        shortDescriptionArabic: input.shortDescriptionArabic || "",
        description: input.description || "",
        descriptionArabic: input.descriptionArabic || "",
        thumbnail: input.thumbnail || "",
        promoVideoVdoId: input.promoVideoVdoId || "",
        level: input.level || "ALL_LEVELS",
        language: input.language || "EN",
        oneTimePrice: input.oneTimePrice ?? 0,
        accessTier: input.accessTier || "FREE",
        isFeatured: input.isFeatured ?? false,
        categoryId: input.categoryId ?? null,
        instructorId,
        status: "DRAFT",
      },
    });

    return CoursesService.get(course.id, actorToViewer(actor));
  },

  async update(
    id: string,
    input: Partial<{
      title: string;
      titleArabic: string;
      shortDescription: string;
      shortDescriptionArabic: string;
      description: string;
      descriptionArabic: string;
      thumbnail: string;
      promoVideoVdoId: string;
      level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
      language: "EN" | "AR" | "BOTH";
      oneTimePrice: number;
      accessTier: "FREE" | "STARTER" | "PRO";
      isFeatured: boolean;
      categoryId: string | null;
      instructorId: string;
    }>,
    actor: Actor,
  ) {
    await assertCourseOwnership(id, actor);

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    }

    // Only admins can reassign a course to a different instructor or toggle isFeatured.
    const safeInput = { ...input };
    if (actor.role !== "ADMIN") {
      delete safeInput.instructorId;
      delete safeInput.isFeatured;
    }

    if (safeInput.categoryId !== undefined && safeInput.categoryId !== null) {
      const category = await prisma.category.findUnique({
        where: { id: safeInput.categoryId },
        select: { id: true, isDeleted: true },
      });
      if (!category || category.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category does not exist.");
      }
    }
    if (safeInput.instructorId !== undefined) {
      const instructor = await prisma.instructorProfile.findUnique({
        where: { id: safeInput.instructorId },
        select: { id: true },
      });
      if (!instructor) throw new AppError(httpStatus.BAD_REQUEST, "Instructor does not exist.");
    }

    await prisma.course.update({
      where: { id },
      data: safeInput as Prisma.CourseUpdateInput,
    });

    return CoursesService.get(id, actorToViewer(actor));
  },

  async remove(id: string, actor: Actor): Promise<void> {
    await assertCourseOwnership(id, actor);

    const course = await prisma.course.findUnique({
      where: { id },
      include: { sections: { include: { lessons: { include: { attachments: true } } } } },
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    // Best-effort cleanup of remote storage. DB delete proceeds even on remote failures.
    const cleanup: Promise<unknown>[] = [];
    if (course.thumbnail) {
      const key = course.thumbnail.split("/").slice(-2).join("/"); // e.g. "thumbnails/xxx-foo.png"
      cleanup.push(deleteObject(key).catch(() => undefined));
    }
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (lesson.vdoVideoId) {
          cleanup.push(deleteVideo(lesson.vdoVideoId).catch(() => undefined));
        }
        for (const a of lesson.attachments) {
          cleanup.push(deleteObject(a.fileKey).catch(() => undefined));
        }
      }
    }
    await Promise.all(cleanup);

    await prisma.course.update({
      where: { id },
      data: { isDeleted: true, status: "DRAFT", isFeatured: false },
    });
  },

  async publish(id: string, actor: Actor) {
    await assertCourseOwnership(id, actor);
    const course = await prisma.course.findUnique({
      where: { id },
      include: { sections: { include: { lessons: true } } },
    });
    if (!course || course.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    }
    if (course.sections.length === 0 || course.sections.every((s) => s.lessons.length === 0)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Course must have at least one section with one lesson before publishing.",
      );
    }
    await prisma.course.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: course.publishedAt || new Date() },
    });
    return CoursesService.get(id, actorToViewer(actor));
  },

  async unpublish(id: string, actor: Actor) {
    await assertCourseOwnership(id, actor);
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || course.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    }
    await prisma.course.update({ where: { id }, data: { status: "DRAFT" } });
    return CoursesService.get(id, actorToViewer(actor));
  },

  // ---------- Sections ----------
  async createSection(
    courseId: string,
    input: { title: string; titleArabic?: string; order?: number },
    actor: Actor,
  ) {
    await assertCourseOwnership(courseId, actor);
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.isDeleted) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");

    const order = input.order ?? ((await prisma.section.count({ where: { courseId } })) || 0);

    const section = await prisma.section.create({
      data: {
        courseId,
        title: input.title,
        titleArabic: input.titleArabic || "",
        order,
      },
      include: { lessons: { orderBy: { order: "asc" }, include: { attachments: true } } },
    });
    return section;
  },

  async updateSection(
    id: string,
    input: Partial<{ title: string; titleArabic: string; order: number }>,
    actor: Actor,
  ) {
    await assertSectionOwnership(id, actor);
    return prisma.section.update({
      where: { id },
      data: input,
      include: { lessons: { orderBy: { order: "asc" }, include: { attachments: true } } },
    });
  },

  async removeSection(id: string, actor: Actor): Promise<void> {
    await assertSectionOwnership(id, actor);

    const section = await prisma.section.findUnique({
      where: { id },
      include: { lessons: { include: { attachments: true } } },
    });
    if (!section) throw new AppError(httpStatus.NOT_FOUND, "Section not found.");
    const cleanup: Promise<unknown>[] = [];
    for (const lesson of section.lessons) {
      if (lesson.vdoVideoId) cleanup.push(deleteVideo(lesson.vdoVideoId).catch(() => undefined));
      for (const a of lesson.attachments)
        cleanup.push(deleteObject(a.fileKey).catch(() => undefined));
    }
    await Promise.all(cleanup);
    await prisma.section.delete({ where: { id } });
    await recomputeTotals(section.courseId);
  },

  async reorderSections(courseId: string, ids: string[], actor: Actor) {
    await assertCourseOwnership(courseId, actor);
    await prisma.$transaction(
      ids.map((id, i) =>
        prisma.section.update({
          where: { id },
          data: { order: i, courseId },
        }),
      ),
    );
  },

  // ---------- Lessons ----------
  async createLesson(
    sectionId: string,
    input: {
      title: string;
      titleArabic?: string;
      description?: string;
      descriptionArabic?: string;
      vdoVideoId?: string;
      durationMin?: number;
      isFreePreview?: boolean;
      order?: number;
    },
    actor: Actor,
  ) {
    await assertSectionOwnership(sectionId, actor);
    const section = await prisma.section.findUnique({ where: { id: sectionId } });
    if (!section) throw new AppError(httpStatus.NOT_FOUND, "Section not found.");

    const order = input.order ?? ((await prisma.lesson.count({ where: { sectionId } })) || 0);

    const lesson = await prisma.lesson.create({
      data: {
        sectionId,
        title: input.title,
        titleArabic: input.titleArabic || "",
        description: input.description || "",
        descriptionArabic: input.descriptionArabic || "",
        vdoVideoId: input.vdoVideoId || "",
        durationMin: input.durationMin ?? 0,
        isFreePreview: input.isFreePreview ?? false,
        order,
      },
      include: { attachments: true },
    });
    await recomputeTotals(section.courseId);
    return lesson;
  },

  async updateLesson(
    id: string,
    input: Partial<{
      title: string;
      titleArabic: string;
      description: string;
      descriptionArabic: string;
      vdoVideoId: string;
      durationMin: number;
      isFreePreview: boolean;
      order: number;
    }>,
    actor: Actor,
  ) {
    await assertLessonOwnership(id, actor);
    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new AppError(httpStatus.NOT_FOUND, "Lesson not found.");

    // If replacing the video, delete the old one
    if (
      input.vdoVideoId !== undefined &&
      lesson.vdoVideoId &&
      input.vdoVideoId !== lesson.vdoVideoId
    ) {
      await deleteVideo(lesson.vdoVideoId).catch(() => undefined);
    }

    const updated = await prisma.lesson.update({
      where: { id },
      data: input,
      include: { attachments: true, section: { select: { courseId: true } } },
    });
    await recomputeTotals(updated.section.courseId);
    return updated;
  },

  async removeLesson(id: string, actor: Actor): Promise<void> {
    await assertLessonOwnership(id, actor);
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { attachments: true, section: { select: { courseId: true } } },
    });
    if (!lesson) throw new AppError(httpStatus.NOT_FOUND, "Lesson not found.");

    if (lesson.vdoVideoId) await deleteVideo(lesson.vdoVideoId).catch(() => undefined);
    for (const a of lesson.attachments) {
      await deleteObject(a.fileKey).catch(() => undefined);
    }

    await prisma.lesson.delete({ where: { id } });
    await recomputeTotals(lesson.section.courseId);
  },

  async reorderLessons(sectionId: string, ids: string[], actor: Actor) {
    await assertSectionOwnership(sectionId, actor);
    await prisma.$transaction(
      ids.map((id, i) =>
        prisma.lesson.update({
          where: { id },
          data: { order: i, sectionId },
        }),
      ),
    );
  },

  // ---------- Lesson attachments ----------
  async addAttachment(
    lessonId: string,
    input: { fileName: string; fileKey: string; fileSize?: number; fileType?: string },
    actor: Actor,
  ) {
    await assertLessonOwnership(lessonId, actor);
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new AppError(httpStatus.NOT_FOUND, "Lesson not found.");

    return prisma.lessonAttachment.create({
      data: {
        lessonId,
        fileName: input.fileName,
        fileKey: input.fileKey,
        fileSize: input.fileSize ?? 0,
        fileType: input.fileType || "",
      },
    });
  },

  async removeAttachment(lessonId: string, attachmentId: string, actor: Actor): Promise<void> {
    await assertLessonOwnership(lessonId, actor);
    const attachment = await prisma.lessonAttachment.findFirst({
      where: { id: attachmentId, lessonId },
    });
    if (!attachment) throw new AppError(httpStatus.NOT_FOUND, "Attachment not found.");

    await deleteObject(attachment.fileKey).catch(() => undefined);
    await prisma.lessonAttachment.delete({ where: { id: attachmentId } });
  },
};

import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { slugify } from "@/utils/slug";
import { Prisma } from "@prisma/client";
import { deleteObject } from "@/lib/storage/r2";
import { deleteVideo } from "@/lib/video/vdocipher";

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
  _count: { select: { sections: true } },
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
  async list(query: {
    page?: number | string;
    limit?: number | string;
    categoryId?: string;
    instructorId?: string;
    status?: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
    featured?: boolean | string;
    search?: string;
  }) {
    // req.query values may arrive as strings; coerce defensively.
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const featured =
      query.featured === undefined
        ? undefined
        : query.featured === true || query.featured === "true";

    const where: Prisma.CourseWhereInput = {
      isDeleted: false,
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
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

    const [total, data] = await Promise.all([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        include: COURSE_LIST_INCLUDE,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
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
  },

  async get(idOrSlug: string) {
    const course = await prisma.course.findFirst({
      where: { isDeleted: false, OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: COURSE_DETAIL_INCLUDE,
    });
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    return course;
  },

  // ---------- Course CRUD ----------
  async create(input: {
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
    instructorId: string;
  }) {
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: input.instructorId },
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
        instructorId: input.instructorId,
        status: "DRAFT",
      },
    });

    return CoursesService.get(course.id);
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
  ) {
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    }

    if (input.categoryId !== undefined && input.categoryId !== null) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
        select: { id: true, isDeleted: true },
      });
      if (!category || category.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category does not exist.");
      }
    }
    if (input.instructorId !== undefined) {
      const instructor = await prisma.instructorProfile.findUnique({
        where: { id: input.instructorId },
        select: { id: true },
      });
      if (!instructor) throw new AppError(httpStatus.BAD_REQUEST, "Instructor does not exist.");
    }

    await prisma.course.update({
      where: { id },
      data: input as Prisma.CourseUpdateInput,
    });

    return CoursesService.get(id);
  },

  async remove(id: string): Promise<void> {
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

  async publish(id: string) {
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
    return CoursesService.get(id);
  },

  async unpublish(id: string) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || course.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "Course not found.");
    }
    await prisma.course.update({ where: { id }, data: { status: "DRAFT" } });
    return CoursesService.get(id);
  },

  // ---------- Sections ----------
  async createSection(
    courseId: string,
    input: { title: string; titleArabic?: string; order?: number },
  ) {
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
  ) {
    return prisma.section.update({
      where: { id },
      data: input,
      include: { lessons: { orderBy: { order: "asc" }, include: { attachments: true } } },
    });
  },

  async removeSection(id: string): Promise<void> {
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

  async reorderSections(courseId: string, ids: string[]) {
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
  ) {
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
  ) {
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

  async removeLesson(id: string): Promise<void> {
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

  async reorderLessons(sectionId: string, ids: string[]) {
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
  ) {
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

  async removeAttachment(lessonId: string, attachmentId: string): Promise<void> {
    const attachment = await prisma.lessonAttachment.findFirst({
      where: { id: attachmentId, lessonId },
    });
    if (!attachment) throw new AppError(httpStatus.NOT_FOUND, "Attachment not found.");

    await deleteObject(attachment.fileKey).catch(() => undefined);
    await prisma.lessonAttachment.delete({ where: { id: attachmentId } });
  },
};

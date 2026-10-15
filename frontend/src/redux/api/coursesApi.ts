import { baseApi } from "./baseApi";

export type CourseStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type CourseLanguage = "EN" | "AR" | "BOTH";
export type AccessTier = "FREE" | "STARTER" | "PRO";

export type Lesson = {
  id: string;
  sectionId: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  vdoVideoId: string;
  durationMin: number;
  isFreePreview: boolean;
  order: number;
  attachments: LessonAttachment[];
  createdAt: string;
  updatedAt: string;
};

export type LessonAttachment = {
  id: string;
  lessonId: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
};

export type Section = {
  id: string;
  courseId: string;
  title: string;
  titleArabic: string;
  order: number;
  lessons: Lesson[];
};

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  titleArabic: string;
  shortDescription: string;
  shortDescriptionArabic: string;
  thumbnail: string;
  level: CourseLevel;
  language: CourseLanguage;
  status: CourseStatus;
  oneTimePrice: number;
  accessTier: AccessTier;
  isFeatured: boolean;
  totalDurationMin: number;
  totalLessons: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    slug: string;
    name: string;
    nameArabic: string;
  } | null;
  instructor: {
    id: string;
    headline: string;
    headlineArabic: string;
    isFeatured: boolean;
    user: { id: string; fullName: string; profile: string };
  };
  _count?: { sections: number; reviews?: number };
  averageRating?: number;
  reviewCount?: number;
};

export type CourseDetail = CourseSummary & {
  description: string;
  descriptionArabic: string;
  promoVideoVdoId: string;
  sections: Section[];
  viewerHasAccess?: boolean;
};

type Envelope<T> = { statusCode: number; success: boolean; message?: string; data: T };
// sendResponse hoists `meta` from data to top-level of the envelope.
type Paginated<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: { data: T };
  meta: { page: number; limit: number; total: number; totalPage: number };
};

export type ListCoursesArgs = {
  page?: number;
  limit?: number;
  categoryId?: string;
  categorySlug?: string;
  instructorId?: string;
  status?: CourseStatus;
  featured?: boolean;
  search?: string;
};

/**
 * What the player needs for a lesson: a VdoCipher OTP (DRM) or, for lessons
 * whose video ID is `mp4:<url>` (demo courses), a plain MP4 URL.
 */
export type PlaybackSource =
  | { provider: "vdocipher"; otp: string; playbackInfo: string }
  | { provider: "mp4"; url: string };

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCourses: builder.query<Paginated<CourseSummary[]>, ListCoursesArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === "object") {
          for (const [k, v] of Object.entries(args)) {
            if (v !== undefined && v !== "") params.set(k, String(v));
          }
        }
        return { url: `/courses${params.toString() ? `?${params}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map((c) => ({ type: "Course" as const, id: c.id })),
              { type: "Courses" as const, id: "LIST" },
            ]
          : [{ type: "Courses" as const, id: "LIST" }],
    }),

    getCourse: builder.query<Envelope<CourseDetail>, string>({
      query: (idOrSlug) => ({ url: `/courses/${idOrSlug}` }),
      providesTags: (_r, _e, idOrSlug) => [{ type: "Course", id: idOrSlug }],
    }),

    createCourse: builder.mutation<
      Envelope<CourseDetail>,
      {
        title: string;
        titleArabic?: string;
        shortDescription?: string;
        instructorId: string;
        categoryId?: string | null;
        level?: CourseLevel;
        language?: CourseLanguage;
        accessTier?: AccessTier;
        oneTimePrice?: number;
      }
    >({
      query: (body) => ({ url: "/courses", method: "POST", body }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),

    updateCourse: builder.mutation<
      Envelope<CourseDetail>,
      {
        id: string;
        patch: Partial<
          Omit<
            CourseDetail,
            | "id"
            | "slug"
            | "category"
            | "instructor"
            | "sections"
            | "_count"
            | "createdAt"
            | "updatedAt"
            | "publishedAt"
          >
        > & {
          categoryId?: string | null;
          instructorId?: string;
        };
      }
    >({
      query: ({ id, patch }) => ({ url: `/courses/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Course", id: arg.id },
        { type: "Courses", id: "LIST" },
      ],
    }),

    deleteCourse: builder.mutation<{ statusCode: number; success: boolean }, string>({
      query: (id) => ({ url: `/courses/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),

    publishCourse: builder.mutation<Envelope<CourseDetail>, string>({
      query: (id) => ({ url: `/courses/${id}/publish`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Course", id },
        { type: "Courses", id: "LIST" },
      ],
    }),

    unpublishCourse: builder.mutation<Envelope<CourseDetail>, string>({
      query: (id) => ({ url: `/courses/${id}/unpublish`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Course", id },
        { type: "Courses", id: "LIST" },
      ],
    }),

    // Sections
    createSection: builder.mutation<
      Envelope<Section>,
      { courseId: string; title: string; titleArabic?: string }
    >({
      query: ({ courseId, ...body }) => ({
        url: `/courses/${courseId}/sections`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Course", id: arg.courseId }],
    }),

    updateSection: builder.mutation<
      Envelope<Section>,
      { id: string; courseId: string; patch: Partial<Section> }
    >({
      query: ({ id, patch }) => ({
        url: `/courses/sections/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Course", id: arg.courseId }],
    }),

    deleteSection: builder.mutation<
      { statusCode: number; success: boolean },
      { id: string; courseId: string }
    >({
      query: ({ id }) => ({ url: `/courses/sections/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Course", id: arg.courseId }],
    }),

    // Lessons
    createLesson: builder.mutation<
      Envelope<Lesson>,
      {
        sectionId: string;
        courseId: string;
        title: string;
        titleArabic?: string;
        durationMin?: number;
        isFreePreview?: boolean;
        vdoVideoId?: string;
      }
    >({
      query: ({ sectionId, courseId: _c, ...body }) => ({
        url: `/courses/sections/${sectionId}/lessons`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Course", id: arg.courseId }],
    }),

    updateLesson: builder.mutation<
      Envelope<Lesson>,
      { id: string; courseId: string; patch: Partial<Lesson> }
    >({
      query: ({ id, patch }) => ({
        url: `/courses/lessons/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Course", id: arg.courseId }],
    }),

    deleteLesson: builder.mutation<
      { statusCode: number; success: boolean },
      { id: string; courseId: string }
    >({
      query: ({ id }) => ({ url: `/courses/lessons/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Course", id: arg.courseId }],
    }),

    getPreviewOtp: builder.mutation<
      { statusCode: number; success: boolean; data: PlaybackSource },
      { lessonId: string }
    >({
      query: ({ lessonId }) => ({
        url: `/courses/lessons/${lessonId}/preview-otp`,
        method: "POST",
      }),
    }),

    getPlaybackOtp: builder.mutation<
      { statusCode: number; success: boolean; data: PlaybackSource },
      { lessonId: string }
    >({
      query: ({ lessonId }) => ({
        url: `/courses/lessons/${lessonId}/playback-otp`,
        method: "POST",
      }),
    }),

    upsertLessonProgress: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        data: {
          id: string;
          userId: string;
          lessonId: string;
          lastWatchedSeconds: number;
          completedAt: string | null;
        };
      },
      { lessonId: string; courseId: string; completed?: boolean; lastWatchedSeconds?: number }
    >({
      query: ({ lessonId, courseId: _c, ...body }) => ({
        url: `/courses/lessons/${lessonId}/progress`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Course", id: `progress-${arg.courseId}` }],
    }),

    getCourseProgress: builder.query<
      {
        statusCode: number;
        success: boolean;
        data: Array<{
          id: string;
          lessonId: string;
          lastWatchedSeconds: number;
          completedAt: string | null;
        }>;
      },
      string
    >({
      query: (idOrSlug) => ({ url: `/courses/${idOrSlug}/progress` }),
      providesTags: (_r, _e, idOrSlug) => [{ type: "Course", id: `progress-${idOrSlug}` }],
    }),
  }),
});

export const {
  useListCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetPreviewOtpMutation,
  useGetPlaybackOtpMutation,
  useUpsertLessonProgressMutation,
  useGetCourseProgressQuery,
} = coursesApi;

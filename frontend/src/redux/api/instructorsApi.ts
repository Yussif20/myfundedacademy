import { baseApi } from "./baseApi";
import type { CourseSummary } from "./coursesApi";

export type InstructorProfile = {
  id: string;
  headline: string;
  headlineArabic: string;
  bio: string;
  bioArabic: string;
  expertise: string[];
  twitterUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    country: string;
    profile: string;
    preferredLocale: "en" | "ar";
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    status: "ACTIVE" | "SUSPENDED" | "DELETED";
    isEmailVerified: boolean;
    createdAt: string;
  };
};

type Envelope<T> = { statusCode: number; success: boolean; message?: string; data: T };

export type CreateInstructorInput = {
  email: string;
  fullName: string;
  password: string;
  country?: string;
  preferredLocale?: "en" | "ar";
  headline?: string;
  headlineArabic?: string;
  bio?: string;
  bioArabic?: string;
  expertise?: string[];
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  profile?: string;
  isFeatured?: boolean;
};

export type UpdateInstructorInput = Partial<{
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
}>;

export const instructorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listInstructors: builder.query<Envelope<InstructorProfile[]>, { featured?: boolean } | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === "object" && "featured" in args && args.featured !== undefined) {
          params.set("featured", String(args.featured));
        }
        return { url: `/instructors${params.toString() ? `?${params}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((i) => ({ type: "InstructorProfile" as const, id: i.id })),
              { type: "InstructorProfile" as const, id: "LIST" },
            ]
          : [{ type: "InstructorProfile" as const, id: "LIST" }],
    }),

    getInstructor: builder.query<Envelope<InstructorProfile>, string>({
      query: (id) => ({ url: `/instructors/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "InstructorProfile", id }],
    }),

    createInstructor: builder.mutation<Envelope<InstructorProfile>, CreateInstructorInput>({
      query: (body) => ({ url: "/instructors", method: "POST", body }),
      invalidatesTags: [{ type: "InstructorProfile", id: "LIST" }],
    }),

    updateInstructor: builder.mutation<
      Envelope<InstructorProfile>,
      { id: string; patch: UpdateInstructorInput }
    >({
      query: ({ id, patch }) => ({ url: `/instructors/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "InstructorProfile", id: arg.id },
        { type: "InstructorProfile", id: "LIST" },
      ],
    }),

    deleteInstructor: builder.mutation<{ statusCode: number; success: boolean }, string>({
      query: (id) => ({ url: `/instructors/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "InstructorProfile", id: "LIST" }],
    }),

    // Me-scoped (instructor self-service)
    getMyInstructorProfile: builder.query<Envelope<InstructorProfile>, void>({
      query: () => ({ url: "/instructors/me" }),
      providesTags: [{ type: "InstructorProfile", id: "ME" }],
    }),

    updateMyInstructorProfile: builder.mutation<Envelope<InstructorProfile>, UpdateInstructorInput>(
      {
        query: (body) => ({ url: "/instructors/me", method: "PATCH", body }),
        invalidatesTags: [
          { type: "InstructorProfile", id: "ME" },
          { type: "InstructorProfile", id: "LIST" },
        ],
      },
    ),

    listMyCourses: builder.query<Envelope<CourseSummary[]>, void>({
      query: () => ({ url: "/instructors/me/courses" }),
      providesTags: [{ type: "Course", id: "MINE" }],
    }),

    getMyInstructorStats: builder.query<
      Envelope<{
        courseCount: number;
        publishedCount: number;
        totalEnrollments: number;
        avgRating: number;
      }>,
      void
    >({
      query: () => ({ url: "/instructors/me/stats" }),
      providesTags: [{ type: "InstructorProfile", id: "STATS" }],
    }),

    listMyStudents: builder.query<Envelope<MyStudentRow[]>, void>({
      query: () => ({ url: "/instructors/me/students" }),
      providesTags: [{ type: "Enrollments", id: "MY_STUDENTS" }],
    }),
  }),
});

export type MyStudentRow = {
  enrollmentId: string;
  enrolledAt: string;
  expiresAt: string | null;
  source: "PURCHASE" | "SUBSCRIPTION" | "ADMIN" | "FREE";
  student: {
    id: string;
    email: string;
    fullName: string;
    country: string;
    profile: string;
  };
  course: {
    id: string;
    slug: string;
    title: string;
    titleArabic: string;
    totalLessons: number;
  };
  completedLessons: number;
  progressPct: number;
};

export const {
  useListInstructorsQuery,
  useGetInstructorQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useGetMyInstructorProfileQuery,
  useUpdateMyInstructorProfileMutation,
  useListMyCoursesQuery,
  useGetMyInstructorStatsQuery,
  useListMyStudentsQuery,
} = instructorsApi;

import { baseApi } from "./baseApi";

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
  }),
});

export const {
  useListInstructorsQuery,
  useGetInstructorQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} = instructorsApi;

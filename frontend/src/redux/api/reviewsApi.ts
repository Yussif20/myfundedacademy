import { baseApi } from "./baseApi";

type Envelope<T> = { statusCode: number; success: boolean; message?: string; data: T };

export type Review = {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  title: string;
  titleArabic: string;
  body: string;
  bodyArabic: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; fullName: string; profile: string; country: string };
};

export type ReviewListResponse = {
  statusCode: number;
  success: boolean;
  data: { data: Review[] };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    averageRating: number;
    distribution: Record<string, number>;
  };
};

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCourseReviews: builder.query<
      ReviewListResponse,
      { slug: string; page?: number; limit?: number }
    >({
      query: ({ slug, page = 1, limit = 10 }) => ({
        url: `/reviews/courses/${slug}?page=${page}&limit=${limit}`,
      }),
      providesTags: (_r, _e, arg) => [{ type: "Reviews", id: arg.slug }],
    }),

    getMyReview: builder.query<Envelope<Review | null>, string>({
      query: (slug) => ({ url: `/reviews/courses/${slug}/me` }),
      providesTags: (_r, _e, slug) => [{ type: "Review", id: slug }],
    }),

    upsertCourseReview: builder.mutation<
      Envelope<Review>,
      {
        slug: string;
        rating: number;
        title?: string;
        titleArabic?: string;
        body?: string;
        bodyArabic?: string;
      }
    >({
      query: ({ slug, ...body }) => ({
        url: `/reviews/courses/${slug}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Review", id: arg.slug },
        { type: "Reviews", id: arg.slug },
        { type: "Course", id: arg.slug },
      ],
    }),

    deleteReview: builder.mutation<
      { statusCode: number; success: boolean },
      { id: string; slug: string }
    >({
      query: ({ id }) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Review", id: arg.slug },
        { type: "Reviews", id: arg.slug },
      ],
    }),
  }),
});

export const {
  useListCourseReviewsQuery,
  useGetMyReviewQuery,
  useUpsertCourseReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;

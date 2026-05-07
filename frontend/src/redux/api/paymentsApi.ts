import { baseApi } from "./baseApi";

type Envelope<T> = { statusCode: number; success: boolean; message?: string; data: T };

export type SubscriptionPlan = "STARTER_MONTHLY" | "PRO_MONTHLY" | "PRO_ANNUAL";
export type SubscriptionStatus =
  | "INCOMPLETE"
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "UNPAID"
  | "INCOMPLETE_EXPIRED";

export type Subscription = {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
} | null;

export type Order = {
  id: string;
  type: "ONE_TIME" | "SUBSCRIPTION";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  amount: number;
  currency: string;
  paidAt: string | null;
  createdAt: string;
  course: {
    id: string;
    slug: string;
    title: string;
    titleArabic: string;
    thumbnail: string;
  } | null;
};

export type Enrollment = {
  id: string;
  source: "PURCHASE" | "SUBSCRIPTION" | "ADMIN" | "FREE";
  enrolledAt: string;
  expiresAt: string | null;
  course: {
    id: string;
    slug: string;
    title: string;
    titleArabic: string;
    shortDescription: string;
    shortDescriptionArabic: string;
    thumbnail: string;
    totalLessons: number;
    totalDurationMin: number;
    level: string;
    instructor: { user: { fullName: string } };
  };
};

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ----- One-time -----
    checkoutCourse: builder.mutation<
      Envelope<{ url: string; sessionId: string }>,
      { courseId: string }
    >({
      query: (body) => ({ url: "/orders/checkout-course", method: "POST", body }),
    }),

    listMyOrders: builder.query<Envelope<Order[]>, void>({
      query: () => ({ url: "/orders/me" }),
      providesTags: [{ type: "Order", id: "MINE" }],
    }),

    getMyOrderBySession: builder.query<Envelope<Order>, string>({
      query: (sessionId) => ({ url: `/orders/me/by-session/${sessionId}` }),
    }),

    // ----- Subscriptions -----
    checkoutSubscription: builder.mutation<
      Envelope<{ url: string; sessionId: string }>,
      { plan: SubscriptionPlan }
    >({
      query: (body) => ({ url: "/subscriptions/checkout", method: "POST", body }),
    }),

    getMySubscription: builder.query<Envelope<Subscription>, void>({
      query: () => ({ url: "/subscriptions/me" }),
      providesTags: [{ type: "Subscription", id: "MINE" }],
    }),

    cancelSubscription: builder.mutation<Envelope<Subscription>, void>({
      query: () => ({ url: "/subscriptions/cancel", method: "POST" }),
      invalidatesTags: [{ type: "Subscription", id: "MINE" }],
    }),

    billingPortal: builder.mutation<Envelope<{ url: string }>, void>({
      query: () => ({ url: "/subscriptions/portal", method: "POST" }),
    }),

    // ----- Enrollments -----
    listMyEnrollments: builder.query<Envelope<Enrollment[]>, void>({
      query: () => ({ url: "/enrollments/me" }),
      providesTags: [{ type: "Enrollment", id: "MINE" }],
    }),
  }),
});

export const {
  useCheckoutCourseMutation,
  useListMyOrdersQuery,
  useGetMyOrderBySessionQuery,
  useCheckoutSubscriptionMutation,
  useGetMySubscriptionQuery,
  useCancelSubscriptionMutation,
  useBillingPortalMutation,
  useListMyEnrollmentsQuery,
} = paymentsApi;

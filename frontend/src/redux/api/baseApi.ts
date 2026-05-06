import { BaseQueryFn, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AppConfig } from "@/config";
import { ServerError_T } from "@/types";
import { logout, setUser } from "../authSlice";

const baseUrl = `${AppConfig.backendUrl}/api/v1`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("x-client-type", "WEB");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const error = result.error?.data as ServerError_T | undefined;

  if (error?.statusCode === 401) {
    const refreshResult = (await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions,
    )) as {
      data?: { data: { accessToken: string; user: NonNullable<unknown> } };
    };

    if (refreshResult?.data?.data?.user) {
      api.dispatch(
        setUser({
          user: refreshResult.data.data.user as never,
          token: refreshResult.data.data.accessToken,
        }),
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  tagTypes: [
    "User",
    "Course",
    "Courses",
    "Section",
    "Lesson",
    "Quiz",
    "QuizAttempt",
    "Enrollment",
    "Subscription",
    "Order",
    "Payment",
    "Review",
    "Discussion",
    "Comment",
    "Certificate",
    "Category",
    "InstructorProfile",
    "InstructorApplication",
    "Coupon",
    "Wishlist",
  ],
  endpoints: () => ({}),
});

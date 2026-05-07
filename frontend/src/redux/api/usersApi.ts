import { baseApi } from "./baseApi";
import { AuthUser } from "../authSlice";

type Profile = NonNullable<AuthUser> & {
  bio: string;
  country: string;
  profile: string;
  preferredLocale: "en" | "ar";
  isEmailVerified: boolean;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
};

type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ApiEnvelope<Profile>, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: ["User"],
    }),

    updateMe: builder.mutation<
      ApiEnvelope<Profile>,
      Partial<Pick<Profile, "fullName" | "bio" | "country" | "profile" | "preferredLocale">>
    >({
      query: (body) => ({ url: "/users/me", method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation<
      { statusCode: number; success: boolean; message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({ url: "/users/me/change-password", method: "POST", body }),
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation } = usersApi;

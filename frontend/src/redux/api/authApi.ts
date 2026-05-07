import { baseApi } from "./baseApi";
import { AuthUser } from "../authSlice";

type AuthResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: { user: AuthUser; accessToken: string } | null;
};

type SimpleResponse = { statusCode: number; success: boolean; message: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<
      SimpleResponse,
      {
        fullName: string;
        email: string;
        password: string;
        country?: string;
        preferredLocale?: "en" | "ar";
      }
    >({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),

    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<SimpleResponse, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.mutation<SimpleResponse, { token: string }>({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),

    resendVerification: builder.mutation<SimpleResponse, { email: string }>({
      query: (body) => ({ url: "/auth/resend-verification", method: "POST", body }),
    }),

    forgotPassword: builder.mutation<SimpleResponse, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: builder.mutation<SimpleResponse, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

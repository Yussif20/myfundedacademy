import { baseApi } from "./baseApi";
import { AuthUser } from "../authSlice";

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export type Profile = NonNullable<AuthUser> & {
  bio: string;
  country: string;
  profile: string;
  preferredLocale: "en" | "ar";
  isEmailVerified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

export type ListUsersQuery = {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
};

export type ListUsersResponse = ApiEnvelope<{
  data: Profile[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}>;

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  country?: string;
  bio?: string;
  preferredLocale?: "en" | "ar";
};

export type UpdateUserInput = Partial<{
  fullName: string;
  role: UserRole;
  status: UserStatus;
  bio: string;
  country: string;
}>;

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

    // Admin
    listUsers: builder.query<ListUsersResponse, ListUsersQuery | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === "object") {
          if (args.page) params.set("page", String(args.page));
          if (args.limit) params.set("limit", String(args.limit));
          if (args.role) params.set("role", args.role);
          if (args.search) params.set("search", args.search);
        }
        const qs = params.toString();
        return { url: `/users${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map((u) => ({ type: "User" as const, id: u.id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    createUser: builder.mutation<ApiEnvelope<Profile>, CreateUserInput>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<ApiEnvelope<Profile>, { id: string; patch: UpdateUserInput }>({
      query: ({ id, patch }) => ({ url: `/users/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "User", id: arg.id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<{ statusCode: number; success: boolean }, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

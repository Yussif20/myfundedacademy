import { baseApi } from "./baseApi";

export type Category = {
  id: string;
  slug: string;
  name: string;
  nameArabic: string;
  description: string;
  descriptionArabic: string;
  icon: string;
  order: number;
  isFeatured: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type Envelope<T> = { statusCode: number; success: boolean; message?: string; data: T };

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<Envelope<Category[]>, { featured?: boolean } | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === "object" && "featured" in args && args.featured !== undefined) {
          params.set("featured", String(args.featured));
        }
        return { url: `/categories${params.toString() ? `?${params}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((c) => ({ type: "Category" as const, id: c.id })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    createCategory: builder.mutation<
      Envelope<Category>,
      Partial<Omit<Category, "id" | "slug" | "createdAt" | "updatedAt" | "isDeleted">> & {
        name: string;
      }
    >({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    updateCategory: builder.mutation<Envelope<Category>, { id: string; patch: Partial<Category> }>({
      query: ({ id, patch }) => ({ url: `/categories/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Category", id: arg.id },
        { type: "Category", id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<{ statusCode: number; success: boolean }, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;

import { baseApi } from "./baseApi";

type Envelope<T> = { statusCode: number; success: boolean; message?: string; data: T };

export type PresignResult = {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  method: "PUT";
  headers: Record<string, string>;
};

export type VideoCredentials = {
  videoId: string;
  uploadLink: string;
  clientPayload: {
    policy: string;
    key: string;
    "x-amz-signature": string;
    "x-amz-algorithm": string;
    "x-amz-date": string;
    "x-amz-credential": string;
    uploadLink: string;
  };
};

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    avatarPresign: builder.mutation<
      Envelope<PresignResult>,
      { fileName: string; contentType: string; contentLength: number }
    >({
      query: (body) => ({ url: "/uploads/avatar-presign", method: "POST", body }),
    }),

    thumbnailPresign: builder.mutation<
      Envelope<PresignResult>,
      { fileName: string; contentType: string; contentLength: number }
    >({
      query: (body) => ({ url: "/uploads/thumbnail-presign", method: "POST", body }),
    }),

    attachmentPresign: builder.mutation<
      Envelope<PresignResult>,
      { fileName: string; contentType: string; contentLength: number }
    >({
      query: (body) => ({ url: "/uploads/attachment-presign", method: "POST", body }),
    }),

    videoCredentials: builder.mutation<Envelope<VideoCredentials>, { title: string }>({
      query: (body) => ({ url: "/uploads/video-credentials", method: "POST", body }),
    }),
  }),
});

export const {
  useAvatarPresignMutation,
  useThumbnailPresignMutation,
  useAttachmentPresignMutation,
  useVideoCredentialsMutation,
} = uploadsApi;

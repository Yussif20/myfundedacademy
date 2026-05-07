import {
  buildObjectKey,
  isStorageConfigured,
  presignUpload,
  publicUrlForKey,
} from "@/lib/storage/r2";
import { getUploadCredentials, isVdoCipherConfigured } from "@/lib/video/vdocipher";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";

export const UploadsService = {
  async thumbnailPresign(input: { fileName: string; contentType: string; contentLength: number }) {
    if (!isStorageConfigured()) {
      throw new AppError(httpStatus.SERVICE_UNAVAILABLE, "Object storage is not configured.");
    }
    const key = buildObjectKey("thumbnails", input.fileName);
    const uploadUrl = await presignUpload({
      key,
      contentType: input.contentType,
      contentLength: input.contentLength,
      expiresInSeconds: 600,
    });
    return {
      uploadUrl,
      key,
      publicUrl: publicUrlForKey(key),
      method: "PUT" as const,
      headers: { "Content-Type": input.contentType },
    };
  },

  async attachmentPresign(input: { fileName: string; contentType: string; contentLength: number }) {
    if (!isStorageConfigured()) {
      throw new AppError(httpStatus.SERVICE_UNAVAILABLE, "Object storage is not configured.");
    }
    const key = buildObjectKey("attachments", input.fileName);
    const uploadUrl = await presignUpload({
      key,
      contentType: input.contentType,
      contentLength: input.contentLength,
      expiresInSeconds: 600,
    });
    return {
      uploadUrl,
      key,
      publicUrl: publicUrlForKey(key),
      method: "PUT" as const,
      headers: { "Content-Type": input.contentType },
    };
  },

  async videoCredentials(input: { title: string }) {
    if (!isVdoCipherConfigured()) {
      throw new AppError(httpStatus.SERVICE_UNAVAILABLE, "VdoCipher is not configured.");
    }
    return getUploadCredentials(input.title);
  },
};

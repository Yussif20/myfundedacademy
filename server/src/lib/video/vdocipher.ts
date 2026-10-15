import { env } from "@/env";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";

const BASE_URL = "https://dev.vdocipher.com/api";

export const isVdoCipherConfigured = (): boolean => Boolean(env.VDOCIPHER_API_SECRET);

const requireKey = (): string => {
  if (!env.VDOCIPHER_API_SECRET) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "VdoCipher is not configured. Set VDOCIPHER_API_SECRET.",
    );
  }
  return env.VDOCIPHER_API_SECRET;
};

const authHeader = () => `Apisecret ${requireKey()}`;

export type VdoUploadCredentials = {
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

/**
 * Asks VdoCipher for an upload OTP. Server returns these credentials to
 * the browser, which then POSTs the file directly to VdoCipher. Video
 * bytes never touch our server.
 */
export const getUploadCredentials = async (title: string): Promise<VdoUploadCredentials> => {
  const url = `${BASE_URL}/videos?title=${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `VdoCipher upload-init failed (${res.status}): ${text.slice(0, 200)}`,
    );
  }

  const json = (await res.json()) as {
    videoId: string;
    clientPayload: VdoUploadCredentials["clientPayload"];
  };

  return {
    videoId: json.videoId,
    uploadLink: json.clientPayload.uploadLink,
    clientPayload: json.clientPayload,
  };
};

/**
 * Generates a playback OTP that the player exchanges for a key. Watermark
 * annotation is passed per-OTP so the viewer's email is burned into every
 * playback. Used in Batch 5; included now so the helper is complete.
 */
export type PlaybackOtpInput = {
  videoId: string;
  ttlSeconds?: number;
  /** VdoCipher dynamic watermark spec. `interval` (ms) is required when type is rtext. */
  annotation?: {
    type: "rtext";
    text: string;
    alpha?: string;
    color?: string;
    size?: string;
    interval?: string;
  }[];
};

export const getPlaybackOtp = async (input: PlaybackOtpInput) => {
  const url = `${BASE_URL}/videos/${input.videoId}/otp`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ttl: input.ttlSeconds ?? 300,
      ...(input.annotation ? { annotate: JSON.stringify(input.annotation) } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `VdoCipher OTP failed (${res.status}): ${text.slice(0, 200)}`,
    );
  }

  return (await res.json()) as { otp: string; playbackInfo: string };
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  // "mp4:" IDs are plain public files (see ./provider.ts), nothing to delete.
  if (!videoId || videoId.startsWith("mp4:")) return;
  const url = `${BASE_URL}/videos?videos=${encodeURIComponent(videoId)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `VdoCipher delete failed (${res.status}): ${text.slice(0, 200)}`,
    );
  }
};

import AppError from "@/helpers/errors/AppError";
import { ALLOWED_MP4_HOSTS, LOCAL_MP4_PATH } from "@/app/demo/demo.constants";
import httpStatus from "http-status";
import { getPlaybackOtp, PlaybackOtpInput } from "./vdocipher";

/**
 * Lesson video IDs select the playback provider:
 *   - `mp4:/demo/videos/<name>.mp4` → a clip bundled with the frontend, or
 *     `mp4:<https url>` on an allow-listed host → plain MP4 (free). The
 *     frontend overlays the viewer watermark on top of a <video> element.
 *   - anything else     → a VdoCipher video ID (DRM, server-burned watermark).
 */
const MP4_PREFIX = "mp4:";

export type PlaybackSource =
  | { provider: "vdocipher"; otp: string; playbackInfo: string }
  | { provider: "mp4"; url: string };

export const isDirectVideoId = (videoId: string): boolean => videoId.startsWith(MP4_PREFIX);

/** Returns the MP4 URL (or same-origin path) when the ID is an allowed direct video, else null. */
export const parseDirectVideoUrl = (videoId: string): string | null => {
  if (!isDirectVideoId(videoId)) return null;
  const target = videoId.slice(MP4_PREFIX.length);
  if (LOCAL_MP4_PATH.test(target)) return target;
  try {
    const url = new URL(videoId.slice(MP4_PREFIX.length));
    if (url.protocol !== "https:" || !ALLOWED_MP4_HOSTS.includes(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
};

export const getPlaybackSource = async (
  input: Omit<PlaybackOtpInput, "videoId"> & { videoId: string },
): Promise<PlaybackSource> => {
  if (isDirectVideoId(input.videoId)) {
    const url = parseDirectVideoUrl(input.videoId);
    if (!url) throw new AppError(httpStatus.NOT_FOUND, "This video is not available.");
    return { provider: "mp4", url };
  }
  const { otp, playbackInfo } = await getPlaybackOtp(input);
  return { provider: "vdocipher", otp, playbackInfo };
};

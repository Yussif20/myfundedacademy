"use client";

import { Loader2, Maximize, Minimize, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** VdoCipher OTP returned by the server */
  otp?: string;
  /** Base64 playback info returned by the server */
  playbackInfo?: string;
  /**
   * Plain MP4 URL (the free "mp4:" provider used by demo courses). When set,
   * a native <video> element is rendered instead of the VdoCipher iframe; the
   * same watermark overlay sits on top.
   */
  videoUrl?: string;
  /** Loading state controlled by parent (e.g. while requesting OTP) */
  isLoading?: boolean;
  /** Optional: thumbnail to show before the player loads */
  poster?: string;
  /** Title for accessibility */
  title?: string;
  /** Optional click handler — called when poster is clicked, e.g. to fetch OTP lazily */
  onActivate?: () => void;
  /**
   * Client-side watermark text overlaid on the player. Used as a visible
   * deterrent against casual recording. VdoCipher's paid-tier dynamic
   * watermark is more secure (burned into the video stream); this overlay
   * is a "good enough" fallback that works on every plan.
   */
  watermarkText?: string;
  /** MP4 only: resume from this position (seconds) when the video loads. */
  startAt?: number;
  /** MP4 only: called about every 15s of playback, and on pause, with the position. */
  onProgress?: (seconds: number) => void;
};

const PROGRESS_EVERY_SECONDS = 15;

const WATERMARK_POSITIONS: Array<{ top?: string; bottom?: string; left?: string; right?: string }> =
  [
    { top: "8%", left: "6%" },
    { top: "8%", right: "6%" },
    { bottom: "12%", left: "6%" },
    { bottom: "12%", right: "6%" },
    { top: "45%", left: "8%" },
    { top: "45%", right: "8%" },
  ];

export function VdoCipherPlayer({
  otp,
  playbackInfo,
  videoUrl,
  isLoading,
  poster,
  title,
  onActivate,
  watermarkText,
  startAt,
  onProgress,
}: Props) {
  const [activated, setActivated] = useState(false);
  const [posIndex, setPosIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastReportedRef = useRef(0);
  const ready = Boolean(videoUrl || (otp && playbackInfo));

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Full screen goes on the wrapper (not the <video>) so the watermark
  // overlay stays visible.
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen();
  };

  const report = (seconds: number) => {
    lastReportedRef.current = seconds;
    onProgress?.(Math.floor(seconds));
  };

  // Rotate the overlay watermark to a new corner every 5 seconds.
  useEffect(() => {
    if (!watermarkText || !ready) return;
    const id = setInterval(() => {
      setPosIndex((n) => (n + 1) % WATERMARK_POSITIONS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [watermarkText, ready]);

  const handleActivate = () => {
    setActivated(true);
    onActivate?.();
  };

  if (!activated && !ready && !isLoading) {
    return (
      <button
        type="button"
        onClick={handleActivate}
        aria-label={title ? `Play ${title}` : "Play preview"}
        className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary"
        style={
          poster
            ? {
                backgroundImage: `url("${poster}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 grid place-items-center bg-foreground/5 transition-colors group-hover:bg-transparent">
          <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_30px_-10px_rgb(28_27_24/0.5)] ring-4 ring-card/70 transition-transform group-hover:scale-105">
            <Play className="size-6 translate-x-0.5 fill-current" aria-hidden />
          </span>
        </div>
      </button>
    );
  }

  // A ready source wins over a background re-fetch, so playback is never
  // torn down mid-play.
  if (!ready) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-xl border border-border bg-secondary">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  const pos = WATERMARK_POSITIONS[posIndex];

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
    >
      {videoUrl ? (
        <>
          <video
            key={videoUrl}
            src={videoUrl}
            poster={poster}
            title={title}
            controls
            autoPlay={activated}
            playsInline
            preload="metadata"
            controlsList="nodownload nofullscreen"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              lastReportedRef.current = startAt ?? 0;
              // Resume unless the saved spot is at the very end.
              if (startAt && startAt < v.duration - 5) v.currentTime = startAt;
            }}
            onTimeUpdate={(e) => {
              const t = e.currentTarget.currentTime;
              if (t - lastReportedRef.current >= PROGRESS_EVERY_SECONDS) report(t);
            }}
            onPause={(e) => {
              const t = e.currentTarget.currentTime;
              if (t > lastReportedRef.current) report(t);
            }}
            className="h-full w-full"
          />
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
            className="absolute top-3 z-20 rounded-md bg-black/50 p-1.5 text-white/90 backdrop-blur-sm transition hover:bg-black/70 end-3"
          >
            {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </button>
        </>
      ) : (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(otp!)}&playbackInfo=${encodeURIComponent(playbackInfo!)}`}
          title={title || "VdoCipher player"}
          allow="encrypted-media"
          allowFullScreen
          className="h-full w-full"
        />
      )}

      {watermarkText && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 select-none rounded-md bg-black/30 px-2 py-1 text-xs font-medium text-white/70 backdrop-blur-[2px] transition-all duration-700"
          style={{
            ...pos,
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          {watermarkText}
        </div>
      )}
    </div>
  );
}

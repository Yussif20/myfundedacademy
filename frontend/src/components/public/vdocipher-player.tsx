"use client";

import { Loader2, PlayCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  /** VdoCipher OTP returned by the server */
  otp?: string;
  /** Base64 playback info returned by the server */
  playbackInfo?: string;
  /** Loading state controlled by parent (e.g. while requesting OTP) */
  isLoading?: boolean;
  /** Optional: thumbnail to show before the player loads */
  poster?: string;
  /** Title for accessibility */
  title?: string;
  /** Optional click handler — called when poster is clicked, e.g. to fetch OTP lazily */
  onActivate?: () => void;
};

export function VdoCipherPlayer({
  otp,
  playbackInfo,
  isLoading,
  poster,
  title,
  onActivate,
}: Props) {
  const [activated, setActivated] = useState(false);
  const ready = Boolean(otp && playbackInfo);

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
        className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--secondary)]"
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
        <div className="absolute inset-0 grid place-items-center bg-black/40 transition-colors group-hover:bg-black/30">
          <PlayCircle className="size-16 text-white drop-shadow-lg transition-transform group-hover:scale-110" />
        </div>
      </button>
    );
  }

  if (isLoading || !ready) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-xl border border-[var(--border)] bg-[var(--secondary)]">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const src = `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(otp!)}&playbackInfo=${encodeURIComponent(playbackInfo!)}`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-[var(--border)] bg-black">
      <iframe
        src={src}
        title={title || "VdoCipher player"}
        allow="encrypted-media"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

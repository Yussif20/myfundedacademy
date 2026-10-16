import { cn } from "@/lib/utils";
import Image from "next/image";

/** Round portrait with a hairline ring; falls back to the serif initial. */
export function PersonAvatar({
  name,
  src,
  size,
  className,
}: {
  name: string;
  src?: string | null;
  /** Rendered size in px (for the image `sizes` hint). */
  size: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-paper-2 font-display text-primary",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" unoptimized />
      ) : (
        name.charAt(0)
      )}
    </span>
  );
}

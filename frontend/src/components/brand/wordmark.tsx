import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Approximate pixel height of the lockup (kept from the old image logo). */
  height?: number;
};

/** The lamp: a gold flame over a teal bowl. Colours follow the theme. */
export function LampMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="8 4 48 58"
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path
        d="M32 6c5.5 7.4 11 13.6 11 21.2C43 33.7 38.1 38 32 38s-11-4.3-11-10.8C21 19.6 26.5 13.4 32 6z"
        fill="var(--gold)"
      />
      <path
        d="M32 19c2.6 3.6 5 6.6 5 10 0 3-2.2 5-5 5s-5-2-5-5c0-3.4 2.4-6.4 5-10z"
        fill="var(--card)"
        opacity="0.55"
      />
      <path d="M10 41h44c0 8.3-9.8 14-22 14S10 49.3 10 41z" fill="var(--primary)" />
      <rect x="22" y="57" width="20" height="3.5" rx="1.75" fill="var(--primary)" />
    </svg>
  );
}

/** Nibras · نبراس lockup set in the display faces: Newsreader + Noto Naskh Arabic. */
export function Wordmark({ className, height = 40 }: Props) {
  const text = Math.round(height * 0.5);
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-foreground", className)}
      aria-label="Nibras · نبراس"
      role="img"
    >
      <LampMark size={Math.round(height * 0.72)} />
      <span aria-hidden className="inline-flex items-baseline gap-2 leading-none" dir="ltr">
        <span className="font-display font-medium tracking-tight" style={{ fontSize: text }}>
          Nibras
        </span>
        <span className="text-gold" style={{ fontSize: Math.round(text * 0.6) }}>
          ·
        </span>
        <span
          className="font-medium"
          style={{ fontSize: Math.round(text * 0.92), fontFamily: "var(--font-naskh), serif" }}
          lang="ar"
        >
          نبراس
        </span>
      </span>
    </span>
  );
}

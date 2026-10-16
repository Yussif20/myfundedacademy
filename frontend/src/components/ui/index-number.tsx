import { cn } from "@/lib/utils";

/** "01", "02"… in the display serif, gold. Purely decorative. */
export function IndexNumber({ n, className }: { n: number; className?: string }) {
  return (
    <span aria-hidden className={cn("font-display text-gold tabular-nums", className)}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

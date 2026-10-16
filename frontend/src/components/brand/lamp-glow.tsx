import { cn } from "@/lib/utils";

/** The one soft glow on the site: a warm halo, like light from a lamp. Decorative. */
export function LampGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-0 h-[34rem]", className)}
      style={{
        background: "radial-gradient(ellipse 55% 60% at 50% 0%, var(--lamp), transparent 70%)",
      }}
    />
  );
}

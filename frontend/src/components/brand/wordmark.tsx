import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 font-display", className)}>
      <div
        className={cn(
          "grid place-items-center size-10 rounded-lg",
          "bg-[var(--primary)] text-[var(--primary-foreground)]",
          "font-bold text-lg tracking-tight",
        )}
        aria-hidden
      >
        MFA
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          My Funded Academy
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">Trade. Learn. Get certified.</span>
      </div>
    </div>
  );
}

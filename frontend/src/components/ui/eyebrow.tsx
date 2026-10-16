import { cn } from "@/lib/utils";

/** Small tracked gold label, led by a short gold rule. Arabic drops case and tracking (globals.css). */
export function Eyebrow({
  children,
  className,
  rule = true,
}: {
  children: React.ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <p className={cn("eyebrow inline-flex items-center gap-3", className)}>
      {rule && <span aria-hidden className="h-px w-8 bg-gold" />}
      {children}
    </p>
  );
}

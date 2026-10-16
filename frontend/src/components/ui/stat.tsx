import { cn } from "@/lib/utils";

/** A figure and its label, for use inside a <dl>. Label first in the DOM, figure shown on top. The figure is set in the display serif with tabular numerals. */
export function Stat({
  value,
  label,
  className,
}: {
  value: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col-reverse gap-1", className)}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-display text-3xl font-medium tracking-tight tabular-nums md:text-4xl">
        {value}
      </dd>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

type Props = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Trailing slot, e.g. a "View all" link. */
  action?: React.ReactNode;
  /** "editorial" for marketing pages, "bar" (compact, Marketio-style) for dashboards. */
  variant?: "editorial" | "bar";
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  variant = "editorial",
  align = "start",
  as: Heading = "h2",
  id,
  className,
}: Props) {
  if (variant === "bar") {
    return (
      <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
        <div>
          {eyebrow && (
            <p className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
              <span aria-hidden className="inline-block h-4 w-1.5 rounded-sm bg-primary" />
              {eyebrow}
            </p>
          )}
          <Heading id={id} className="font-display text-2xl font-medium tracking-tight">
            {title}
          </Heading>
        </div>
        {action}
      </div>
    );
  }

  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-6",
        centered ? "flex-col items-center text-center" : "justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <Heading
          id={id}
          className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-balance md:text-4xl"
        >
          {title}
        </Heading>
        {lead && (
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground text-pretty">{lead}</p>
        )}
      </div>
      {action}
    </div>
  );
}

"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** 0..5, can be fractional */
  value: number;
  size?: number;
  className?: string;
  /** When set, becomes interactive — clicking a star calls onChange with that value (1..5) */
  onChange?: (next: number) => void;
};

export function StarRating({ value, size = 16, className, onChange }: Props) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = Boolean(onChange);

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {stars.map((s) => {
        const filled = value >= s;
        const half = !filled && value >= s - 0.5;
        const display = filled || half;
        return (
          <button
            key={s}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(s)}
            className={cn(
              "transition-transform",
              interactive ? "cursor-pointer hover:scale-105" : "cursor-default",
            )}
            aria-label={`${s} ${s === 1 ? "star" : "stars"}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(display ? "fill-gold text-gold" : "fill-none text-rule-strong")}
            />
          </button>
        );
      })}
    </span>
  );
}

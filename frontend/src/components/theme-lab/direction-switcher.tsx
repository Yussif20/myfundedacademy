"use client";

import { DIRECTIONS, type DirectionKey } from "@/components/theme-lab/directions";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * PROTOTYPE — floating direction switcher for the theme lab.
 * Deliberately visible in production: the deployed demo exists so the business
 * owner can flip between candidate identities. Styled as a neutral black pill
 * so it never reads as part of the design being judged.
 */
export function DirectionSwitcher({ current }: { current: DirectionKey }) {
  const router = useRouter();

  const index = DIRECTIONS.findIndex((d) => d.key === current);
  const meta = DIRECTIONS[index] ?? DIRECTIONS[0];

  const go = useCallback(
    (key: DirectionKey) => {
      const url = key === "current" ? "?" : `?variant=${key}`;
      router.replace(url, { scroll: false });
    },
    [router],
  );

  const step = useCallback(
    (delta: number) => {
      const next = (index + delta + DIRECTIONS.length) % DIRECTIONS.length;
      go(DIRECTIONS[next].key);
    },
    [go, index],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <div
      dir="ltr"
      className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2"
      role="toolbar"
      aria-label="Design direction switcher"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/85 px-2 py-1.5 text-white shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => step(-1)}
          className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Previous direction"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex min-w-44 flex-col items-center px-2 sm:min-w-56">
          <span className="text-xs font-semibold leading-tight">{meta.name}</span>
          <div className="mt-1 flex items-center gap-1.5">
            {DIRECTIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => go(d.key)}
                title={`${d.name} — ${d.tagline}`}
                aria-label={d.name}
                aria-pressed={d.key === current}
                className={`relative size-4 overflow-hidden rounded-full border transition-transform ${
                  d.key === current ? "scale-125 border-white" : "border-white/30 hover:scale-110"
                }`}
                style={{ backgroundColor: d.dots[0] }}
              >
                <span
                  className="absolute inset-y-0 left-1/2 w-1/4"
                  style={{ backgroundColor: d.dots[1] }}
                />
                <span
                  className="absolute inset-y-0 right-0 w-1/4"
                  style={{ backgroundColor: d.dots[2] }}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Next direction"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

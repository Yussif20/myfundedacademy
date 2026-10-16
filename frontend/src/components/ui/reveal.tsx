"use client";

import { type ComponentPropsWithoutRef, type ElementType, useEffect, useRef } from "react";

type RevealProps<T extends ElementType = "div"> = {
  as?: T;
  /** Delay before this element fades in, in milliseconds (for staggered grids). */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Fades content up once it scrolls into view. Calm by design: 700ms, 1.5rem.
 *
 * - Content is only hidden when JS runs (`html.js`, set in the root layout),
 *   so the page is complete without JavaScript.
 * - Anything already on screen at mount shows straight away.
 * - prefers-reduced-motion shows everything with no transition (globals.css).
 */
export function Reveal<T extends ElementType = "div">({
  as,
  delay = 0,
  style,
  ...rest
}: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-revealed", "");
    if (!("IntersectionObserver" in window)) return show();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? { transitionDelay: `${Math.min(delay, 600)}ms`, ...style } : style}
      {...rest}
    />
  );
}

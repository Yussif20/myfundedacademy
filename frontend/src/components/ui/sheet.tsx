"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SheetSide = "start" | "end" | "bottom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: SheetSide;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Lightweight slide-in drawer powered by framer-motion. Used for the mobile
 * navigation drawers in the public header, admin/instructor workspaces, and
 * the learn page curriculum. Avoids pulling in a Radix Dialog dep — the API
 * surface is small enough to inline (focus, scroll lock, ESC, backdrop).
 *
 * `side="start"` slides from the inline-start (left in LTR, right in RTL).
 */
export function Sheet({ open, onOpenChange, side = "start", title, children, className }: Props) {
  const reduced = useReducedMotion();
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Defer portal until after hydration to avoid SSR mismatch with document.body.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Stash the previously-focused element so we can restore focus on close,
  // and move focus into the panel on open.
  useEffect(() => {
    if (open) {
      triggerRef.current = (document.activeElement as HTMLElement) ?? null;
      requestAnimationFrame(() => {
        // Focus the panel's first focusable element, falling back to the panel.
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = panel.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        (focusable ?? panel).focus();
      });
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [open]);

  // ESC to close + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onOpenChange]);

  // Animation params per side. We rely on CSS logical properties for
  // start/end positioning so RTL gets the slide direction for free.
  const panelClasses =
    side === "bottom"
      ? "fixed inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl"
      : side === "end"
        ? "fixed inset-y-0 end-0 w-[88vw] max-w-sm"
        : "fixed inset-y-0 start-0 w-[88vw] max-w-sm";

  // framer-motion's `x` translation is direction-agnostic, but the panel is
  // anchored via logical `inset-inline-{start|end}`. In RTL, "start" is the
  // right edge, so the off-screen value flips sign.
  const xOff = (() => {
    if (side === "bottom") return null;
    if (side === "start") return isRtl ? "100%" : "-100%";
    return isRtl ? "-100%" : "100%"; // end
  })();
  const initial = side === "bottom" ? { y: "100%" } : { x: xOff as string };
  const exit = initial;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            initial={initial}
            animate={{ x: 0, y: 0 }}
            exit={exit}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "z-50 flex flex-col border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/30",
              "focus-visible:outline-none",
              side === "bottom" ? "border-t" : side === "end" ? "border-s" : "border-e",
              panelClasses,
              className,
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
              <h2 id={titleId} className="font-display text-base font-semibold tracking-tight">
                {title}
              </h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label={tCommon("close")}
                className="grid size-8 place-items-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

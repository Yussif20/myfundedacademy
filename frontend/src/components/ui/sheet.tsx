"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
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
 * Lightweight slide-in drawer (CSS transitions). Used for the mobile
 * navigation drawers in the public header, admin/instructor workspaces, and
 * the learn page curriculum. Avoids pulling in a Radix Dialog dep — the API
 * surface is small enough to inline (focus, scroll lock, ESC, backdrop).
 *
 * `side="start"` slides from the inline-start (left in LTR, right in RTL).
 */
export function Sheet({ open, onOpenChange, side = "start", title, children, className }: Props) {
  const tCommon = useTranslations("common");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  // `rendered` keeps the panel in the DOM while it slides out; `shown` drives the transition.
  const [rendered, setRendered] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setRendered(false), 260);
    return () => clearTimeout(t);
  }, [open]);

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

  // Off-screen position per side; logical anchoring means RTL flips the sign.
  const hiddenClass =
    side === "bottom"
      ? "translate-y-full"
      : side === "start"
        ? "-translate-x-full rtl:translate-x-full"
        : "translate-x-full rtl:-translate-x-full";

  if (!mounted || !rendered) return null;

  return createPortal(
    <>
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/25 transition-opacity duration-200",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "z-50 flex flex-col border-border bg-card transition-transform duration-250 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
          shown ? "translate-x-0 translate-y-0" : hiddenClass,
          "focus-visible:outline-none",
          side === "bottom" ? "border-t" : side === "end" ? "border-s" : "border-e",
          panelClasses,
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 id={titleId} className="font-display text-lg font-medium tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={tCommon("close")}
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-paper-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>,
    document.body,
  );
}

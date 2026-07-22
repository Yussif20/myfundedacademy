"use client";

import { type ReactNode } from "react";
import { SnapIn } from "./snap";

/**
 * Shared section header for the Acid Ledger page: Archivo Black title,
 * mono sub-line like a ledger annotation, optional end-side action.
 */
export function AcidSectionHeader({
  title,
  sub,
  action,
  center = false,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  center?: boolean;
}) {
  if (center) {
    return (
      <SnapIn>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-balance text-3xl md:text-5xl">{title}</h2>
          {sub && (
            <p className="mt-4 font-mono text-sm leading-relaxed text-[var(--muted-foreground)]">
              {sub}
            </p>
          )}
        </div>
      </SnapIn>
    );
  }

  return (
    <SnapIn>
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
          {sub && (
            <p className="mt-3 font-mono text-sm leading-relaxed text-[var(--muted-foreground)]">
              {sub}
            </p>
          )}
        </div>
        {action}
      </div>
    </SnapIn>
  );
}

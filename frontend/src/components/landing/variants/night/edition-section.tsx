"use client";

import { type ReactNode } from "react";

/**
 * Broadsheet section chrome: a Scotch rule closed by a "№ NN" folio line.
 * Labels are deliberately language-neutral (numerals, MFA, dateline marks)
 * so the chrome works identically in EN and AR without new message keys.
 */
export function EditionSection({ index, children }: { index: string; children: ReactNode }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <div className="dxnight-rule text-[var(--foreground)]" aria-hidden />
        <div className="mt-2.5 flex items-baseline justify-between" aria-hidden>
          <span className="dxnight-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--accent)]">
            № {index}
          </span>
          <span className="dxnight-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
            MFA · 2026
          </span>
        </div>
      </div>
      {children}
    </section>
  );
}

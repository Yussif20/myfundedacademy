"use client";

import { type ReactNode } from "react";
import { PhosphorClose } from "./close";
import { PhosphorCourses } from "./courses";
import { PhosphorDesk } from "./desk";
import { PhosphorFills } from "./fills";
import { PhosphorFooter } from "./footer";
import { PhosphorHeader } from "./header";
import { PhosphorHero } from "./hero";
import { PhosphorProtocol } from "./protocol";
import { PhosphorSectors } from "./sectors";
import { PhosphorStats } from "./stats";
import { PhosphorTrusted } from "./trusted";

/**
 * Phosphor Terminal Noir — fully bespoke page.
 * Its own command-bar header, calibration-cut hero, and terminal-colophon
 * footer; every landing section rebuilt in the identity's instrumentation
 * language and framed by hairline index chrome, so the page reads as one
 * continuous terminal readout from boot to EOF.
 */
export default function PhosphorHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <PhosphorHeader />

      <PhosphorHero />

      <SectionFrame index="01">
        <PhosphorTrusted />
      </SectionFrame>

      <SectionFrame index="02">
        <PhosphorStats />
      </SectionFrame>

      <SectionFrame index="03">
        <PhosphorCourses />
      </SectionFrame>

      <SectionFrame index="04">
        <PhosphorProtocol />
      </SectionFrame>

      <SectionFrame index="05">
        <PhosphorSectors />
      </SectionFrame>

      <SectionFrame index="06">
        <PhosphorDesk />
      </SectionFrame>

      <SectionFrame index="07">
        <PhosphorFills />
      </SectionFrame>

      <SectionFrame index="08">
        <PhosphorClose />
      </SectionFrame>

      <PhosphorFooter />
    </div>
  );
}

/**
 * Hairline section chrome: `+ ── 01 ──────── +` — language-neutral numerals
 * and crosshair marks only, mirrored automatically in RTL by flex direction.
 */
function SectionFrame({ index, children }: { index: string; children: ReactNode }) {
  return (
    <section className="relative">
      <div aria-hidden className="mx-auto max-w-7xl px-6 pt-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] leading-none text-[var(--muted-foreground)]">
            +
          </span>
          <span className="dxphosphor-rule max-w-10" />
          <span className="font-mono text-[11px] leading-none tracking-[0.08em] text-[var(--muted-foreground)]">
            {index}
          </span>
          <span className="dxphosphor-rule" />
          <span className="font-mono text-[10px] leading-none text-[var(--muted-foreground)]">
            +
          </span>
        </div>
      </div>
      {children}
    </section>
  );
}

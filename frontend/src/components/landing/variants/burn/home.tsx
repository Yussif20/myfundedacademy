"use client";

import { BurnCategories } from "./categories-index";
import { CandleWicks } from "./candle-wicks";
import { BurnCourses } from "./courses";
import { BurnCta } from "./cta";
import { BurnInstructors } from "./desk-roster";
import { EmberHero } from "./ember-hero";
import { BurnFooter } from "./footer";
import { BurnHeader } from "./header";
import { BurnHowItWorks } from "./session-steps";
import { BurnStatsBoard } from "./stats-board";
import { BurnTestimonials } from "./testimonials";
import { BurnTrustedTape } from "./trusted-tape";

/**
 * Direction "burn" — CONTROLLED BURN, fully bespoke top to bottom.
 * Ticker-board masthead, the ember-horizon hero, the trusted tape, the
 * stats board, session steps, the course desk, sector index, desk roster,
 * filled-order testimonials, and the closing bell — every break marked by
 * candle wicks, every surface cracked by a heat seam.
 */
export default function BurnHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <BurnHeader />
      <main className="flex-1">
        <EmberHero />
        <BurnTrustedTape />
        <BurnStatsBoard />
        <BurnDivider />
        <BurnHowItWorks />
        <BurnCourses />
        <BurnDivider />
        <BurnCategories />
        <BurnInstructors />
        <BurnDivider />
        <BurnTestimonials />
        <BurnCta />
      </main>
      <BurnFooter />
    </div>
  );
}

/* Candle-wick section break — the brand's only illustration language. */
function BurnDivider() {
  return (
    <div aria-hidden className="dxburn-divider mx-auto max-w-7xl px-6">
      <CandleWicks />
    </div>
  );
}

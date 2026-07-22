"use client";

import { AcidCategories } from "./categories";
import { AcidCourses } from "./courses";
import { AcidFinalCta } from "./final-cta";
import { AcidFooter } from "./footer";
import { AcidHeader } from "./header";
import { AcidHero } from "./hero";
import { AcidHowItWorks } from "./how-it-works";
import { AcidInstructors } from "./instructors";
import { AcidStats } from "./stats";
import { AcidTestimonials } from "./testimonials";
import { AcidTicker } from "./ticker";
import { AcidTrusted } from "./trusted";
import { LedgerRule } from "./ledger-rule";

/**
 * "Acid Ledger" — a complete bespoke page, top to bottom: its own sticky
 * ledger-bar header, the self-printing trade-ticket hero, the market ticker
 * band, then every section rebuilt in the acid neo-brutalist language and
 * filed under numbered ledger rules, closed by the back-page footer.
 */
export default function AcidHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <AcidHeader />
      <main className="flex-1">
        <AcidHero />
        <AcidTicker />
        <AcidStats />

        <LedgerRule num="01" />
        <AcidTrusted />

        <LedgerRule num="02" />
        <AcidCourses />

        <LedgerRule num="03" />
        <AcidHowItWorks />

        <LedgerRule num="04" />
        <AcidCategories />

        <LedgerRule num="05" />
        <AcidInstructors />

        <LedgerRule num="06" />
        <AcidTestimonials />

        <LedgerRule num="07" />
        <AcidFinalCta />
      </main>
      <AcidFooter />
    </div>
  );
}

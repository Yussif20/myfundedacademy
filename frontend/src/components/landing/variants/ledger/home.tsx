"use client";

import { LedgerArticles } from "./articles";
import { LedgerCatalog } from "./catalog";
import { LedgerCourses } from "./courses";
import { LedgerFooter } from "./footer";
import { LedgerHeader } from "./header";
import { LedgerHero } from "./hero";
import { LedgerInvitation } from "./invitation";
import { LedgerLetters } from "./letters";
import { LedgerDivider } from "./ornaments";
import { LedgerPartners } from "./partners";
import { LedgerStats } from "./stats";
import { LedgerRoster } from "./trusted-by";

/**
 * "The Ledger Club" — the marketplace as a private capital club, top to
 * bottom: certificate masthead, the seal-pressed hero, an engraved
 * counterparties roster, the balance sheet, numbered articles and registers
 * separated by engraved hairlines, the letters of reference, the admission
 * invitation, and the colophon footer. Fully bespoke chrome; no shared
 * landing sections.
 */
export default function LedgerHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <LedgerHeader />
      <main className="flex-1">
        <LedgerHero />
        <LedgerRoster />
        <LedgerStats />
        <LedgerDivider />
        <LedgerArticles />
        <LedgerDivider />
        <LedgerCourses />
        <LedgerDivider />
        <LedgerCatalog />
        <LedgerDivider />
        <LedgerPartners />
        <LedgerDivider />
        <LedgerLetters />
        <LedgerInvitation />
      </main>
      <LedgerFooter />
    </div>
  );
}

"use client";

import { NightColumnists } from "./columnists";
import { NightCourses } from "./courses";
import { NightFooter } from "./footer";
import { NightHeader } from "./header";
import { NightHero } from "./night-hero";
import { NightLetters } from "./letters";
import { NightMarketSummary } from "./market-summary";
import { NightMethod } from "./method";
import { NightNotice } from "./notice";
import { NightSectionsIndex } from "./sections-index";
import { NightWire } from "./wire";

/**
 * "The Night Edition" — the marketplace as a finance broadsheet printed at
 * midnight, bespoke top to bottom: its own masthead header, a front page
 * that prints its own market plate, the catalog as numbered plates, ruled
 * ledgers and editorial columns for every section, and a colophon footer.
 * Sections carry folio numbers; the hero is № 01.
 */
export default function NightHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <NightHeader />
      <main className="flex-1">
        <NightHero />
        <NightWire index="02" />
        <NightMarketSummary index="03" />
        <NightCourses index="04" />
        <NightMethod index="05" />
        <NightSectionsIndex index="06" />
        <NightColumnists index="07" />
        <NightLetters index="08" />
        <NightNotice index="09" />
      </main>
      <NightFooter />
    </div>
  );
}

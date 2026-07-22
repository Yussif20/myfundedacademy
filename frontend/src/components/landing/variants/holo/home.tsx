"use client";

import { HoloCategories } from "./categories";
import { HoloCourses } from "./courses";
import { HoloCta } from "./cta";
import { HoloFooter } from "./footer";
import { HoloHeader } from "./header";
import { HoloHero } from "./hero";
import { HoloInstructors } from "./instructors";
import { HoloStats } from "./stats";
import { HoloSteps } from "./steps";
import { HoloTestimonials } from "./testimonials";
import { HoloTrusted } from "./trusted";

/* Fading prismatic rule between content bands — scarcity is the brand. */
function PrismDivider() {
  return (
    <div aria-hidden className="mx-auto max-w-7xl px-6">
      <div className="dxholo-divider" />
    </div>
  );
}

/** Holographic Obsidian — a fully bespoke page: cold black glass, prismatic
 *  edges, earned shine, from its own header to its own footer. */
export default function HoloHome() {
  return (
    <div className="dxholo-page">
      <HoloHeader />
      <main>
        <HoloHero />
        <HoloTrusted />
        <HoloStats />
        <HoloSteps />
        <PrismDivider />
        <HoloCourses />
        <HoloCategories />
        <PrismDivider />
        <HoloInstructors />
        <HoloTestimonials />
        <HoloCta />
      </main>
      <HoloFooter />
    </div>
  );
}

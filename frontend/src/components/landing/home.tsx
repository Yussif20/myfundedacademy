"use client";

import { CategoriesSection } from "@/components/landing/categories-section";
import { FeaturedCourses } from "@/components/landing/featured-courses";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { InstructorsSection } from "@/components/landing/instructors-section";
import { StatsRow } from "@/components/landing/stats-row";
import { Testimonials } from "@/components/landing/testimonials";
import { TopicsMarquee } from "@/components/landing/topics-marquee";

/** Public home page: hero, social proof, courses, categories, instructors. */
export default function Home() {
  return (
    <div>
      <HeroSection />
      <TopicsMarquee />
      <StatsRow />
      <HowItWorks />
      <FeaturedCourses />
      <CategoriesSection />
      <InstructorsSection />
      <Testimonials />
      <FinalCta />
    </div>
  );
}

"use client";

import { FeaturedCourses } from "@/components/landing/featured-courses";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsRow } from "@/components/landing/stats-row";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustedBy } from "@/components/landing/trusted-by";
import { ScrollReveal } from "@/components/motion";
import { InstructorCard } from "@/components/public/instructor-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });

  const categories = categoriesRes?.data || [];
  const instructors = instructorsRes?.data || [];

  return (
    <div>
      <HeroSection />
      <TrustedBy />
      <StatsRow />
      <HowItWorks />
      <FeaturedCourses />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal>
              <div className="mb-10 max-w-2xl">
                <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  {t("categories")}
                </h2>
                <p className="mt-2 text-[var(--muted-foreground)]">{t("categoriesSub")}</p>
              </div>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat, i) => (
                <ScrollReveal key={cat.id} delay={i * 0.05} amount={0.2}>
                  <Link
                    href={{ pathname: `/categories/${cat.slug}` }}
                    className="group relative flex h-full items-center gap-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_70%,transparent)] p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--primary)_45%,transparent)]"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                      style={{
                        background:
                          "radial-gradient(circle, color-mix(in oklch, var(--primary) 50%, transparent), transparent)",
                      }}
                    />
                    <span className="relative text-3xl">{cat.icon || "📚"}</span>
                    <div className="relative">
                      <p className="font-semibold">{(isAr && cat.nameArabic) || cat.name}</p>
                      {(cat.description || cat.descriptionArabic) && (
                        <p className="line-clamp-1 text-xs text-[var(--muted-foreground)]">
                          {(isAr && cat.descriptionArabic) || cat.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured instructors */}
      {instructors.length > 0 && (
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal>
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                    {t("featuredInstructors")}
                  </h2>
                  <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                    {t("featuredInstructorsSub")}
                  </p>
                </div>
                <Button asChild variant="outline" className="self-start gap-2 sm:self-auto">
                  <Link href="/instructors">
                    {t("browseAll")}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {instructors.map((i, idx) => (
                <ScrollReveal key={i.id} delay={idx * 0.06} amount={0.2}>
                  <InstructorCard instructor={i} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Testimonials />
      <FinalCta />
    </div>
  );
}

"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { EditionSection } from "./edition-section";

/**
 * Browse by topic, set as the paper's sections index — a ruled table of
 * contents. Each category is an indexed ledger row: mono №, serif name with
 * an ink-reveal underline, dotted leader running to a vermilion arrow.
 * No emoji tiles, no glow chips — an index page.
 */
export function NightSectionsIndex({ index }: { index: string }) {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const categories = categoriesRes?.data || [];

  if (categories.length === 0) return null;

  return (
    <EditionSection index={index}>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h2 className="dxnight-headline font-display text-3xl md:text-5xl">
                {t("categories")}
              </h2>
              <p className="mt-3 text-[var(--muted-foreground)]">{t("categoriesSub")}</p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid md:grid-cols-2 md:gap-x-14">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 0.05} amount={0.2}>
                <Link
                  href={{ pathname: `/categories/${cat.slug}` }}
                  className="group flex items-baseline gap-4 border-t border-[var(--border)] py-5 transition-colors hover:bg-[color-mix(in_srgb,var(--card)_70%,transparent)]"
                >
                  <span className="dxnight-mono shrink-0 text-[11px] text-[var(--muted-foreground)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="dxnight-underline font-display text-xl text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                      {(isAr && cat.nameArabic) || cat.name}
                    </span>
                    {(cat.description || cat.descriptionArabic) && (
                      <span className="mt-1 line-clamp-1 block text-xs text-[var(--muted-foreground)]">
                        {(isAr && cat.descriptionArabic) || cat.description}
                      </span>
                    )}
                  </span>
                  <span className="dxnight-leader" aria-hidden />
                  <ArrowRight
                    className="size-4 shrink-0 self-center text-[var(--accent)] transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </EditionSection>
  );
}

"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/**
 * Controlled Burn categories — a watchlist, not a tile grid.
 * One hairline-framed ledger of rows: mono index, symbol glyph, name,
 * one-line note, and an arrow that warms on hover.
 */
export function BurnCategories() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const categories = categoriesRes?.data || [];

  if (categories.length === 0) return null;

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <span className="dxburn-tag">
              <span aria-hidden className="dxburn-tag-mark" />
              03
            </span>
            <h2 className="font-display mt-5 text-3xl font-bold md:text-4xl">{t("categories")}</h2>
            <p className="mt-2 text-[var(--muted-foreground)]">{t("categoriesSub")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal amount={0.15}>
          <div className="dxburn-seam overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--card)]">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={{ pathname: `/categories/${cat.slug}` }}
                className="group flex items-center gap-4 border-b border-[var(--border)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[color-mix(in_oklch,var(--primary)_6%,transparent)]"
              >
                <span aria-hidden className="dxburn-micro w-7 shrink-0 text-[var(--primary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="text-2xl">
                  {cat.icon || "📚"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium transition-colors group-hover:text-[var(--primary)]">
                    {(isAr && cat.nameArabic) || cat.name}
                  </p>
                  {(cat.description || cat.descriptionArabic) && (
                    <p className="line-clamp-1 text-xs text-[var(--muted-foreground)]">
                      {(isAr && cat.descriptionArabic) || cat.description}
                    </p>
                  )}
                </div>
                <ArrowRight
                  className="size-4 shrink-0 text-[var(--muted-foreground)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--primary)] rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

"use client";

import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { useLocale, useTranslations } from "next-intl";
import { AcidSectionHeader } from "./section-header";
import { SnapIn } from "./snap";

/**
 * Acid Ledger categories — a table of contents, not a tile wall: indexed
 * ledger rows (numeral, glyph, name, dotted leader, ↗) that invert to
 * chartreuse-on-ink when hovered, like a highlighted line in a printed index.
 */
export function AcidCategories() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const categories = categoriesRes?.data || [];

  if (categories.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AcidSectionHeader title={t("categories")} sub={t("categoriesSub")} />

        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <SnapIn key={cat.id} delay={(i % 2) * 0.08}>
              <Link
                href={{ pathname: `/categories/${cat.slug}` }}
                className="dxacid-hard dxacid-hard-int dxacid-invert group flex h-full items-center gap-4 p-5"
              >
                <span
                  className="font-mono text-xs font-semibold text-[var(--dxacid-up)] group-hover:text-[var(--dxacid-ink)]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl" aria-hidden>
                  {cat.icon || "▤"}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">
                    {(isAr && cat.nameArabic) || cat.name}
                  </span>
                  {(cat.description || cat.descriptionArabic) && (
                    <span className="block truncate text-xs text-[var(--muted-foreground)] group-hover:text-[var(--dxacid-ink)]">
                      {(isAr && cat.descriptionArabic) || cat.description}
                    </span>
                  )}
                </span>
                <span className="dxacid-leader" aria-hidden />
                <span
                  className="font-mono text-lg font-semibold text-[var(--dxacid-up)] group-hover:text-[var(--dxacid-ink)] rtl:-scale-x-100"
                  aria-hidden
                >
                  ↗
                </span>
              </Link>
            </SnapIn>
          ))}
        </div>
      </div>
    </section>
  );
}

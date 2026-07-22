"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/**
 * Phosphor Terminal Noir — the sector index.
 * Categories as listing rows in a hairline grid: icon in a bordered cell,
 * name, one-line descriptor, tabular index numeral, and an up-right delta
 * arrow that warms to phosphor on hover. Registration ticks surface per row.
 */
export function PhosphorSectors() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const categories = categoriesRes?.data || [];

  if (categories.length === 0) return null;

  return (
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

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={i * 0.05} amount={0.2}>
              <Link
                href={{ pathname: `/categories/${cat.slug}` }}
                className="dxphosphor-card dxphosphor-ticks dxphosphor-ticks--hover group flex h-full items-center gap-4 p-4"
              >
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center border border-[var(--border)] text-2xl"
                >
                  {cat.icon || "▤"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {(isAr && cat.nameArabic) || cat.name}
                  </span>
                  {(cat.description || cat.descriptionArabic) && (
                    <span className="mt-0.5 block truncate text-xs text-[var(--muted-foreground)]">
                      {(isAr && cat.descriptionArabic) || cat.description}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden
                  className="font-mono text-[10px] tracking-[0.08em] text-[var(--muted-foreground)] opacity-50"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)] rtl:-scale-x-100"
                />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

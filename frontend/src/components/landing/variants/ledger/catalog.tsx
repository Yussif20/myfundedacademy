"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectionHead } from "./ornaments";

/**
 * "The Ledger Club" catalog index — categories as a table of contents inside
 * one registered frame: hairline-separated rows, category name in Fraunces, a
 * dotted leader running to a gold arrow that appears on inspection.
 */
export function LedgerCatalog() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const categories = categoriesRes?.data || [];

  if (categories.length === 0) return null;

  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHead index="№ 03" title={t("categories")} sub={t("categoriesSub")} />
        </ScrollReveal>

        <ScrollReveal amount={0.15}>
          <div className="dxledger-frame dxledger-ticks relative p-[9px]">
            <div className="grid sm:grid-cols-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={{ pathname: `/categories/${cat.slug}` }}
                  className="dxledger-row group flex items-center gap-4 px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <span className="text-2xl" aria-hidden>
                    {cat.icon || "📚"}
                  </span>
                  <span className="min-w-0">
                    <span className="font-display block truncate font-semibold tracking-tight transition-colors group-hover:text-[var(--dxledger-gold)]">
                      {(isAr && cat.nameArabic) || cat.name}
                    </span>
                    {(cat.description || cat.descriptionArabic) && (
                      <span className="mt-0.5 line-clamp-1 block text-xs text-[var(--muted-foreground)]">
                        {(isAr && cat.descriptionArabic) || cat.description}
                      </span>
                    )}
                  </span>
                  <span className="dxledger-dots" aria-hidden />
                  <ArrowRight
                    className="size-4 shrink-0 text-[var(--dxledger-gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rtl:rotate-180"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

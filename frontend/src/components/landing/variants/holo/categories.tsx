"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/** Categories as a terminal watchlist: one obsidian panel of hairline-ruled
 *  index rows. Hover ignites a 2px prism bar on the inline-start edge. */
export function HoloCategories() {
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
            <span className="dxholo-eyebrow">05</span>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              {t("categories")}
            </h2>
            <p className="mt-2 text-[var(--muted-foreground)]">{t("categoriesSub")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal amount={0.15}>
          <div className="dxholo-glass overflow-hidden rounded-[10px]">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={{ pathname: `/categories/${cat.slug}` }}
                className={`group relative flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--secondary)] sm:px-6 ${
                  i > 0 ? "border-t border-[var(--border)]" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-2 start-0 w-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "var(--dxholo-spectrum)" }}
                />
                <span className="dxholo-num w-7 shrink-0 text-xs text-[var(--muted-foreground)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="text-2xl">
                  {cat.icon || "📚"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                    {(isAr && cat.nameArabic) || cat.name}
                  </span>
                  {(cat.description || cat.descriptionArabic) && (
                    <span className="mt-0.5 line-clamp-1 block text-xs text-[var(--muted-foreground)]">
                      {(isAr && cat.descriptionArabic) || cat.description}
                    </span>
                  )}
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)] rtl:-scale-x-100"
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

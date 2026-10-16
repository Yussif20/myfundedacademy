"use client";

import { ScrollReveal } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { useLocale, useTranslations } from "next-intl";

export function CategoriesSection() {
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={i * 0.05} amount={0.2}>
              <Link
                href={{ pathname: `/categories/${cat.slug}` }}
                className="group relative flex h-full items-center gap-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_70%,transparent)] p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--primary)_45%,transparent)]"
              >
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
  );
}

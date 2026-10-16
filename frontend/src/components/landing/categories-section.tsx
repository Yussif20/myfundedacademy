"use client";

import { CategoryIcon } from "@/components/public/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function CategoriesSection() {
  const t = useTranslations("home");
  const isAr = useLocale() === "ar";

  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const categories = categoriesRes?.data || [];

  if (categories.length === 0) return null;

  return (
    <section className="bg-paper-2/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrows.categories")}
            title={t("categories")}
            lead={t("categoriesSub")}
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal as="li" key={cat.id} delay={(i % 3) * 80}>
              <Link
                href={{ pathname: `/categories/${cat.slug}` }}
                className="group flex h-full items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-background text-primary">
                  <CategoryIcon icon={cat.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg leading-tight">
                    {(isAr && cat.nameArabic) || cat.name}
                  </span>
                  {(cat.description || cat.descriptionArabic) && (
                    <span className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {(isAr && cat.descriptionArabic) || cat.description}
                    </span>
                  )}
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-rule-strong transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

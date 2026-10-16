"use client";

import { CategoryIcon } from "@/components/public/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { ArrowRight } from "lucide-react";
import { categoryImage } from "@/lib/category-images";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

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
          {categories.map((cat, i) => {
            const name = (isAr && cat.nameArabic) || cat.name;
            const description = (isAr && cat.descriptionArabic) || cat.description;
            const photo = categoryImage(cat.slug);
            return (
              <Reveal as="li" key={cat.id} delay={(i % 3) * 80}>
                <Link
                  href={{ pathname: `/categories/${cat.slug}` }}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
                >
                  <span className="relative grid aspect-[16/10] place-items-center overflow-hidden border-b border-border bg-paper-2">
                    {photo ? (
                      <Image
                        src={photo}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="grid size-16 place-items-center rounded-full border border-gold/50 bg-card text-primary">
                        <CategoryIcon icon={cat.icon} className="size-6" />
                      </span>
                    )}
                  </span>
                  <span className="flex flex-1 items-center gap-4 p-5">
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-xl leading-tight">{name}</span>
                      {description && (
                        <span className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {description}
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-rule-strong transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

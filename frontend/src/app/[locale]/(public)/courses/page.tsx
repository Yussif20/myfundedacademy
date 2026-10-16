"use client";

import { CourseCard } from "@/components/public/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShimmerCard } from "@/components/ui/skeleton";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import {
  useListCoursesQuery,
  type AccessTier,
  type CourseLanguage,
  type CourseLevel,
} from "@/redux/api/coursesApi";
import { Loader2, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const tField = useTranslations("admin.fields");
  const isAr = useLocale() === "ar";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 350);
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<CourseLevel | "">("");
  const [language, setLanguage] = useState<CourseLanguage | "">("");
  const [tier, setTier] = useState<AccessTier | "">("");

  const { data: categoriesRes } = useListCategoriesQuery();
  const { data, isLoading, isFetching } = useListCoursesQuery({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
  });

  const courses = (data?.data?.data || []).filter((c) => {
    if (level && c.level !== level) return false;
    if (language && c.language !== language) return false;
    if (tier && c.accessTier !== tier) return false;
    return true;
  });
  const meta = data?.meta;

  const hasFilters = Boolean(search || categoryId || level || language || tier);
  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setLevel("");
    setLanguage("");
    setTier("");
    setPage(1);
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <Reveal>
          <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} lead={t("subtitle")} />
        </Reveal>

        {/* Filter bar */}
        <div className="mb-10 mt-12 border-y border-border py-5">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
            <div className="relative group">
              <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t("filters.search")}
                className="ps-10"
              />
            </div>

            <FilterSelect
              value={categoryId}
              onChange={(v) => {
                setCategoryId(v);
                setPage(1);
              }}
              placeholder={t("filters.category")}
            >
              {(categoriesRes?.data || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {(isAr && c.nameArabic) || c.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={level}
              onChange={(v) => setLevel(v as CourseLevel | "")}
              placeholder={t("filters.level")}
            >
              {(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"] as const).map((l) => (
                <option key={l} value={l}>
                  {tField(`level.${l}`)}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={language}
              onChange={(v) => setLanguage(v as CourseLanguage | "")}
              placeholder={t("filters.language")}
            >
              {(["EN", "AR", "BOTH"] as const).map((l) => (
                <option key={l} value={l}>
                  {tField(`language.${l}`)}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={tier}
              onChange={(v) => setTier(v as AccessTier | "")}
              placeholder={t("filters.tier")}
            >
              {(["FREE", "STARTER", "PRO"] as const).map((l) => (
                <option key={l} value={l}>
                  {tField(`tier.${l}`)}
                </option>
              ))}
            </FilterSelect>
          </div>

          {/* Active-filter pills row */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className="eyebrow text-muted-foreground">{t("filters.active")}</span>
              {search && (
                <FilterChip
                  label={`"${search}"`}
                  onRemove={() => {
                    setSearch("");
                    setPage(1);
                  }}
                />
              )}
              {categoryId && (
                <FilterChip
                  label={(() => {
                    const c = categoriesRes?.data?.find((x) => x.id === categoryId);
                    return (c && ((isAr && c.nameArabic) || c.name)) || t("filters.category");
                  })()}
                  onRemove={() => {
                    setCategoryId("");
                    setPage(1);
                  }}
                />
              )}
              {level && (
                <FilterChip label={tField(`level.${level}`)} onRemove={() => setLevel("")} />
              )}
              {language && (
                <FilterChip
                  label={tField(`language.${language}`)}
                  onRemove={() => setLanguage("")}
                />
              )}
              {tier && <FilterChip label={tField(`tier.${tier}`)} onRemove={() => setTier("")} />}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ms-auto h-7 gap-1.5 text-xs"
              >
                <X className="size-3.5" />
                {t("filters.clear")}
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-rule-strong/50 py-20 text-center">
            <p className="font-display text-xl">{t("noResults")}</p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4 gap-2">
                <X className="size-4" />
                {t("filters.clear")}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
              <span>{t("showingResults", { count: meta?.total ?? courses.length })}</span>
              {isFetching && <Loader2 className="size-4 animate-spin text-primary" />}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 80}>
                  <CourseCard course={c} />
                </Reveal>
              ))}
            </div>
            {meta && meta.totalPage > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {t("prev")}
                </Button>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {t("page", { page, total: meta.totalPage })}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= meta.totalPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("next")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} aria-label={placeholder}>
      <option value="">{placeholder}</option>
      {children}
    </Select>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const tCommon = useTranslations("common");
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-primary/25 bg-primary/8 ps-3 pe-1 text-xs font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${tCommon("close")}: ${label}`}
        className="grid size-5 place-items-center rounded-full transition-colors hover:bg-primary/15"
      >
        <X className="size-3" aria-hidden />
      </button>
    </span>
  );
}

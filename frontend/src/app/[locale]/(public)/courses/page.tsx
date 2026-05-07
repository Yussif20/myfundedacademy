"use client";

import { ScrollReveal } from "@/components/motion";
import { CourseCard } from "@/components/public/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ShimmerCard } from "@/components/ui/skeleton";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import {
  useListCoursesQuery,
  type AccessTier,
  type CourseLanguage,
  type CourseLevel,
} from "@/redux/api/coursesApi";
import { motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const tField = useTranslations("admin.fields");

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
    <div className="relative">
      {/* Top accent gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in oklch, var(--primary) 25%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <ScrollReveal>
          <header className="mb-10">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </header>
        </ScrollReveal>

        {/* Filter bar */}
        <div className="glass mb-10 rounded-2xl p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
            <div className="relative group">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)] rtl:left-auto rtl:right-3" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t("filters.search")}
                className="border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_60%,transparent)] pl-9 transition-all focus-visible:border-[var(--primary)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklch,var(--primary)_25%,transparent)] rtl:pl-3 rtl:pr-9"
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
                  {c.name}
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 flex flex-wrap items-center gap-2 overflow-hidden border-t border-[color-mix(in_oklch,var(--border)_60%,transparent)] pt-3"
            >
              <span className="text-xs uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
                Active:
              </span>
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
                  label={categoriesRes?.data?.find((c) => c.id === categoryId)?.name || "Category"}
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
                className="ml-auto h-7 gap-1.5 text-xs"
              >
                <X className="size-3.5" />
                {t("filters.clear")}
              </Button>
            </motion.div>
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
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-20 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">{t("noResults")}</p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4 gap-2">
                <X className="size-4" />
                {t("filters.clear")}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
              <span>{t("showingResults", { count: meta?.total ?? courses.length })}</span>
              {isFetching && <Loader2 className="size-4 animate-spin text-[var(--primary)]" />}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c, i) => (
                <ScrollReveal key={c.id} delay={(i % 3) * 0.06} amount={0.15}>
                  <CourseCard course={c} />
                </ScrollReveal>
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
                <span className="text-sm text-[var(--muted-foreground)]">
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
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
      className="border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_60%,transparent)] transition-all focus-visible:border-[var(--primary)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklch,var(--primary)_25%,transparent)]"
    >
      <option value="">{placeholder}</option>
      {children}
    </Select>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        background: "color-mix(in oklch, var(--primary) 12%, transparent)",
        border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
        color: "var(--primary)",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-[color-mix(in_oklch,var(--primary)_20%,transparent)]"
      >
        <X className="size-3" />
      </button>
    </motion.span>
  );
}

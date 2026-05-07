"use client";

import { InstructorCard } from "@/components/public/instructor-card";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InstructorsDirectoryPage() {
  const t = useTranslations("instructorsPage");
  const { data, isLoading } = useListInstructorsQuery();
  const instructors = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : instructors.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] py-20 text-center text-sm text-[var(--muted-foreground)]">
          {t("noInstructors")}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((i) => (
            <InstructorCard key={i.id} instructor={i} />
          ))}
        </div>
      )}
    </div>
  );
}

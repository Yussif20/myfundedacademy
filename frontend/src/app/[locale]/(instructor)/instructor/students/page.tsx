"use client";

import { EmptyState } from "@/components/public/empty-state";
import { useTranslations } from "next-intl";

export default function InstructorStudentsPage() {
  const t = useTranslations("instructor.studentsPage");
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      <EmptyState
        illustration="search"
        title={t("comingSoonTitle")}
        description={t("comingSoonBody")}
      />
    </div>
  );
}

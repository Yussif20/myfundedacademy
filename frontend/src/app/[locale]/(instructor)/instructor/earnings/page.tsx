"use client";

import { EmptyState } from "@/components/public/empty-state";
import { useTranslations } from "next-intl";

export default function InstructorEarningsPage() {
  const t = useTranslations("instructor.earningsPage");
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      <EmptyState
        illustration="trophy"
        title={t("comingSoonTitle")}
        description={t("comingSoonBody")}
      />
    </div>
  );
}

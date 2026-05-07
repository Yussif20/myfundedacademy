"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useListMyEnrollmentsQuery } from "@/redux/api/paymentsApi";
import { BookOpen, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function MyCoursesPage() {
  const { data, isLoading } = useListMyEnrollmentsQuery();
  const enrollments = data?.data || [];
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("accountCourses");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">{t("noEnrollments")}</p>
            <Button asChild>
              <Link href="/courses">{t("browseCatalog")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {enrollments.map((e) => {
            const c = e.course;
            const title = (isAr && c.titleArabic) || c.title;
            const desc = (isAr && c.shortDescriptionArabic) || c.shortDescription;
            return (
              <li key={e.id}>
                <Link
                  href={`/learn/${c.slug}` as `/learn/${string}`}
                  className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:border-[var(--primary)]/40"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[var(--secondary)] sm:w-48 sm:shrink-0">
                      {c.thumbnail ? (
                        <Image
                          src={c.thumbnail}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="192px"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/10">
                          <BookOpen className="size-8 text-[var(--muted-foreground)]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold leading-snug">{title}</h3>
                        {e.source === "PURCHASE" && (
                          <Badge variant="success">{t("lifetime")}</Badge>
                        )}
                        {e.source === "SUBSCRIPTION" && <Badge>{t("subscription")}</Badge>}
                      </div>
                      {desc && (
                        <p className="mt-1 line-clamp-1 text-sm text-[var(--muted-foreground)]">
                          {desc}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="size-3.5" />
                          {t("lessonsCount", { count: c.totalLessons })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {t("minutes", { count: c.totalDurationMin })}
                        </span>
                        <span>
                          {t("by")} {c.instructor.user.fullName}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

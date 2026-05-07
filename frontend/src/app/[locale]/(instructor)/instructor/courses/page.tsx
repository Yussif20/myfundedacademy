"use client";

import { ScrollReveal } from "@/components/motion";
import { EmptyState } from "@/components/public/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useListMyCoursesQuery } from "@/redux/api/instructorsApi";
import { ArrowRight, BookOpen, Loader2, Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function InstructorCoursesPage() {
  const t = useTranslations("instructor.coursesPage");
  const { data, isLoading } = useListMyCoursesQuery();
  const courses = data?.data || [];

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
        </div>
        <Button asChild className="brand-glow gap-2">
          <Link href="/instructor/courses/new">
            <Plus className="size-4" />
            {t("newCourse")}
          </Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          illustration="package"
          title={t("emptyTitle")}
          description={t("emptyBody")}
          action={
            <Button asChild className="brand-glow gap-2">
              <Link href="/instructor/courses/new">
                <Plus className="size-4" />
                {t("newCourse")}
              </Link>
            </Button>
          }
        />
      ) : (
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("listTitle")}</CardTitle>
              <CardDescription>{t("listSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-[color-mix(in_oklch,var(--border)_60%,transparent)]">
                {courses.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-4 py-4 transition-colors hover:bg-[color-mix(in_oklch,var(--primary)_4%,transparent)]"
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--secondary)]">
                      {c.thumbnail ? (
                        <Image
                          src={c.thumbnail}
                          alt={c.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center">
                          <BookOpen className="size-5 text-[var(--muted-foreground)]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{c.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {c.totalLessons} lessons · {c.accessTier}
                      </p>
                    </div>
                    <Badge variant={c.status === "PUBLISHED" ? "success" : "outline"}>
                      {c.status === "PUBLISHED" && <Sparkles className="mr-1 size-3" />}
                      {c.status}
                    </Badge>
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <Link href={`/instructor/courses/${c.id}` as `/instructor/courses/${string}`}>
                        {t("edit")}
                        <ArrowRight className="size-3.5 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
}

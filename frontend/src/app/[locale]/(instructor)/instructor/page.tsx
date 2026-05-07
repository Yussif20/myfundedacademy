"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { ScrollReveal } from "@/components/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/public/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  useGetMyInstructorProfileQuery,
  useGetMyInstructorStatsQuery,
  useListMyCoursesQuery,
} from "@/redux/api/instructorsApi";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Plus,
  Sparkles,
  Star,
  UserSquare2,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function InstructorDashboardPage() {
  const t = useTranslations("instructor.dashboard");
  const { data: profileRes } = useGetMyInstructorProfileQuery();
  const { data: statsRes, isLoading: statsLoading } = useGetMyInstructorStatsQuery();
  const { data: coursesRes } = useListMyCoursesQuery();

  const stats = statsRes?.data;
  const courses = coursesRes?.data || [];
  const profile = profileRes?.data;

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklch,var(--primary)_25%,transparent)] bg-[color-mix(in_oklch,var(--primary)_8%,transparent)] px-3 py-1 text-xs font-medium text-[var(--primary)] sm:inline-flex">
          <Sparkles className="size-3" />
          {profile?.user.fullName || ""}
        </span>
      </header>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t("kpiCourses")}
          value={statsLoading ? 0 : (stats?.courseCount ?? 0)}
          Icon={BookOpen}
          delay={0}
        />
        <KpiCard
          label={t("kpiPublished")}
          value={statsLoading ? 0 : (stats?.publishedCount ?? 0)}
          Icon={Sparkles}
          delay={0.1}
        />
        <KpiCard
          label={t("kpiEnrollments")}
          value={statsLoading ? 0 : (stats?.totalEnrollments ?? 0)}
          Icon={GraduationCap}
          delay={0.2}
        />
        <KpiCard
          label={t("kpiRating")}
          value={statsLoading ? 0 : Math.round((stats?.avgRating ?? 0) * 10)}
          suffix={` / 50`}
          Icon={Star}
          delay={0.3}
        />
      </div>

      {/* Quick actions */}
      <ScrollReveal>
        <div className="grid gap-3 sm:grid-cols-3">
          <ActionCard
            href="/instructor/courses/new"
            title={t("newCourse")}
            icon={<Plus className="size-5" />}
            primary
          />
          <ActionCard
            href="/instructor/profile"
            title={t("editProfile")}
            icon={<UserSquare2 className="size-5" />}
          />
          {profile && (
            <ActionCard
              href={`/instructors/${profile.id}` as `/instructors/${string}`}
              title={t("viewPublic")}
              icon={<ExternalLink className="size-5" />}
              external
            />
          )}
        </div>
      </ScrollReveal>

      {/* My recent courses */}
      <ScrollReveal>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("recentCoursesTitle")}</CardTitle>
            <CardDescription>{t("recentCoursesSub")}</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <EmptyState
                illustration="package"
                title={t("noCoursesYetTitle")}
                description={t("noCoursesYetBody")}
                action={
                  <Button asChild className="brand-glow">
                    <Link href="/instructor/courses/new" className="gap-2">
                      <Plus className="size-4" />
                      {t("newCourse")}
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-[color-mix(in_oklch,var(--border)_60%,transparent)]">
                {courses.slice(0, 5).map((c) => (
                  <li key={c.id} className="flex items-center gap-4 py-3">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-lg text-[var(--primary)]"
                      style={{
                        background: "color-mix(in oklch, var(--primary) 12%, transparent)",
                      }}
                    >
                      <BookOpen className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {c.totalLessons} lessons · {c.status}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <Link href={`/instructor/courses/${c.id}` as `/instructor/courses/${string}`}>
                        Edit
                        <ArrowRight className="size-3.5 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}

function ActionCard({
  href,
  title,
  icon,
  primary,
  external,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
  primary?: boolean;
  external?: boolean;
}) {
  return (
    <Link
      href={href as Parameters<typeof Link>[0]["href"]}
      className={`group flex items-center gap-4 rounded-xl border p-4 backdrop-blur transition-all hover:-translate-y-0.5 ${
        primary
          ? "border-[color-mix(in_oklch,var(--primary)_40%,transparent)] bg-[color-mix(in_oklch,var(--primary)_10%,transparent)] hover:border-[var(--primary)]"
          : "border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_75%,transparent)] hover:border-[color-mix(in_oklch,var(--primary)_30%,transparent)]"
      }`}
    >
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl text-[var(--primary)]"
        style={{
          background: "color-mix(in oklch, var(--primary) 12%, transparent)",
          border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
        }}
      >
        {icon}
      </span>
      <p className="flex-1 font-medium">{title}</p>
      {external ? (
        <ExternalLink className="size-4 text-[var(--primary)] opacity-60 transition-opacity group-hover:opacity-100" />
      ) : (
        <ArrowRight className="size-4 text-[var(--primary)] transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
      )}
    </Link>
  );
}

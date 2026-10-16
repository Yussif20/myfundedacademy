"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { Reveal } from "@/components/ui/reveal";
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
          <h1 className="font-display text-4xl font-medium tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
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
          value={stats?.avgRating ?? 0}
          display={statsLoading ? "–" : (stats?.avgRating ?? 0).toFixed(1)}
          suffix=" / 5"
          Icon={Star}
          delay={0.3}
        />
      </div>

      {/* Quick actions */}
      <Reveal>
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
      </Reveal>

      {/* My recent courses */}
      <Reveal>
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
                  <Button asChild>
                    <Link href="/instructor/courses/new" className="gap-2">
                      <Plus className="size-4" />
                      {t("newCourse")}
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {courses.slice(0, 5).map((c) => (
                  <li key={c.id} className="flex items-center gap-4 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full text-primary border border-border bg-paper-2 font-display">
                      <BookOpen className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
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
      </Reveal>
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
      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all ${
        primary
          ? "border-primary/40 bg-primary/10 hover:border-primary"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full text-primary border border-border bg-paper-2 font-display">
        {icon}
      </span>
      <p className="flex-1 font-medium">{title}</p>
      {external ? (
        <ExternalLink className="size-4 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
      ) : (
        <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
      )}
    </Link>
  );
}

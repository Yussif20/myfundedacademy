"use client";

import { EnrollmentsChart, RevenueChart } from "@/components/admin/dashboard-charts";
import { KpiCard } from "@/components/admin/kpi-card";
import { ScrollReveal } from "@/components/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  GraduationCap,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminHomePage() {
  const t = useTranslations("admin.dashboard");
  const { data: coursesRes } = useListCoursesQuery({ limit: 5 });
  const topCourses = coursesRes?.data?.data || [];

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklch,var(--accent)_30%,transparent)] bg-[color-mix(in_oklch,var(--accent)_10%,transparent)] px-3 py-1 text-xs font-medium text-[var(--accent)] sm:inline-flex">
          <Sparkles className="size-3" />
          {t("demoData")}
        </span>
      </header>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t("kpiRevenue")}
          value={28430}
          prefix="$"
          format="currency"
          delta={12.4}
          Icon={DollarSign}
          delay={0}
        />
        <KpiCard
          label={t("kpiSubscribers")}
          value={342}
          delta={8.1}
          Icon={UsersRound}
          delay={0.1}
        />
        <KpiCard
          label={t("kpiEnrollments")}
          value={1248}
          delta={18.7}
          Icon={GraduationCap}
          delay={0.2}
        />
        <KpiCard
          label={t("kpiCompletion")}
          value={68}
          suffix="%"
          format="percent"
          delta={-2.3}
          Icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ScrollReveal className="lg:col-span-2">
          <Card className="overflow-hidden border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                {t("revenueChartTitle")}
              </CardTitle>
              <CardDescription>{t("revenueChartSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="overflow-hidden border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">{t("enrollmentsChartTitle")}</CardTitle>
              <CardDescription>{t("enrollmentsChartSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              <EnrollmentsChart />
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Top courses + manage cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ScrollReveal className="lg:col-span-2">
          <Card className="border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">{t("topCoursesTitle")}</CardTitle>
              <CardDescription>{t("topCoursesSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              {topCourses.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[var(--border)] py-10 text-center text-sm text-[var(--muted-foreground)]">
                  No courses yet — add some at /admin/courses.
                </p>
              ) : (
                <ul className="divide-y divide-[color-mix(in_oklch,var(--border)_60%,transparent)]">
                  {topCourses.slice(0, 5).map((c, i) => {
                    const fakeEnrollments = Math.max(8, 240 - i * 40 - i * i * 5);
                    const fakeCompletion = Math.max(28, 88 - i * 9);
                    return (
                      <li
                        key={c.id}
                        className="flex items-center gap-4 py-3 transition-colors hover:bg-[color-mix(in_oklch,var(--primary)_4%,transparent)]"
                      >
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-[var(--primary)]"
                          style={{
                            background: "color-mix(in oklch, var(--primary) 12%, transparent)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{c.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {c.instructor.user.fullName}
                          </p>
                        </div>
                        <div className="hidden text-right text-xs sm:block">
                          <p className="font-display text-sm font-semibold text-[var(--foreground)]">
                            {fakeEnrollments}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                            Enrolled
                          </p>
                        </div>
                        <div className="hidden w-24 sm:block">
                          <div className="h-1.5 overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--secondary)_70%,transparent)]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                              style={{ width: `${fakeCompletion}%` }}
                            />
                          </div>
                          <p className="mt-1 text-right text-[10px] text-[var(--muted-foreground)]">
                            {fakeCompletion}% done
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid gap-3">
            <DashCard
              href="/admin/categories"
              title={t("categoriesCard")}
              description={t("categoriesDesc")}
              icon={<Tag className="size-5" />}
              cta={t("manage")}
            />
            <DashCard
              href="/admin/instructors"
              title={t("instructorsCard")}
              description={t("instructorsDesc")}
              icon={<Users className="size-5" />}
              cta={t("manage")}
            />
            <DashCard
              href="/admin/courses"
              title={t("coursesCard")}
              description={t("coursesDesc")}
              icon={<BookOpen className="size-5" />}
              cta={t("manage")}
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

function DashCard({
  href,
  title,
  description,
  icon,
  cta,
}: {
  href: "/admin/categories" | "/admin/instructors" | "/admin/courses";
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--primary)_35%,transparent)]">
        <CardContent className="flex items-center gap-4 p-4">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-xl text-[var(--primary)]"
            style={{
              background: "color-mix(in oklch, var(--primary) 12%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 22%, transparent)",
            }}
          >
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{title}</p>
            <p className="line-clamp-1 text-xs text-[var(--muted-foreground)]">{description}</p>
          </div>
          <span className="inline-flex items-center text-sm font-medium text-[var(--primary)]">
            {cta}
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

"use client";

import { EnrollmentsChart, RevenueChart } from "@/components/admin/dashboard-charts";
import { KpiCard } from "@/components/admin/kpi-card";
import { Reveal } from "@/components/ui/reveal";
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
          <h1 className="font-display text-4xl font-medium tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent sm:inline-flex">
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
        <Reveal className="lg:col-span-2">
          <Card className="overflow-hidden">
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
        </Reveal>

        <Reveal delay={100}>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{t("enrollmentsChartTitle")}</CardTitle>
              <CardDescription>{t("enrollmentsChartSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              <EnrollmentsChart />
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Top courses + manage cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">{t("topCoursesTitle")}</CardTitle>
              <CardDescription>{t("topCoursesSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              {topCourses.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                  No courses yet — add some at /admin/courses.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {topCourses.slice(0, 5).map((c, i) => {
                    const fakeEnrollments = Math.max(8, 240 - i * 40 - i * i * 5);
                    const fakeCompletion = Math.max(28, 88 - i * 9);
                    return (
                      <li
                        key={c.id}
                        className="flex items-center gap-4 py-3 transition-colors hover:bg-primary/4"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium text-primary border border-border bg-paper-2 font-display">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{c.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {c.instructor.user.fullName}
                          </p>
                        </div>
                        <div className="hidden text-end text-xs sm:block">
                          <p className="font-display text-sm font-medium text-foreground">
                            {fakeEnrollments}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                            Enrolled
                          </p>
                        </div>
                        <div className="hidden w-24 sm:block">
                          <div className="h-1.5 overflow-hidden rounded-full bg-border">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${fakeCompletion}%` }}
                            />
                          </div>
                          <p className="mt-1 text-end text-[10px] text-muted-foreground">
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
        </Reveal>

        <Reveal delay={100}>
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
        </Reveal>
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
      <Card className="transition-colors hover:border-primary/40">
        <CardContent className="flex items-center gap-4 p-4 sm:p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full text-primary border border-border bg-paper-2 font-display">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg leading-tight">{title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center text-sm font-medium text-primary">
            {cta}
            <ArrowRight className="ms-1 size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

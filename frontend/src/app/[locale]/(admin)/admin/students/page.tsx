"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Link } from "@/i18n/navigation";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { useListAllEnrollmentsQuery, useListAllSubscriptionsQuery } from "@/redux/api/paymentsApi";
import { CreditCard, GraduationCap, Loader2, TrendingUp, Users } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

export default function AdminStudentsPage() {
  const t = useTranslations("admin.studentsPage");
  const format = useFormatter();
  const locale = useLocale();
  const isAr = locale === "ar";

  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [debouncedSearch] = useDebounce(search.trim(), 250);

  const [subSearch, setSubSearch] = useState("");
  const [debouncedSubSearch] = useDebounce(subSearch.trim(), 250);

  const { data, isLoading } = useListAllEnrollmentsQuery({
    search: debouncedSearch || undefined,
    courseId: courseId || undefined,
  });
  const rows = data?.data ?? [];

  const { data: subsData, isLoading: subsLoading } = useListAllSubscriptionsQuery({
    search: debouncedSubSearch || undefined,
  });
  const subs = subsData?.data ?? [];

  // For the course filter dropdown — all courses (admin scope sees all).
  const { data: coursesData } = useListCoursesQuery({ limit: 100 });
  const courses = coursesData?.data?.data ?? [];

  const stats = useMemo(() => {
    if (rows.length === 0) return { total: 0, unique: 0, avg: 0 };
    const unique = new Set(rows.map((r) => r.student.id)).size;
    const avg = Math.round(rows.reduce((s, r) => s + r.progressPct, 0) / rows.length);
    return { total: rows.length, unique, avg };
  }, [rows]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={t("kpiTotal")} value={stats.total} Icon={Users} delay={0} />
        <KpiCard label={t("kpiUnique")} value={stats.unique} Icon={GraduationCap} delay={0.05} />
        <KpiCard label={t("kpiSubscribers")} value={subs.length} Icon={CreditCard} delay={0.1} />
        <KpiCard
          label={t("kpiAvgProgress")}
          value={stats.avg}
          suffix="%"
          format="percent"
          Icon={TrendingUp}
          delay={0.15}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">{t("subscribersTitle")}</CardTitle>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {t("subscribersSubtitle")}
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder={t("subscribersSearch")}
              value={subSearch}
              onChange={(e) => setSubSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {subsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
            </div>
          ) : subs.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">
              {debouncedSubSearch ? t("noSubscribersMatch") : t("noSubscribers")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                    <th className="py-2 pe-4 font-medium">{t("colStudent")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colPlan")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colStatus")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colSince")}</th>
                    <th className="py-2 pe-2 font-medium">{t("colRenewsOn")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color-mix(in_oklch,var(--border)_60%,transparent)]">
                  {subs.map((s) => {
                    const initials = s.user.fullName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase() ?? "")
                      .join("");
                    const statusVariant: "success" | "warning" | "destructive" | "outline" =
                      s.status === "ACTIVE" || s.status === "TRIALING"
                        ? "success"
                        : s.status === "PAST_DUE"
                          ? "warning"
                          : s.status === "CANCELED" ||
                              s.status === "UNPAID" ||
                              s.status === "INCOMPLETE_EXPIRED"
                            ? "destructive"
                            : "outline";
                    return (
                      <tr key={s.id} className="align-middle">
                        <td className="py-3 pe-4">
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden
                              className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-[var(--primary)]"
                              style={{
                                background: "color-mix(in oklch, var(--primary) 14%, transparent)",
                                border:
                                  "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
                              }}
                            >
                              {initials || "?"}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{s.user.fullName}</p>
                              <p className="truncate text-xs text-[var(--muted-foreground)]">
                                {s.user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pe-4">
                          <Badge variant="secondary">{t(`plan.${s.plan}`)}</Badge>
                        </td>
                        <td className="py-3 pe-4">
                          <div className="flex items-center gap-2">
                            <Badge variant={statusVariant}>{t(`subStatus.${s.status}`)}</Badge>
                            {s.cancelAtPeriodEnd && (
                              <Badge variant="outline" className="text-[10px]">
                                {t("cancelAtPeriodEnd")}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pe-4 whitespace-nowrap text-[var(--muted-foreground)]">
                          {format.dateTime(new Date(s.createdAt), {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 pe-2 whitespace-nowrap text-[var(--muted-foreground)]">
                          {s.currentPeriodEnd
                            ? format.dateTime(new Date(s.currentPeriodEnd), {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">{t("enrollmentsTitle")}</CardTitle>
          <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="sm:w-60"
            >
              <option value="">{t("allCourses")}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {(isAr && c.titleArabic) || c.title}
                </option>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
            </div>
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
              {debouncedSearch || courseId ? t("noMatches") : t("noStudents")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                    <th className="py-2 pe-4 font-medium">{t("colStudent")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colCourse")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colInstructor")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colEnrolled")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colSource")}</th>
                    <th className="py-2 pe-2 font-medium">{t("colProgress")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color-mix(in_oklch,var(--border)_60%,transparent)]">
                  {rows.map((r) => {
                    const courseTitle = (isAr && r.course.titleArabic) || r.course.title;
                    const initials = r.student.fullName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((s) => s[0]?.toUpperCase() ?? "")
                      .join("");
                    const expired = r.expiresAt && new Date(r.expiresAt) < new Date();
                    return (
                      <tr key={r.enrollmentId} className="align-middle">
                        <td className="py-3 pe-4">
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden
                              className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-[var(--primary)]"
                              style={{
                                background: "color-mix(in oklch, var(--primary) 14%, transparent)",
                                border:
                                  "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
                              }}
                            >
                              {initials || "?"}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{r.student.fullName}</p>
                              <p className="truncate text-xs text-[var(--muted-foreground)]">
                                {r.student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pe-4">
                          <Link
                            href={{ pathname: `/admin/courses/${r.course.id}` } as never}
                            className="font-medium hover:text-[var(--primary)]"
                          >
                            {courseTitle}
                          </Link>
                        </td>
                        <td className="py-3 pe-4 whitespace-nowrap text-[var(--muted-foreground)]">
                          {r.course.instructor ? (
                            <Link
                              href={
                                {
                                  pathname: `/admin/instructors/${r.course.instructor.id}`,
                                } as never
                              }
                              className="hover:text-[var(--primary)]"
                            >
                              {r.course.instructor.fullName}
                            </Link>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 pe-4 whitespace-nowrap text-[var(--muted-foreground)]">
                          {format.dateTime(new Date(r.enrolledAt), {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 pe-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{t(`source.${r.source}`)}</Badge>
                            {expired && <Badge variant="destructive">{t("expired")}</Badge>}
                          </div>
                        </td>
                        <td className="py-3 pe-2 min-w-[180px]">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--secondary)_70%,transparent)]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all"
                                style={{ width: `${r.progressPct}%` }}
                              />
                            </div>
                            <div className="text-right">
                              <p className="font-display text-sm font-semibold tabular-nums">
                                {r.progressPct}%
                              </p>
                              <p className="text-[10px] text-[var(--muted-foreground)]">
                                {t("lessonsCompleted", {
                                  done: r.completedLessons,
                                  total: r.course.totalLessons,
                                })}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useListMyStudentsQuery, useListMySubscribersQuery } from "@/redux/api/instructorsApi";
import { CreditCard, GraduationCap, Loader2, TrendingUp, Users } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

export default function InstructorStudentsPage() {
  const t = useTranslations("instructor.studentsPage");
  const format = useFormatter();
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data, isLoading } = useListMyStudentsQuery();
  const rows = data?.data ?? [];

  const [subSearch, setSubSearch] = useState("");
  const [debouncedSubSearch] = useDebounce(subSearch.trim(), 250);
  const { data: subsData, isLoading: subsLoading } = useListMySubscribersQuery({
    search: debouncedSubSearch || undefined,
  });
  const subs = subsData?.data ?? [];

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const courseTitle = (isAr && r.course.titleArabic) || r.course.title;
      return (
        r.student.fullName.toLowerCase().includes(q) ||
        r.student.email.toLowerCase().includes(q) ||
        courseTitle.toLowerCase().includes(q)
      );
    });
  }, [rows, search, isAr]);

  const stats = useMemo(() => {
    if (rows.length === 0) return { total: 0, unique: 0, avg: 0 };
    const unique = new Set(rows.map((r) => r.student.id)).size;
    const avg = Math.round(rows.reduce((sum, r) => sum + r.progressPct, 0) / rows.length);
    return { total: rows.length, unique, avg };
  }, [rows]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl font-medium tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
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
            <p className="mt-1 text-xs text-muted-foreground">{t("subscribersSubtitle")}</p>
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
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : subs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {debouncedSubSearch ? t("noSubscribersMatch") : t("noSubscribers")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-start text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="py-2 pe-4 font-medium">{t("colStudent")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colPlan")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colStatus")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colSince")}</th>
                    <th className="py-2 pe-2 font-medium">{t("colRenewsOn")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
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
                              className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium text-primary border border-border bg-paper-2 font-display"
                            >
                              {initials || "?"}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{s.user.fullName}</p>
                              <p className="truncate text-xs text-muted-foreground">
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
                        <td className="py-3 pe-4 whitespace-nowrap text-muted-foreground">
                          {format.dateTime(new Date(s.createdAt), {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 pe-2 whitespace-nowrap text-muted-foreground">
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
          <div className="w-full sm:max-w-sm">
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">{t("noStudents")}</p>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">{t("noMatches")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-start text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="py-2 pe-4 font-medium">{t("colStudent")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colCourse")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colEnrolled")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colSource")}</th>
                    <th className="py-2 pe-2 font-medium">{t("colProgress")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => {
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
                              className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium text-primary border border-border bg-paper-2 font-display"
                            >
                              {initials || "?"}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{r.student.fullName}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {r.student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pe-4">
                          <Link
                            href={{ pathname: `/instructor/courses/${r.course.id}` } as never}
                            className="font-medium hover:text-primary"
                          >
                            {courseTitle}
                          </Link>
                        </td>
                        <td className="py-3 pe-4 whitespace-nowrap text-muted-foreground">
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
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${r.progressPct}%` }}
                              />
                            </div>
                            <div className="text-end">
                              <p className="font-display text-sm font-medium tabular-nums">
                                {r.progressPct}%
                              </p>
                              <p className="text-[10px] text-muted-foreground">
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

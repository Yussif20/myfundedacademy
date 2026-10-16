"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useGetMyEarningsQuery } from "@/redux/api/instructorsApi";
import { Calendar, DollarSign, Info, Loader2, Sparkles, ShoppingBag } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

export default function InstructorEarningsPage() {
  const t = useTranslations("instructor.earningsPage");
  const format = useFormatter();
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data, isLoading } = useGetMyEarningsQuery();
  const earnings = data?.data;

  if (isLoading || !earnings) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const currency = (earnings.currency || "usd").toUpperCase();
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);

  const topCourse = earnings.byCourse[0];
  const topCourseLabel = topCourse
    ? (isAr && topCourse.course.titleArabic) || topCourse.course.title
    : "—";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      <Alert>
        <Info className="size-4" />
        <AlertTitle>{t("disclaimerTitle")}</AlertTitle>
        <AlertDescription>{t("disclaimerBody")}</AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t("kpiTotalGross")}
          value={earnings.totalGross}
          prefix="$"
          format="currency"
          Icon={DollarSign}
          delay={0}
        />
        <KpiCard
          label={t("kpiLast30")}
          value={earnings.last30Gross}
          prefix="$"
          format="currency"
          Icon={Calendar}
          delay={0.05}
        />
        <KpiCard
          label={t("kpiOrderCount")}
          value={earnings.orderCount}
          Icon={ShoppingBag}
          delay={0.1}
        />
        <Card className="overflow-hidden border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_85%,transparent)] backdrop-blur">
          <CardContent className="flex h-full flex-col gap-2 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              <Sparkles className="size-4 text-[var(--accent)]" />
              {t("kpiTopCourse")}
            </div>
            <p className="font-display line-clamp-2 text-lg font-semibold leading-snug">
              {topCourseLabel}
            </p>
            {topCourse && (
              <p className="mt-auto font-display text-xl font-bold tabular-nums text-[var(--primary)]">
                {fmtMoney(topCourse.gross)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("byCourseTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.byCourse.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">
              {earnings.orderCount === 0 ? t("noEarnings") : t("noCourses")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-start text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                    <th className="py-2 pe-4 font-medium">{t("colCourse")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colOrders")}</th>
                    <th className="py-2 pe-2 font-medium text-end">{t("colGross")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color-mix(in_oklch,var(--border)_60%,transparent)]">
                  {earnings.byCourse.map((row) => {
                    const title = (isAr && row.course.titleArabic) || row.course.title;
                    const share =
                      earnings.totalGross > 0
                        ? Math.round((row.gross / earnings.totalGross) * 100)
                        : 0;
                    return (
                      <tr key={row.course.id} className="align-middle">
                        <td className="py-3 pe-4">
                          <Link
                            href={{ pathname: `/instructor/courses/${row.course.id}` } as never}
                            className="font-medium hover:text-[var(--primary)]"
                          >
                            {title}
                          </Link>
                          <div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--secondary)_70%,transparent)]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 pe-4 tabular-nums text-[var(--muted-foreground)]">
                          {row.orderCount}
                        </td>
                        <td className="py-3 pe-2 text-end font-display font-semibold tabular-nums">
                          {fmtMoney(row.gross)}
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
        <CardHeader>
          <CardTitle className="text-lg">{t("recentTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.recent.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">
              {t("noRecent")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-start text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                    <th className="py-2 pe-4 font-medium">{t("colStudent")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colCourse")}</th>
                    <th className="py-2 pe-4 font-medium">{t("colPaid")}</th>
                    <th className="py-2 pe-2 font-medium text-end">{t("colAmount")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color-mix(in_oklch,var(--border)_60%,transparent)]">
                  {earnings.recent.map((o) => (
                    <tr key={o.id} className="align-middle">
                      <td className="py-3 pe-4">
                        {o.student ? (
                          <>
                            <p className="font-medium">{o.student.fullName}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {o.student.email}
                            </p>
                          </>
                        ) : (
                          <span className="text-[var(--muted-foreground)]">—</span>
                        )}
                      </td>
                      <td className="py-3 pe-4">
                        {o.courseId ? (
                          <Link
                            href={{ pathname: `/instructor/courses/${o.courseId}` } as never}
                            className="hover:text-[var(--primary)]"
                          >
                            {o.courseTitle}
                          </Link>
                        ) : (
                          <span className="text-[var(--muted-foreground)]">—</span>
                        )}
                      </td>
                      <td className="py-3 pe-4 whitespace-nowrap text-[var(--muted-foreground)]">
                        {format.dateTime(new Date(o.paidAt), {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 pe-2 text-end font-display font-semibold tabular-nums">
                        {fmtMoney(o.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

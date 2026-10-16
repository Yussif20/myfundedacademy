"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/public/star-rating";
import { Link } from "@/i18n/navigation";
import { useListCourseReviewsQuery } from "@/redux/api/reviewsApi";
import { Loader2, MessageSquare } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function ReviewsSection({
  slug,
  viewerHasAccess,
}: {
  slug: string;
  viewerHasAccess: boolean;
}) {
  const { data, isLoading } = useListCourseReviewsQuery({ slug, limit: 5 });
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("reviewsSection");

  const reviews = data?.data?.data || [];
  const meta = data?.meta;
  const avg = meta?.averageRating ?? 0;
  const total = meta?.total ?? 0;
  const dist = meta?.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-medium tracking-tight">{t("title")}</h2>
        {viewerHasAccess && (
          <Button asChild size="sm" variant="outline">
            <Link href={`/learn/${slug}/review` as `/learn/${string}/review`}>{t("leave")}</Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        </div>
      ) : total === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-sm text-muted-foreground sm:py-12">
            <MessageSquare className="size-5 text-rule-strong" aria-hidden />
            <p>{t("noneYet")}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
              <div className="flex flex-col items-center justify-center gap-2 border-b border-border pb-6 text-center md:border-b-0 md:border-e md:pb-0 md:pe-6">
                <p className="font-display text-5xl font-light tabular-nums">{avg.toFixed(1)}</p>
                <StarRating value={avg} size={18} />
                <p className="text-xs text-muted-foreground">
                  {t("reviewsCount", { count: total })}
                </p>
              </div>
              <DistributionBars dist={dist} total={total} />
            </CardContent>
          </Card>

          <ul className="space-y-3">
            {reviews.map((r) => {
              const title = (isAr && r.titleArabic) || r.title;
              const body = (isAr && r.bodyArabic) || r.body;
              return (
                <li key={r.id}>
                  <Card>
                    <CardContent className="space-y-2 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 place-items-center rounded-full border border-border bg-paper-2 font-display text-sm text-primary">
                            {r.user?.fullName?.charAt(0) || "?"}
                          </span>
                          <div className="leading-tight">
                            <p className="text-sm font-medium">
                              {r.user?.fullName || t("anonymous")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString(
                                isAr ? "ar-EG-u-nu-latn" : "en-US",
                                { dateStyle: "medium" },
                              )}
                            </p>
                          </div>
                        </div>
                        <StarRating value={r.rating} size={14} />
                      </div>
                      {title && <p className="font-display text-lg">{title}</p>}
                      {body && (
                        <p className="whitespace-pre-line text-sm text-muted-foreground">{body}</p>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>

          {meta && meta.total > reviews.length && (
            <p className="text-center text-xs text-muted-foreground">
              {t("showingNOf", { shown: reviews.length, total: meta.total })}
            </p>
          )}
        </>
      )}
    </section>
  );
}

function DistributionBars({ dist, total }: { dist: Record<string, number>; total: number }) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = dist[String(star)] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-6 tabular-nums text-muted-foreground">{star}★</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
              <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-10 text-end text-xs tabular-nums text-muted-foreground">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

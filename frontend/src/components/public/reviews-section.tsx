"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/public/star-rating";
import { Link } from "@/i18n/navigation";
import { useListCourseReviewsQuery } from "@/redux/api/reviewsApi";
import { Loader2, MessageSquare } from "lucide-react";
import { useLocale } from "next-intl";

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

  const reviews = data?.data?.data || [];
  const meta = data?.meta;
  const avg = meta?.averageRating ?? 0;
  const total = meta?.total ?? 0;
  const dist = meta?.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight">Student reviews</h2>
        {viewerHasAccess && (
          <Button asChild size="sm">
            <Link href={`/learn/${slug}/review` as `/learn/${string}/review`}>Leave a review</Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : total === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-[var(--muted-foreground)]">
            <MessageSquare className="size-6" />
            <p>No reviews yet. Be the first to share what you thought.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
              <div className="flex flex-col items-center justify-center gap-2 border-b border-[var(--border)] pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-6 rtl:md:border-l rtl:md:border-r-0 rtl:md:pl-6 rtl:md:pr-0">
                <p className="font-display text-5xl font-bold">{avg.toFixed(1)}</p>
                <StarRating value={avg} size={18} />
                <p className="text-xs text-[var(--muted-foreground)]">
                  {total} review{total === 1 ? "" : "s"}
                </p>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = dist[String(star)] ?? 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-6 text-[var(--muted-foreground)]">{star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--secondary)]">
                        <div
                          className="h-full bg-[var(--accent)] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-[var(--muted-foreground)]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
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
                          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)]/30 to-[var(--accent)]/20 font-display text-sm font-semibold text-[var(--primary)]">
                            {r.user?.fullName?.charAt(0) || "?"}
                          </span>
                          <div className="leading-tight">
                            <p className="text-sm font-medium">{r.user?.fullName || "Student"}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <StarRating value={r.rating} size={14} />
                      </div>
                      {title && <p className="font-medium">{title}</p>}
                      {body && (
                        <p className="whitespace-pre-line text-sm text-[var(--muted-foreground)]">
                          {body}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>

          {meta && meta.total > reviews.length && (
            <p className="text-center text-xs text-[var(--muted-foreground)]">
              Showing {reviews.length} of {meta.total} reviews
            </p>
          )}
        </>
      )}
    </section>
  );
}

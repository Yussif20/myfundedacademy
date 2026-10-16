"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/public/star-rating";
import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthGuard } from "@/components/auth-guard";
import { Link, useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useGetMyReviewQuery, useUpsertCourseReviewMutation } from "@/redux/api/reviewsApi";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  return (
    <AuthGuard>
      <ReviewContent />
    </AuthGuard>
  );
}

function ReviewContent() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const router = useRouter();
  const t = useTranslations("reviewWrite");

  const { data, isLoading } = useGetMyReviewQuery(slug, { skip: !slug });
  const [upsert, { isLoading: saving }] = useUpsertCourseReviewMutation();

  const existing = data?.data;

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) {
      setRating(existing.rating);
      setTitle(existing.title || "");
      setBody(existing.body || "");
    }
  }, [existing]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError(t("ratingRequired"));
      return;
    }
    try {
      await upsert({ slug, rating, title, body }).unwrap();
      router.push(`/courses/${slug}` as `/courses/${string}`);
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" aria-label="Home" className="hidden md:block">
            <Wordmark height={32} />
          </Link>
          <Link
            href={`/learn/${slug}` as `/learn/${string}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t("backToCourse")}
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-14">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl font-medium tracking-tight">
              {existing ? t("updateTitle") : t("leaveTitle")}
            </CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>{t("ratingLabel")}</Label>
                <div className="flex items-center gap-3">
                  <StarRating value={rating} size={28} onChange={setRating} />
                  <span className="text-sm text-muted-foreground">
                    {rating > 0 ? t("starsOf", { rating }) : t("pickRating")}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">{t("titleLabel")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("titlePlaceholder")}
                  maxLength={160}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">{t("bodyLabel")}</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={t("bodyPlaceholder")}
                  rows={6}
                  maxLength={2000}
                  disabled={saving}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" disabled={saving}>
                  <Link href={`/courses/${slug}` as `/courses/${string}`}>{t("cancel")}</Link>
                </Button>
                <Button type="submit" disabled={saving || rating < 1}>
                  {saving
                    ? existing
                      ? t("updating")
                      : t("submitting")
                    : existing
                      ? t("update")
                      : t("submit")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

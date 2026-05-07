"use client";

import { CourseCard } from "@/components/public/course-card";
import { InstructorCard } from "@/components/public/instructor-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import { useListCoursesQuery } from "@/redux/api/coursesApi";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { ArrowRight, Loader2, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { data: featuredCoursesRes, isLoading: coursesLoading } = useListCoursesQuery({
    featured: true,
    limit: 6,
  });
  const { data: allCoursesRes } = useListCoursesQuery({ limit: 6 });
  const { data: categoriesRes } = useListCategoriesQuery({ featured: true });
  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });

  const featuredCourses =
    (featuredCoursesRes?.data?.data?.length
      ? featuredCoursesRes.data.data
      : allCoursesRes?.data?.data) || [];
  const categories = categoriesRes?.data || [];
  const instructors = instructorsRes?.data || [];

  return (
    <div>
      <Hero t={t} />

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader
          title={t("featuredCourses")}
          subtitle={t("featuredCoursesSub")}
          cta={
            <Button asChild variant="outline">
              <Link href="/courses" className="gap-2">
                {t("browseAll")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          }
        />

        {coursesLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : featuredCourses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--muted-foreground)]">
            No published courses yet — admin can add some at /admin/courses.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-[var(--card)]/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader title={t("categories")} subtitle={t("categoriesSub")} />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={{ pathname: `/categories/${cat.slug}` }}
                  className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--primary)]/40"
                >
                  <span className="text-3xl">{cat.icon || "📚"}</span>
                  <div>
                    <p className="font-semibold">{(isAr && cat.nameArabic) || cat.name}</p>
                    {(cat.description || cat.descriptionArabic) && (
                      <p className="line-clamp-1 text-xs text-[var(--muted-foreground)]">
                        {(isAr && cat.descriptionArabic) || cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured instructors */}
      {instructors.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeader
            title={t("featuredInstructors")}
            subtitle={t("featuredInstructorsSub")}
            cta={
              <Button asChild variant="outline">
                <Link href="/instructors" className="gap-2">
                  {t("browseAll")}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {instructors.map((i) => (
              <InstructorCard key={i.id} instructor={i} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--background)] p-12 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 size-[400px] -translate-x-1/2 rounded-full opacity-30 blur-[80px]"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)" }}
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[var(--muted-foreground)]">
              {t("ctaSubtitle")}
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/signup">{t("ctaButton")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Hero({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[800px] rounded-full opacity-25 blur-[140px]"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 size-[500px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--card)]/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)] backdrop-blur">
            {t("heroEyebrow")}
          </span>
          <h1 className="font-display mt-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-[var(--muted-foreground)] md:text-xl">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/courses">
                {t("heroCta")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-3">
          <Feature icon={<ShieldCheck className="size-5" />} title="DRM-protected">
            Widevine + FairPlay + PlayReady. Watermarked per viewer.
          </Feature>
          <Feature icon={<Sparkles className="size-5" />} title="Real instructors">
            Funded traders teaching strategies they actually trade.
          </Feature>
          <Feature icon={<Trophy className="size-5" />} title="Verified certificates">
            Every completion gets a certificate with a public verification URL.
          </Feature>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/50 p-5 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </span>
        <p className="font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{children}</p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-[var(--muted-foreground)]">{subtitle}</p>}
      </div>
      {cta}
    </div>
  );
}

"use client";

import { ScrollReveal } from "@/components/motion";
import { useLocale, useTranslations } from "next-intl";

type Testimonial = {
  name: string;
  role: string;
  body: string;
  bodyArabic: string;
  initials: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ahmed K.",
    role: "Funded trader · FTMO 100k",
    initials: "AK",
    rating: 5,
    body: "The risk-management course alone paid back the subscription in a week. The watermark on every video is a nice trust touch.",
    bodyArabic:
      "دورة إدارة المخاطر وحدها أعادت قيمة الاشتراك خلال أسبوع. والعلامة المائية على كل فيديو لمسة موثوقية رائعة.",
  },
  {
    name: "Lina M.",
    role: "Day trader · 2 years",
    initials: "LM",
    rating: 5,
    body: "I've taken three other prop trading programs. This is the only one with instructors who actually publish their funded accounts.",
    bodyArabic:
      "أخذت ثلاثة برامج تداول أخرى. هذا الوحيد الذي يعرض فيه المدربون حساباتهم الممولة بشكل فعلي.",
  },
  {
    name: "Yusuf R.",
    role: "New trader",
    initials: "YR",
    rating: 5,
    body: "The classroom UX is sharp — quizzes between modules made everything stick. Got my certificate in 6 weeks.",
    bodyArabic:
      "تجربة الفصل الدراسي رائعة — الاختبارات بين الوحدات جعلت كل شيء يثبت في ذهني. حصلت على شهادتي خلال 6 أسابيع.",
  },
];

/**
 * Phosphor Terminal Noir — fills.
 * Testimonials printed as trade confirmations: a mono header bar carrying the
 * fill index and the rating as a numeral beside an amber LED, the quote as
 * the order note, and the counterparty (student) in the settlement row.
 */
export function PhosphorFills() {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-balance text-3xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {TESTIMONIALS.map((tm, i) => (
            <ScrollReveal key={tm.name} delay={i * 0.1} amount={0.3}>
              <FillCard testimonial={tm} index={String(i + 1).padStart(2, "0")} isAr={isAr} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FillCard({
  testimonial,
  index,
  isAr,
}: {
  testimonial: Testimonial;
  index: string;
  isAr: boolean;
}) {
  const body = isAr ? testimonial.bodyArabic : testimonial.body;

  return (
    <article className="dxphosphor-card flex h-full flex-col">
      {/* Confirmation header — language-neutral mono */}
      <div
        aria-hidden
        className="flex items-center justify-between border-b border-[var(--border)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]"
      >
        <span>FILL {index}</span>
        <span className="flex items-center gap-1.5 text-[var(--dxphosphor-amber)]">
          {testimonial.rating.toFixed(1)}
          <span className="dxphosphor-led dxphosphor-led--amber" />
        </span>
      </div>

      <p className="flex-1 p-5 text-[15px] leading-relaxed text-[var(--foreground)]">{body}</p>

      {/* Settlement row */}
      <div className="flex items-center gap-3 border-t border-[var(--border)] px-5 py-4">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center border border-[var(--border)] bg-[var(--secondary)] font-mono text-xs font-semibold text-[var(--primary)]"
        >
          {testimonial.initials}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold">{testimonial.name}</span>
          <span className="block text-xs text-[var(--muted-foreground)]">{testimonial.role}</span>
        </span>
      </div>
    </article>
  );
}

"use client";

import { ScrollReveal } from "@/components/motion";
import { useLocale, useTranslations } from "next-intl";

import { BurnHeading } from "./section-heading";

type Fill = {
  name: string;
  role: string;
  body: string;
  bodyArabic: string;
  initials: string;
  rating: string;
};

/* Same voices as the shared testimonials section, retyped as trade fills. */
const FILLS: Fill[] = [
  {
    name: "Ahmed K.",
    role: "Funded trader · FTMO 100k",
    initials: "AK",
    rating: "5.0",
    body: "The risk-management course alone paid back the subscription in a week. The watermark on every video is a nice trust touch.",
    bodyArabic:
      "دورة إدارة المخاطر وحدها أعادت قيمة الاشتراك خلال أسبوع. والعلامة المائية على كل فيديو لمسة موثوقية رائعة.",
  },
  {
    name: "Lina M.",
    role: "Day trader · 2 years",
    initials: "LM",
    rating: "5.0",
    body: "I've taken three other prop trading programs. This is the only one with instructors who actually publish their funded accounts.",
    bodyArabic:
      "أخذت ثلاثة برامج تداول أخرى. هذا الوحيد الذي يعرض فيه المدربون حساباتهم الممولة بشكل فعلي.",
  },
  {
    name: "Yusuf R.",
    role: "New trader",
    initials: "YR",
    rating: "5.0",
    body: "The classroom UX is sharp — quizzes between modules made everything stick. Got my certificate in 6 weeks.",
    bodyArabic:
      "تجربة الفصل الدراسي رائعة — الاختبارات بين الوحدات جعلت كل شيء يثبت في ذهني. حصلت على شهادتي خلال 6 أسابيع.",
  },
];

/**
 * Controlled Burn testimonials — "filled orders": each voice is a trade
 * confirmation card with a heat-seam top edge, a tape tag, and the rating
 * as a tabular-mono figure. The ember stays on the seams; text stays calm.
 */
export function BurnTestimonials() {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <BurnHeading index="05" title={t("title")} sub={t("subtitle")} />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {FILLS.map((fill, i) => (
            <ScrollReveal key={fill.name} delay={i * 0.08} amount={0.3}>
              <article className="dxburn-card dxburn-seam flex h-full flex-col gap-5 p-7">
                <div className="flex items-center justify-between">
                  <span className="dxburn-micro">FILL · 0{i + 1}</span>
                  <span
                    dir="ltr"
                    className="font-mono text-sm font-semibold text-[var(--accent)] [font-variant-numeric:tabular-nums]"
                  >
                    {fill.rating} ★
                  </span>
                </div>
                <p className="flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">
                  {isAr ? fill.bodyArabic : fill.body}
                </p>
                <div aria-hidden className="dxburn-hairline" />
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full font-display text-sm font-semibold text-[var(--primary)]"
                    style={{
                      background: "color-mix(in oklch, var(--primary) 14%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--primary) 35%, transparent)",
                    }}
                  >
                    {fill.initials}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{fill.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{fill.role}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

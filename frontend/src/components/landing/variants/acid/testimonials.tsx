"use client";

import { useLocale, useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { AcidSectionHeader } from "./section-header";
import { SnapIn } from "./snap";

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
 * Acid Ledger testimonials — filled-order slips: three tilted confirmation
 * sheets stacked on the desk, each headed by a mono fill number and a magenta
 * star run, closed by a ledger rule with the trader's initials in the one
 * circle the identity allows.
 */
export function AcidTestimonials() {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <AcidSectionHeader center title={t("title")} sub={t("subtitle")} />

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {TESTIMONIALS.map((tm, i) => (
            <SnapIn key={tm.name} delay={i * 0.1}>
              <div
                className="dxacid-tiltwrap h-full"
                style={{ "--dxacid-tilt": i % 2 === 0 ? "-1.2deg" : "1.1deg" } as CSSProperties}
              >
                <SlipCard testimonial={tm} index={i} isAr={isAr} />
              </div>
            </SnapIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function SlipCard({
  testimonial,
  index,
  isAr,
}: {
  testimonial: Testimonial;
  index: number;
  isAr: boolean;
}) {
  const body = isAr ? testimonial.bodyArabic : testimonial.body;

  return (
    <article className="dxacid-hard flex h-full flex-col gap-4 p-6">
      <div
        className="flex items-center justify-between border-b-2 border-[var(--dxacid-line)] pb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]"
        aria-hidden
      >
        <span>
          № {String(index + 1).padStart(2, "0")} <span className="dxacid-up">✓</span>
        </span>
        <span className="text-[var(--accent)]">{"★".repeat(testimonial.rating)}</span>
      </div>

      <p className="flex-1 text-[15px] leading-relaxed">{body}</p>

      <div className="flex items-center gap-3 border-t-2 border-[var(--dxacid-line)] pt-4">
        <span
          className="grid size-10 shrink-0 place-items-center border-2 border-[var(--dxacid-line)] bg-[var(--secondary)] font-mono text-sm font-semibold text-[var(--dxacid-up)]"
          style={{ borderRadius: "9999px" }}
          aria-hidden
        >
          {testimonial.initials}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-bold">{testimonial.name}</span>
          <span className="block font-mono text-xs text-[var(--muted-foreground)]">
            {testimonial.role}
          </span>
        </span>
      </div>
    </article>
  );
}
